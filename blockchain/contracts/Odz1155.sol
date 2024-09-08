// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISPHook.sol";

interface IOdz20 {
    function mint(address to, uint256 amount) external;
}

contract Odz1155 is ERC1155, ERC1155Burnable, Ownable, ISPHook {
    uint256 public _eventIds;
    IOdz20 public _odzCoin;

    struct Choice {
        uint256 totalBets;
        mapping(address => uint256) userBets;
    }

    struct Question {
        mapping(uint256 => Choice) choices;
        uint256 choiceCount;
        uint256 totalBets;
        mapping(address => bool) answered;
        mapping(address => bool) attested;
        mapping(address => uint256) attestations;
        uint256 attestationCount;
        uint256 result;
        bool hasQuorum;
    }

    struct Event {
        uint256 startTime;
        uint256 endTime;
        uint256 participantCount;
        uint256 questionCount;
        address organizer;
        bool concluded;
        mapping(uint256 => Question) questions;
        mapping(address => bool) participants;
        address[] participantsList;
    }

    mapping(uint256 => Event) public events;
    mapping(address => mapping(uint256 => uint256)) public userStakes;
    // mapping(uint256 => uint64) public eventSchemaIds;
    uint256 public eventSchemaId;
    mapping(address => uint256) public unclaimedOdz;

    uint256 public constant JOIN_REWARD = 100;
    uint256 public constant CREATOR_FEE = 10;
    uint256 public constant STAKE_AMOUNT = 10;
    uint256 public constant BET_AMOUNT = 5;
    uint256 public constant PROPOSE_COST = 10;
    uint256 public constant QUORUM_PERCENTAGE = 51;
    uint256 public constant ODDS_PRECISION = 1e18;

    constructor()
        ERC1155("https://api.example.com/token/{id}.json")
        Ownable(msg.sender)
    {}

    struct ActiveEventInfo {
        uint256 eventId;
        uint256 startTime;
        uint256 endTime;
        address organizer;
        QuestionInfo[] questions;
    }

    struct QuestionInfo {
        uint256 questionId;
        uint256 choiceCount;
        uint256 totalBets;
        uint256 attestationCount;
        uint256 result;
        bool hasQuorum;
        ChoiceInfo[] choices;
    }

    struct ChoiceInfo {
        uint256 choiceId;
        uint256 totalBets;
    }

    function getEventDetails(
        uint256 _eventId
    ) public view returns (ActiveEventInfo memory) {
        Event storage event_ = events[_eventId];

        QuestionInfo[] memory questions = new QuestionInfo[](
            event_.questionCount
        );
        for (uint256 j = 0; j < event_.questionCount; j++) {
            Question storage question = event_.questions[j];

            ChoiceInfo[] memory choices = new ChoiceInfo[](
                question.choiceCount
            );
            for (uint256 k = 0; k < question.choiceCount; k++) {
                choices[k] = ChoiceInfo({
                    choiceId: k,
                    totalBets: question.choices[k].totalBets
                });
            }

            questions[j] = QuestionInfo({
                questionId: j,
                choiceCount: question.choiceCount,
                totalBets: question.totalBets,
                attestationCount: question.attestationCount,
                result: question.result,
                hasQuorum: question.hasQuorum,
                choices: choices
            });
        }

        return
            ActiveEventInfo({
                eventId: _eventId,
                startTime: event_.startTime,
                endTime: event_.endTime,
                organizer: event_.organizer,
                questions: questions
            });
    }

    function getEvents() public view returns (ActiveEventInfo[] memory) {
        uint256 activeEventCount = _eventIds;

        ActiveEventInfo[] memory activeEvents = new ActiveEventInfo[](
            activeEventCount
        );
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _eventIds; i++) {
            activeEvents[currentIndex] = getEventDetails(i);
            currentIndex++;
        }

        return activeEvents;
    }

    function setOdzCoin(IOdz20 odzCoin) external onlyOwner {
        require(address(odzCoin) != address(0), "Invalid address");
        require(address(_odzCoin) == address(0), "Already set");
        _odzCoin = odzCoin;
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override {
        require(operator == address(this), "Can only approve this contract");
        super.setApprovalForAll(operator, approved);
    }

    function createEvent(uint256 _startTime, uint256 _endTime) external {
        require(_startTime < _endTime, "Invalid time range");
        _eventIds += 1;
        uint256 newEventId = _eventIds;

        Event storage newEvent = events[newEventId];
        newEvent.startTime = _startTime;
        newEvent.endTime = _endTime;
        newEvent.organizer = msg.sender;

        newEvent.participants[msg.sender] = true;
        newEvent.participantCount++;
        newEvent.participantsList.push(msg.sender);

        _mint(msg.sender, newEventId, 0, "");
    }

    function joinEvent(uint256 _eventId) external {
        Event storage event_ = events[_eventId];
        require(
            block.timestamp >= event_.startTime &&
                block.timestamp <= event_.endTime,
            "Event not active"
        );
        require(!event_.participants[msg.sender], "Already joined");

        event_.participants[msg.sender] = true;
        event_.participantsList.push(msg.sender);
        event_.participantCount++;

        _mint(msg.sender, _eventId, JOIN_REWARD, "");
        _mint(event_.organizer, _eventId, CREATOR_FEE, "");

        // Transfer stake from user to contract
        require(
            balanceOf(msg.sender, _eventId) >= STAKE_AMOUNT,
            "Insufficient balance for stake"
        );
        _burn(msg.sender, _eventId, STAKE_AMOUNT);
        userStakes[msg.sender][_eventId] = STAKE_AMOUNT;
    }

    function proposeQuestion(uint256 _eventId, uint256 _choiceCount) external {
        Event storage event_ = events[_eventId];
        require(event_.participants[msg.sender], "Not a participant");
        require(_choiceCount >= 2, "At least 2 choices required");
        require(
            balanceOf(msg.sender, _eventId) >= PROPOSE_COST,
            "Insufficient balance"
        );

        _burn(msg.sender, _eventId, PROPOSE_COST);

        uint256 questionId = event_.questionCount;
        Question storage newQuestion = event_.questions[questionId];
        newQuestion.choiceCount = _choiceCount;

        event_.questionCount++;
    }

    function placeBet(
        uint256 _eventId,
        uint256 _questionId,
        uint256 _choiceId
    ) external {
        Event storage event_ = events[_eventId];
        Question storage question = event_.questions[_questionId];
        require(event_.participants[msg.sender], "Not a participant");
        require(!question.answered[msg.sender], "Already answered");
        require(
            balanceOf(msg.sender, _eventId) >= BET_AMOUNT,
            "Insufficient balance"
        );
        require(_choiceId < question.choiceCount, "Invalid choice");

        _burn(msg.sender, _eventId, BET_AMOUNT);

        question.answered[msg.sender] = true;
        question.choices[_choiceId].totalBets += BET_AMOUNT;
        question.choices[_choiceId].userBets[msg.sender] += BET_AMOUNT;
        question.totalBets += BET_AMOUNT;
    }

    function concludeEvent(uint256 _eventId) external {
        Event storage event_ = events[_eventId];
        require(msg.sender == event_.organizer, "Only organizer can conclude");
        require(block.timestamp > event_.endTime, "Event not ended");
        require(!event_.concluded, "Event already concluded");

        event_.concluded = true;

        for (uint256 i = 0; i < event_.questionCount; i++) {
            Question storage question = event_.questions[i];
            if (question.hasQuorum) {
                uint256 result = question.result;
                for (uint256 j = 0; j < event_.participantCount; j++) {
                    address participant = event_.participantsList[j];
                    if (question.attestations[participant] == result) {
                        uint256 userBet = question.choices[result].userBets[
                            participant
                        ];
                        uint256 odds = getOdds(_eventId, i, result);
                        uint256 payout = (userBet * odds) / ODDS_PRECISION;
                        unclaimedOdz[participant] += payout;

                        // Add stake return
                        unclaimedOdz[participant] += userStakes[participant][
                            _eventId
                        ];
                    } else {
                        // Burn stake for incorrect attestation
                        userStakes[participant][_eventId] = 0;
                    }
                }
            }
        }
    }

    function claimAllOdz() external {
        uint256 amount = unclaimedOdz[msg.sender];
        require(amount > 0, "No ODZ to claim");

        unclaimedOdz[msg.sender] = 0;
        _odzCoin.mint(msg.sender, amount);
    }

    function getOdds(
        uint256 _eventId,
        uint256 _questionId,
        uint256 _choiceId
    ) public view returns (uint256) {
        Event storage event_ = events[_eventId];
        Question storage question = event_.questions[_questionId];
        require(_choiceId < question.choiceCount, "Invalid choice");

        if (
            question.totalBets == 0 ||
            question.choices[_choiceId].totalBets == 0
        ) {
            return 10 * ODDS_PRECISION; // 10x odds if no bets on this choice
        }

        return
            (question.totalBets * ODDS_PRECISION) /
            question.choices[_choiceId].totalBets;
    }

    function getPotentialPayout(
        uint256 _eventId,
        uint256 _questionId,
        uint256 _choiceId
    ) public view returns (uint256) {
        uint256 odds = getOdds(_eventId, _questionId, _choiceId);
        return (BET_AMOUNT * odds) / ODDS_PRECISION;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
            events[id].concluded || block.timestamp > events[id].endTime,
            "Transfers locked during active event"
        );
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                events[ids[i]].concluded ||
                    block.timestamp > events[ids[i]].endTime,
                "Transfers locked during active event"
            );
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function setEventSchemaId(uint64 _schemaId) external onlyOwner {
        eventSchemaId = _schemaId;
    }
    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) external payable override {
        (uint256 eventId, uint256 questionId, uint256 choiceId) = abi.decode(
            extraData,
            (uint256, uint256, uint256)
        );

        require(eventSchemaId == schemaId, "Invalid schema for event");

        Event storage event_ = events[eventId];
        Question storage question = event_.questions[questionId];

        require(event_.participants[attester], "Not a participant");
        require(!question.attested[attester], "Already attested");
        require(!question.hasQuorum, "Question already resolved");

        question.attested[attester] = true;
        question.attestations[attester] = choiceId;
        question.attestationCount++;

        if (
            (question.attestationCount * 100) / event_.participantCount >=
            QUORUM_PERCENTAGE
        ) {
            question.hasQuorum = true;
            question.result = choiceId;
        }

        emit AttestationReceived(attester, eventId, questionId, choiceId);
    }

    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external override {
        // This function is not used in our implementation, but we need to include it to satisfy the interface
        revert("ERC20 fee not supported");
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) external payable override {
        // Implement revocation logic if needed
        revert("Revocation not supported");
    }

    function didReceiveRevocation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData
    ) external override {
        // This function is not used in our implementation, but we need to include it to satisfy the interface
        revert("ERC20 fee not supported");
    }

    event AttestationReceived(
        address attester,
        uint256 eventId,
        uint256 questionId,
        uint256 choiceId
    );
}
