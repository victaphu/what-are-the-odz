# Odz: Interactive Event Engagement Platform

## Blockchain Architecture

Odz leverages two main smart contracts to manage its tokenomics and event logic:

### Odz20.sol
- ERC20 token contract for the ODZ utility token
- Implements role-based access control for minting
- Allows the Odz1155 contract to mint tokens as rewards

### Odz1155.sol
- ERC1155 token contract for managing events, questions, and user interactions
- Implements complex event logic and token economics

#### Key Features:

1. Event Management:
   - Events are created with unique IDs, start/end times, and organizer addresses
   - Participants join events by staking ODZ tokens
   - Event tokens (ERC1155) are minted to represent participation and rewards

2. Question and Choice Mechanism:
   - Questions can be proposed within events, with a cost in ODZ tokens
   - Each question has multiple choices
   - Participants place bets on choices using ODZ tokens

3. Attestation System:
   - Implements the ISPHook interface for integration with EthSign (Sign Protocol)
   - Attestations are recorded for each question
   - A quorum system determines the final result of each question

4. Token Economics:
   - Join rewards, creator fees, and betting amounts are managed in ODZ tokens
   - Dynamic odds calculation based on bet distribution
   - Payout system for winning bets and stake returns

5. Security Features:
   - Token transfers are locked during active events
   - Only the contract itself can be approved for token transfers


## Getting Started
This architecture enables a decentralized, transparent, and engaging event participation system, where user actions and outcomes are securely recorded on the blockchain.  

To test this out follow these steps:


```shell
cp .env.example .env
# add your own private key with arbitrum sepolia gas if you plan to deploy remotely
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Odz1155.ts --network localhost
```

## Deployed Contracts
Hardhat project deployed at:  
```Hardhat Ignition 🚀

Deploying [ OdzModule ]

Batch #1
  Executed OdzModule#Odz1155
  Executed OdzModule#Odz20

Batch #2
  Executed OdzModule#Odz1155.setOdzCoin
  Executed OdzModule#Odz20.grantMinterRole

[ OdzModule ] successfully deployed 🚀

Deployed Addresses

OdzModule#Odz1155 - 0x9DeD70f2cbc2E04B0E3e6f6a15f54AB8523EC845
OdzModule#Odz20 - 0x9b54c822A39D9c1b4e4D61A1768e59EDC5c53784
```

## Sign Protocol Integration
https://testnet-scan.sign.global/schema/onchain_evm_421614_0xdf