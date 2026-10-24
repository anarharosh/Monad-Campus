# MonadCampus & Guild - Submission Checklist

> **For Final Submission & Live Demonstration at Monad Blitz Ankara**

---

## 1. Pre-Submission Checklist (Before Submitting to Judges)

### Code Quality & Repository
- [ ] **GitHub Repository** - Clean, public/private as required, with proper .gitignore
- [ ] **README.md** - Complete with hero banner, badges, features, architecture diagram, setup guide
- [ ] **All Files Committed** - Smart contracts, frontend, scripts, docs all present
- [ ] **No Hardcoded Secrets** - .env not committed, only .env.example present
- [ ] **Clean Code** - Comments added where necessary, no console.logs in production paths
- [ ] **License Added** - MIT License file present

### Smart Contracts
- [ ] **Contract Compiles** - `npm run compile` runs without errors
- [ ] **OpenZeppelin Imports** - ReentrancyGuard, Ownable, Pausable correctly imported
- [ ] **Gas Optimized** - Clean storage layout, efficient loops
- [ ] **Events Emitted** - All major actions emit events for indexing
- [ ] **Security Checks** - Zero-address, reentrancy, pausable modifiers in place
- [ ] **Monad Optimized** - Comments explaining parallel execution considerations
- [ ] **Deployment Script Ready** - deploy.js tested and configured for Monad Testnet

### Frontend
- [ ] **index.html Valid** - No HTML errors, all sections present
- [ ] **styles.css Complete** - All components styled, responsive design
- [ ] **app.js Functional** - All interactivity working
- [ ] **Demo Simulator Included** - demoSimulator.js for fallback mode
- [ ] **Assets Load** - Fonts, icons, all resources load correctly
- [ ] **Mobile Responsive** - Tested on mobile viewport

### Documentation
- [ ] **PITCH_DECK.md** - All 6 slides complete with visuals description
- [ ] **PITCH_SCRIPT.md** - 2-minute script with timing cues
- [ ] **DEMO_FLOW.md** - Step-by-step demo execution
- [ ] **Architecture Diagram** - Clear workflow diagram in README

---

## 2. Smoke Test Checklist (5-10 Minutes Before Demo)

### Environment Setup
- [ ] **Laptop Charged** - 100% or plugged in
- [ ] **Browser Ready** - Chrome/Edge with cache cleared
- [ ] **Local Server Running** - `npx serve .` or `python -m http.server 8000`
- [ ] **Demo Files Loaded** - index.html opens without errors
- [ ] **Console Clean** - No red errors in browser DevTools

### UI Responsiveness
- [ ] **Header Navigation** - All links scroll smoothly
- [ ] **Hero Section** - Animations play, metrics display correctly
- [ ] **Leaderboard** - Loads with 8 guilds, tabs switch properly
- [ ] **Bounties Section** - All 3 grants display with progress bars
- [ ] **Student Dashboard** - Profile, XP bar, badges display
- [ ] **Staking Simulator** - Sliders work, calculations update
- [ ] **Footer** - All links present, live block counter updating

### Wallet Connection
- [ ] **Connect Button** - Opens wallet modal
- [ ] **Wallet Options** - All 4 wallets displayed
- [ ] **Demo Mode Fallback** - If no wallet, enters demo mode gracefully
- [ ] **Toast Notifications** - Appear on actions
- [ ] **Address Display** - Shows truncated address when connected

### Interactivity Testing
- [ ] **Leaderboard Filter** - TVL/Activity/Students tabs switch correctly
- [ ] **Staking Simulator** - Guild selector changes, amount slider works, lock duration changes
- [ ] **Stake Button** - Opens stake modal
- [ ] **Stake Modal** - Amount input, chips, use max button work
- [ ] **Confirm Stake** - Shows success toast
- [ ] **Leaderboard Updates** - Rank changes after stake (in demo mode)
- [ ] **Claim Bounty** - Opens grant details, claim button works
- [ ] **Badge Modal** - Clicking badge shows details
- [ ] **Mobile Menu** - Hamburger menu works on mobile view

### Web3 Integration
- [ ] **Contract ABI Ready** - monadContract.js has correct ABI
- [ ] **Demo Simulator Loaded** - demoSimulator.js accessible
- [ ] **Fallback Works** - Actions work without real wallet
- [ ] **Network Detection** - Checks for Monad Testnet
- [ ] **Error Handling** - Graceful errors, no crashes

### Presentation Prep
- [ ] **Screen Share Ready** - Browser in full screen/windowed as preferred
- [ ] **Demo Flow Practiced** - Ran through 60-second demo 2-3 times
- [ ] **Timing Checked** - Under 2 minutes for pitch
- [ ] **Backup Plan** - Can demo in offline mode if internet fails
- [ ] **Pitch Script Ready** - On second screen or printed
- [ ] **Q&A Prep Reviewed** - Top 3 questions and answers memorized

---

## 3. Rapid Troubleshooting Guide

| Issue | Quick Fix | Priority |
| :-- | :-- | :-- |
| **Page won't load** | Use local server (`npx serve .`) instead of file:// | HIGH |
| **Animations laggy** | Close other tabs, disable extensions | MEDIUM |
| **Modal won't close** | Click backdrop or ESC key, refresh if stuck | HIGH |
| **Toast stuck** | Click X or wait for auto-dismiss | LOW |
| **Demo mode not triggering** | Check console, refresh page | HIGH |
| **Leaderboard not updating** | Click refresh button or trigger stake action | MEDIUM |
| **Mobile view broken** | Resize browser or use actual device | MEDIUM |

---

## 4. Final Submission Checklist

- [ ] **GitHub Link Ready** - Shared with judges/team
- [ ] **All Documentation Complete** - README, PITCH_DECK, PITCH_SCRIPT, DEMO_FLOW, CHECKLIST
- [ ] **Demo Tested Live** - Full run-through successful
- [ ] **Contracts Deployed** (if possible) - Or have deployment ready
- [ ] **Team Info Ready** - Names, roles for introduction
- [ ] **Project Description** - Elevator pitch ready
- [ ] **Contact Info** - Available for questions

---

## 5. Quick Commands Reference

```bash
# Start local demo server
npx serve . -l 8000

# Compile contracts
npm run compile

# Deploy to Monad Testnet
npm run deploy:testnet

# Open in browser
start http://localhost:8000
```

---

**Status:** ✅ Ready for Submission & Live Demo  
**Last Updated:** October 24, 2026  
**Team:** MonadCampus Team
