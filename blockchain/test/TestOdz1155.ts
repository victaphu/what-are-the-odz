
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Odz1155", function () {
  async function deployOdz1155Fixture() {
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const Odz1155 = await ethers.getContractFactory("Odz1155");
    const odz1155 = await Odz1155.deploy();

    return { odz1155, owner, addr1, addr2, addr3, addr4 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { odz1155, owner } = await loadFixture(deployOdz1155Fixture);
      expect(await odz1155.owner()).to.equal(owner.address);
    });
  });

  describe("Event Creation", function () {
    it("Should create an event", async function () {
      const { odz1155, owner } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600; // 1 hour from now
      const endTime = startTime + 86400; // 24 hours after start

      await expect(odz1155.createEvent(startTime, endTime))
        .to.emit(odz1155, "TransferSingle")
        .withArgs(owner.address, ethers.ZeroAddress, owner.address, 1, 0);

      const event = await odz1155.events(1);
      expect(event.startTime).to.equal(startTime);
      expect(event.endTime).to.equal(endTime);
      expect(event.organizer).to.equal(owner.address);
    });

    it("Should fail to create an event with invalid time range", async function () {
      const { odz1155 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime - 1;

      await expect(odz1155.createEvent(startTime, endTime)).to.be.revertedWith("Invalid time range");
    });
  });

  describe("Joining Event", function () {
    it("Should allow a user to join an event", async function () {
      const { odz1155, owner, addr1 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime + 86400;

      await odz1155.createEvent(startTime, endTime);
      await time.increaseTo(startTime);

      await expect(odz1155.connect(addr1).joinEvent(1))
        .to.emit(odz1155, "TransferSingle")
        .withArgs(addr1.address, ethers.ZeroAddress, addr1.address, 1, 100);

      const event = await odz1155.events(1);
      expect(event.participantCount).to.equal(2); // creator also joined
    });

    it("Should fail to join an event that hasn't started", async function () {
      const { odz1155, addr1 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime + 86400;

      await odz1155.createEvent(startTime, endTime);

      await expect(odz1155.connect(addr1).joinEvent(1)).to.be.revertedWith("Event not active");
    });
  });

  describe("Question Proposal", function () {
    it("Should allow a participant to propose a question", async function () {
      const { odz1155, owner, addr1 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime + 86400;

      await odz1155.createEvent(startTime, endTime);
      await time.increaseTo(startTime);

      await odz1155.connect(addr1).joinEvent(1);
      await expect(odz1155.connect(addr1).proposeQuestion(1, 2))
        .to.emit(odz1155, "TransferSingle")
        .withArgs(addr1.address, addr1.address, ethers.ZeroAddress, 1, 10);

      const event = await odz1155.events(1);
      expect(event.questionCount).to.equal(1);
    });
  });

  describe("Betting", function () {
    it("Should allow a participant to place a bet", async function () {
      const { odz1155, owner, addr1 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime + 86400;

      await odz1155.createEvent(startTime, endTime);
      await time.increaseTo(startTime);

      await odz1155.connect(addr1).joinEvent(1);
      await odz1155.connect(addr1).proposeQuestion(1, 2);

      await expect(odz1155.connect(addr1).placeBet(1, 0, 0))
        .to.emit(odz1155, "TransferSingle")
        .withArgs(addr1.address, addr1.address, ethers.ZeroAddress, 1, 5);
    });
  });

  describe("Event Conclusion", function () {
    it("Should allow the organizer to conclude the event", async function () {
      const { odz1155, owner, addr1 } = await loadFixture(deployOdz1155Fixture);
      const startTime = await time.latest() + 3600;
      const endTime = startTime + 86400;

      await odz1155.createEvent(startTime, endTime);
      await time.increaseTo(startTime);

      await odz1155.connect(addr1).joinEvent(1);
      await time.increaseTo(endTime + 1);

      await expect(odz1155.concludeEvent(1))
        .to.not.be.reverted;

      const event = await odz1155.events(1);
      expect(event.concluded).to.be.true;

      console.log(await odz1155.getEvents());
    });
  });
});

describe("Odz1155 End-to-End Game Simulation", function () {
  async function deployOdz1155Fixture() {
    const [owner, alice, bob, charlie, david, eve] = await ethers.getSigners();

    const Odz1155 = await ethers.getContractFactory("Odz1155");
    const odz1155 = await Odz1155.deploy();


    const Odz20 = await ethers.getContractFactory("Odz20");
    const odz20 = await Odz20.deploy();

    await odz1155.setOdzCoin(await odz20.getAddress());
    await odz20.grantMinterRole(await odz1155.getAddress());

    return { odz1155, odz20, owner, alice, bob, charlie, david, eve };
  }

  it("Should simulate a complete game with 5 players and 3 events", async function () {
    const { odz1155, odz20, owner, alice, bob, charlie, david, eve } = await loadFixture(deployOdz1155Fixture);
    const players = [alice, bob, charlie, david, eve];

    // 1. Create Events
    const currentTime = await time.latest();
    const eventDuration = 86400; // 1 day
    await odz1155.createEvent(currentTime, currentTime + eventDuration); // Football Game
    await odz1155.createEvent(currentTime, currentTime + eventDuration * 2); // Wedding
    await odz1155.createEvent(currentTime, currentTime + eventDuration * 3); // Conference

    // 2. Join Events
    for (let eventId = 1; eventId <= 3; eventId++) {
      for (const player of players) {
        await odz1155.connect(player).joinEvent(eventId);
        expect(await odz1155.balanceOf(player.address, eventId)).to.equal(90);
      }
      expect(await odz1155.balanceOf(owner.address, eventId)).to.equal(50); // 10 per player
    }

    // 3. Propose Questions
    const questionProposers = [
      [alice, bob, charlie],
      [david, eve, alice],
      [bob, charlie, david]
    ];

    for (let eventId = 1; eventId <= 3; eventId++) {
      for (const proposer of questionProposers[eventId - 1]) {
        await odz1155.connect(proposer).proposeQuestion(eventId, 3);
      }
      expect((await odz1155.events(eventId)).questionCount).to.equal(3);
    }

    // 4. Place Bets
    for (let eventId = 1; eventId <= 3; eventId++) {
      for (let questionId = 0; questionId < 3; questionId++) {
        for (const player of players) {
          await odz1155.connect(player).placeBet(eventId, questionId, Math.floor(Math.random() * 3));
        }
      }
    }

    // add schema id
    await odz1155.setEventSchemaId(1)

    // 5. Attest Answers (simulating SIGN protocol)
    for (let eventId = 1; eventId <= 3; eventId++) {
      for (let questionId = 0; questionId < 3; questionId++) {
        for (const player of players) {
          const choice = Math.floor(Math.random() * 3);

          await odz1155["didReceiveAttestation(address,uint64,uint64,bytes)"](
            player.address,
            1, // using eventId as schemaId for simplicity
            1, // attestationId (not used in our logic)
            ethers.AbiCoder.defaultAbiCoder().encode(['uint256', 'uint256', 'uint256'], [eventId, questionId, choice])
          );
          const event = await odz1155.getEventDetails(eventId);
          if (event.questions[questionId].hasQuorum) {
            break;
          }
        }
      }
    }

    // 6. Conclude Events
    await time.increase(eventDuration * 3);
    for (let eventId = 1; eventId <= 3; eventId++) {
      await odz1155.connect(owner).concludeEvent(eventId);
      expect((await odz1155.events(eventId)).concluded).to.be.true;
    }

    // // 7. Claim Winnings
    // for (const player of players) {
    //   for (let eventId = 1; eventId <= 3; eventId++) {
    //     for (let questionId = 0; questionId < 3; questionId++) {
    //       await odz1155.connect(player).claimAllOdz();
    //     }
    //   }
    // }

    // 8. Claim All ODZ
    for (const player of players) {
      const unclaimedBefore = await odz1155.unclaimedOdz(player.address);
      console.log('all odds', unclaimedBefore);
      if (Number(unclaimedBefore) === 0) {
        continue;
      }
      await odz1155.connect(player).claimAllOdz();
      expect(await odz1155.unclaimedOdz(player.address)).to.equal(0);
      expect(await odz20.balanceOf(player.address)).to.equal(unclaimedBefore);
    }

    // 9. Verify Final State
    for (let eventId = 1; eventId <= 3; eventId++) {
      expect((await odz1155.events(eventId)).concluded).to.be.true;
      const event = await odz1155.getEventDetails(eventId);
      for (let questionId = 0; questionId < 3; questionId++) {
        expect(event.questions[questionId].hasQuorum).to.be.true;
      }
    }
  });
});