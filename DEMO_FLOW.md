# Live Stage Demo Flow - 60 Second Execution Guide

> **For Monad Blitz Ankara Hackathon Presentation**  
> **Time Limit:** 60 seconds | **Format:** Screen Share + Voice Over

---

## Pre-Demo Setup (30 Seconds Before Going On Stage)

- [ ] **Browser Open**: Navigate to `http://localhost:8000` (local server) or `index.html`
- [ ] **Full Screen**: Press F11 or use browser full screen mode
- [ ] **Close Notifications**: Disable all popups/notifications
- [ ] **DevTools Closed**: Ensure console/dev tools are not visible
- [ ] **Demo Simulator Ready**: Page loaded, all animations complete
- [ ] **Audio Check**: Microphone tested and working
- [ ] **Backup Plan**: Have demo in another tab ready if needed

---

## Demo Execution Sequence (60 Seconds)

### Step 1: HOOK & INTRODUCE (0:00 - 0:12) | ~12 seconds

**Action:** Show Hero Section  
**Focus:** Title, tagline, orbital animation

**What to Say:**
> *"Every university has rivalries. What if those rivalries could drive real adoption for Web3? Introducing MonadCampus & Guild - the gamified Student-DAO and institutional liquidity layer on Monad."*

**Visual Cues:**
- Point to "MonadCampus & Guild" brand
- Show orbital animation with guild crests circling Monad core
- Highlight "Season 02 - LIVE" badge

---

### Step 2: CONNECT WALLET & ENTER ARENA (0:12 - 0:18) | ~6 seconds

**Action:** Click "Join a Campus Guild" or "Connect Wallet" button  
**Focus:** Wallet modal / Demo mode activation

**What to Say:**
> *"Let's enter the Campus Arena where universities compete."*

**Visual Cues:**
- Click `#heroJoinButton` or scroll to leaderboard
- Show wallet connection modal (or demo mode toast)
- Watch for "Demo Mode" notification or connected state

**Note:** In demo mode without wallet, it will auto-fallback gracefully

---

### Step 3: SHOW LEADERBOARD & RIVALRY (0:18 - 0:25) | ~7 seconds

**Action:** Navigate to Leaderboard section, switch tabs  
**Focus:** Live standings, METU vs Bilkent rivalry

**What to Say:**
> *"Here in the Campus Arena, METU leads Bilkent by TVL. Every stake moves the rankings in real-time."*

**Visual Cues:**
- Scroll to `#leaderboard` section
- Click "Top TVL" tab (already active) to show standings
- Point to rank #1 (METU) vs #2 (Bilkent)
- Highlight live "SYNCED" indicator

---

### Step 4: STAKE TO GUILD - THE MAGIC MOMENT (0:25 - 0:38) | ~13 seconds

**Action:** Go to Staking Simulator, stake to METU  
**Focus:** Staking interaction and instant impact

**What to Say:**
> *"On Monad, micro-stakes are frictionless. Watch as I stake 50 MON to METU..."*

**Visual Cues:**
- Scroll to `#simulator` section
- Ensure guild is set to METU Monad DAO
- Drag slider to 50,000 or click 50K button (or type 50000)
- Click "Confirm stake" button
- Show stake modal opening

**Then say:**
> *"...earning XP instantly and boosting our guild's position."*

---

### Step 5: SHOW INSTANT IMPACT & LEADERBOARD JUMP (0:38 - 0:47) | ~9 seconds

**Action:** Close modal, return to leaderboard or show updates  
**Focus:** Rank changes, TVL increase, XP earned

**What to Say:**
> *"Rankings update in real-time thanks to Monad's parallel execution. This gamified competition drives engagement that traditional quest platforms simply can't match."*

**Visual Cues:**
- Close stake modal (success toast appears)
- Scroll back to leaderboard
- Point to METU's updated TVL (should show increase)
- Highlight "just now" sync indicator
- Show XP gained in student dashboard if visible

---

### Step 6: PROTOCOL BOUNTIES & CALL TO ACTION (0:47 - 1:00) | ~13 seconds

**Action:** Navigate to Bounties section  
**Focus:** Institutional B2B model

**What to Say:**
> *"But this isn't just a game. Protocols like Monad Labs, Uniswap, and Wormhole fund XP-gated bounties, getting verified student builders with skin in the game. Near-zero gas fees and 10,000 TPS make this viable at scale. We're turning campus rivalries into Monad's growth engine. Thank you!"*

**Visual Cues:**
- Scroll to `#vaults` section
- Show grant vault cards with progress bars
- Point to "Monad Ecosystem Onboarding Grant" (10,000 MON pool)
- Highlight XP requirements and claim functionality
- End with confident gesture

---

## Quick Click Path (Cheat Sheet)

| Order | Element | Action | Purpose |
| :-- | :-- | :-- | :-- |
| 1 | `#heroJoinButton` or scroll | Navigate | Start journey |
| 2 | `#leaderboard` section | View | Show competition |
| 3 | `#tab-tvl` | Click (if needed) | Ensure TVL sort |
| 4 | `#simulator` section | Scroll to | Go to staking |
| 5 | `#simGuild` | Verify METU selected | Set target guild |
| 6 | `[data-amount="50000"]` or slider | Set amount | 50K MON stake |
| 7 | `#simStakeButton` | Click | Open stake modal |
| 8 | `#confirmStake` in modal | Click | Confirm stake (demo) |
| 9 | Close modal / scroll up | Navigate | Show impact |
| 10 | `#vaults` section | Scroll to | Show B2B model |

---

## Timing Tips

- **Don't rush**: Speak clearly, pause between key points
- **Let animations play**: Give 1-2 seconds for smooth transitions
- **Point deliberately**: Use cursor to highlight key elements
- **Stay on track**: Use the 60-second mark as your target
- **Buffer**: Aim for 55-58 seconds to allow for transitions

---

## Contingency Plans

| Scenario | Solution | Notes |
| :-- | :-- | :-- |
| **Wallet prompt appears** | Click outside or cancel, let demo mode activate | Demo simulator handles fallback |
| **Animation stutters** | Scroll slower, give elements time to load | Usually resolves quickly |
| **Modal doesn't open** | Click button again or use different approach | Refresh page as last resort |
| **Network lag** | Everything is client-side in demo mode, should be instant | No network calls needed for demo |
| **Browser crash** | Switch to backup tab with same page loaded | Have pre-loaded backup |

---

## Post-Demo Notes

- **Be ready for Q&A** immediately after
- **Have pitch script accessible** for reference
- **Stay calm** - demo is polished and should run smoothly
- **Emphasize Monad fit** - judges care about showcasing Monad's capabilities

---

**Pro Tip:** The key moment is Step 4-5 showing the instant stake → XP → leaderboard update. This perfectly demonstrates Monad's parallel execution and low-latency advantage!

**GOAL:** Show, don't just tell. Let the live, interactive demo do the talking! 🎯
