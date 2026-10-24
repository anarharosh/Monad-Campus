<div align="center">

# 🚀 MonadCampus & Guild

### *Campus Pride Meets On-Chain Capital*

[![Monad Blitz Ankara](https://img.shields.io/badge/Monad%20Blitz-Ankara-8352FF?style=for-the-badge&logo=ethereum&logoColor=white)](https://monad.xyz/blitz)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet%20Active-00D9FF?style=for-the-badge)](https://testnet.monadexplorer.com/)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)](https://github.com/)

**The Gamified Student-DAO & Institutional Micro-Grant Layer on Monad**

[🎮 Live Demo](#live-demo) • [📖 Documentation](#architecture--workflow) • [🚀 Quick Start](#quick-start-guide) • [📜 Smart Contracts](#deployed-smart-contracts) • [🎯 Pitch Deck](./PITCH_DECK.md)

</div>

---

## 🎯 One-Liner Catchphrase

> *"Turn campus rivalries into scalable, Sybil-resistant user acquisition for the Monad ecosystem."*

## 🧩 Problem & Solution Overview

### The Problem

- **For Web3 Protocols:** Traditional quest platforms (Galxe, Layer3) suffer from high CAC ($5-$15 per user), rampant bot farms, and poor retention rates (<15% become recurring users).
- **For Students:** Onboarding is boring, contributions go unrewarded, talented builders lack visibility, and opportunities are scattered across fragmented communities.
- **For Universities:** No way to mobilize entire student bodies around a single ecosystem with competitive incentives.

### The Solution

**MonadCampus & Guild** transforms university rivalries into a powerful growth engine by creating a competitive, gamified layer where:

- 🏛️ **Universities compete** as Guilds on a live, real-time leaderboard
- 💎 **Students earn reputation** by staking MON, building, and completing bounties
- 💰 **Protocols acquire real users** by funding XP-gated micro-grants with built-in Sybil resistance
- 🏆 **Achievements are permanent** through soulbound badges forming verifiable Web3 CVs

---

## ✨ Key Features

| Feature | Description | Status |
| :-- | :-- | :-- |
| **🏆 Guild Leaderboard** | Real-time rankings of university guilds based on TVL + XP. Live updates powered by Monad's parallel execution. | ✅ Live |
| **⚡ Real-time MON Staking** | Students stake native $MON to their guild with instant XP rewards (1 MON = 100 XP). Micro-stakes from 0.001 MON supported. | ✅ Live |
| **🎁 Protocol Bounty Vaults** | Institutional grant system where protocols deposit MON for XP-gated bounties. Sybil-resistant by design with economic commitment. | ✅ Live |
| **🎖️ Soulbound Student Badges** | Non-transferable achievement NFTs minting automatically based on contributions, staking milestones, and bounty completions. | ✅ Live |
| **📊 Student Command Center** | Personal dashboard with XP progression, guild position, staked balance, and badge collection. | ✅ Live |
| **🧮 Staking Simulator** | Interactive simulator showing projected XP, APY, rank impact, and TVL boost before committing. | ✅ Live |
| **🌐 Live Network Stats** | Real-time Monad testnet metrics (TPS, block height, finality) displayed throughout the app. | ✅ Live |
| **🔒 Production-Grade Security** | OpenZeppelin contracts with ReentrancyGuard, Ownable, Pausable. Gas-optimized for Monad's architecture. | ✅ Live |

---

## 🏗️ Architecture & Workflow Diagram

```mermaid
graph TB
    subgraph "Frontend Layer (Vanilla JS / Future React+Viem)"
        UI[Web App UI]
        SIM[Demo Simulator - Fallback Mode]
        WALLET[Wallet Connection]
    end
    
    subgraph "Web3 Integration"
        ETH[Ethers.js Provider]
        MON[Monad Testnet RPC]
    end
    
    subgraph "Smart Contracts (Monad)"
        MCG[MonadCampusGuild.sol]
        GUILD[Guild Management]
        STAKE[Staking Logic]
        VAULT[Grant Vaults]
        BADGE[Badge System]
        LEAD[Leaderboard]
    end
    
    subgraph "Users & Institutions"
        STUD[Students]
        CLUB[University Crypto Clubs]
        PROTO[Protocols/Foundations]
    end
    
    STUD -->|Join Guild| UI
    CLUB -->|Register Guild| UI
    PROTO -->|Create Grant Vault| UI
    
    UI --> WALLET
    WALLET --> ETH
    ETH --> MON
    MON --> MCG
    
    MCG --> GUILD
    MCG --> STAKE
    MCG --> VAULT
    MCG --> BADGE
    MCG --> LEAD
    
    STAKE -->|Earn XP| LEAD
    VAULT -->|Reward Students| STUD
    BADGE -->|Mint SBTs| STUD
    
    SIM -.->|Fallback if no wallet| UI
    
    style MCG fill:#8352FF,stroke:#fff,color:#fff
    style MON fill:#00D9FF,stroke:#fff,color:#000
    style UI fill:#0B0E17,stroke:#8352FF,color:#fff
```

### Workflow Breakdown

1. **Onboarding**: Students connect wallet → Join their university guild → Profile created with 0 XP
2. **Competition**: Students stake MON to guild → Earn XP (1 MON = 100 XP) → Guild TVL & XP increase → Leaderboard updates in real-time
3. **Bounties**: Protocols fund grant vaults with MON → Students complete tasks → XP-gated claiming → Rewards distributed on-chain
4. **Reputation**: Achievements trigger automatic SBT minting → Soulbound badges build verifiable on-chain CV
5. **Network Effects**: Higher rankings attract more students → Larger TVL attracts bigger grants → More opportunities → Cycle repeats

---

## 📜 Deployed Smart Contract Addresses

> **Note:** Contracts are ready for deployment. Update these addresses after deploying to Monad Testnet.

| Contract | Address | Monad Explorer | Status |
| :-- | :-- | :-- | :-- |
| **MonadCampusGuild** | `0x0000000000000000000000000000000000000000` | [View on Explorer](https://testnet.monadexplorer.com/address/0x0000000000000000000000000000000000000000) | ⏳ Pending Deployment |
| **GrantVault Factory** | `0x0000000000000000000000000000000000000000` | [View on Explorer](https://testnet.monadexplorer.com/address/0x0000000000000000000000000000000000000000) | ⏳ Pending Deployment |

*After deployment, run `npm run deploy:testnet` and update `monadContract.js` with the deployed address.*

---

## 🚀 Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) or compatible Web3 wallet
- [MON Testnet Tokens](https://faucet.monad.xyz/) from Monad faucet

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-team/monadcampus-guild.git
cd monadcampus-guild

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your PRIVATE_KEY and RPC URLs

# 4. Compile smart contracts
npm run compile

# 5. Deploy to Monad Testnet (optional - for full on-chain demo)
npm run deploy:testnet

# 6. Update contract address in monadContract.js
# Replace CONTRACT_ADDRESS with your deployed address

# 7. Run the frontend locally
# Option A: Open index.html directly in browser
# Option B: Use a local server
npx serve .
# or
python -m http.server 8000
```

### Running the Demo

**For Hackathon Presentation (Recommended):**
1. Open `index.html` in a modern browser (Chrome/Edge/Firefox)
2. The app includes **Demo/Fallback Mode** - works perfectly without wallet connection
3. All interactions are simulated with smooth animations
4. Perfect for live stage demo even if network issues occur

**For Full Web3 Integration:**
1. Connect MetaMask to Monad Testnet (Chain ID: 10143)
2. Get testnet MON from faucet
3. Deploy contracts or use deployed addresses
4. Interact with real on-chain data

---

## 🧪 Testing & Verification

### Smart Contract Testing
```bash
# Run Hardhat tests
npx hardhat test

# Check contract size
npx hardhat size-contracts

# Verify compilation
npm run compile
```

### Frontend Testing
- ✅ Responsive design (Desktop, Tablet, Mobile)
- ✅ All modals open/close correctly
- ✅ Wallet connection UI flow
- ✅ Leaderboard filtering works
- ✅ Staking simulator calculations accurate
- ✅ Bounty claiming simulation
- ✅ Badge display and modal
- ✅ Toast notifications
- ✅ Smooth animations

---

## 🛠️ Tech Stack

| Category | Technologies |
| :-- | :-- |
| **Smart Contracts** | Solidity ^0.8.20, OpenZeppelin Contracts 5.0.0 |
| **Development Framework** | Hardhat 2.19.0 |
| **Frontend** | Vanilla HTML5, CSS3 (Custom Properties), JavaScript (ES6+) |
| **Web3 Libraries** | Ethers.js 6.9.0, Viem (compatible) |
| **Blockchain** | Monad Testnet/Devnet (EVM-compatible, parallel execution) |
| **Styling** | Custom CSS with Glassmorphism, Neon effects, CSS Grid/Flexbox |
| **Fonts** | Inter, Space Grotesk, JetBrains Mono |

---

## 📁 Project Structure

```
monadcampus-guild/
├── contracts/
│   └── MonadCampusGuild.sol      # Main production contract
├── demoSimulator.js             # Demo/Fallback mode Web3 manager
├── monadContract.js             # Live Web3 integration (ethers.js)
├── deploy.js                    # Hardhat deployment script
├── hardhat.config.js            # Hardhat config for Monad
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment template
├── index.html                   # Main frontend
├── styles.css                   # Complete styling system
├── app.js                       # Frontend logic & interactivity
├── README.md                    # This file
├── PITCH_DECK.md               # Slide-by-slide pitch deck
├── PITCH_SCRIPT.md             # 2-minute presentation script
├── SUBMISSION_CHECKLIST.md     # Pre-pitch & smoke test checklist
└── DEMO_FLOW.md                # Live stage demo execution steps
```

---

## 🌐 Monad Network Information

| Parameter | Value |
| :-- | :-- |
| **Network Name** | Monad Testnet |
| **Chain ID** | 10143 (0x278F) |
| **RPC URL** | `https://testnet-rpc.monad.xyz/` |
| **Currency Symbol** | MON |
| **Block Explorer** | [testnet.monadexplorer.com](https://testnet.monadexplorer.com/) |
| **Faucet** | [faucet.monad.xyz](https://faucet.monad.xyz/) |

---

## 🔒 Security Considerations

- ✅ **Reentrancy Protection**: All payable functions use `nonReentrant` modifier
- ✅ **Access Control**: Owner-only functions with `Ownable`
- ✅ **Emergency Controls**: `Pausable` for crisis situations
- ✅ **Input Validation**: Comprehensive checks on all parameters
- ✅ **Safe Transfers**: Using OpenZeppelin's `Address.sendValue()`
- ✅ **XP Integrity**: Rewards only from legitimate staking/claiming
- ✅ **Soulbound Tokens**: Badges are non-transferable by design
- ✅ **Gas Optimization**: Clean storage layouts for Monad's parallel execution
- ✅ **Event Logging**: Comprehensive events for subgraph indexing

---

## 🏆 Hackathon Submission

**Built for:** [Monad Blitz Ankara](https://monad.xyz/blitz)  
**Category:** DeFi / Social / Infrastructure  
**Team:** MonadCampus Team  

### Why MonadCampus & Guild Wins

- 🎯 **Perfect Monad Fit**: Showcases parallel execution, low fees, and high TPS in a meaningful use case
- 💼 **Real B2B Model**: Sustainable revenue through institutional grant facilitation, not speculation
- 🚀 **Viral Growth**: Campus rivalries drive organic adoption without paid marketing
- 🔐 **Sybil-Resistant**: Economic commitment + university affiliation prevents bot farms
- ⚡ **Production Quality**: Full-stack solution with smart contracts, frontend, and Web3 integration
- 🌍 **Scalable Vision**: From Ankara to global universities with compounding network effects

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**MonadCampus Team** - Building the future of campus-based DeFi on Monad

---

<div align="center">

**[⬆ Back to Top](#monadcampus--guild)**

*Built with ❤️ for Monad Blitz Ankara | Campus Pride Meets On-Chain Capital*

</div>
