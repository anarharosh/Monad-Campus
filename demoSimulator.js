/**
 * MonadCampus & Guild - Demo Simulator & Web3 State Manager
 * 
 * Handles both LIVE Web3 connection and "Demo / Fallback Mode"
 * Seamlessly falls back to interactive simulated states so the live presentation
 * never crashes on stage, even without MetaMask or Monad network.
 * 
 * @author MonadCampus Team
 * @version 1.0.0
 */

// ==================== CONFIGURATION ====================

const DEMO_CONFIG = {
    enabled: true,
    autoFallback: true,
    simulateNetworkDelay: true,
    minDelay: 300,
    maxDelay: 800,
    useLocalStorage: true
};

const MONAD_TESTNET = {
    chainId: '0x278F', // 10143
    chainName: 'Monad Testnet',
    nativeCurrency: {
        name: 'MON',
        symbol: 'MON',
        decimals: 18
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz/'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com/']
};

// ==================== MOCK DATA ====================

const MOCK_GUILDS = [
    { id: "metu", rank: 1, name: "METU Monad DAO", short: "METU", city: "Ankara, Türkiye", crest: "M", color: "#9b74ff", verified: true, badge: "Founding Campus", tvl: 1280000, members: 1420, xp: 148260, growth: 14.8, activityScore: 96 },
    { id: "bilkent", rank: 2, name: "Bilkent Web3 Guild", short: "B", city: "Ankara, Türkiye", crest: "B", color: "#4fd8ff", verified: true, badge: "Top Builder Guild", tvl: 1120000, members: 1186, xp: 131840, growth: 12.4, activityScore: 91 },
    { id: "itu", rank: 3, name: "ITU Blockchain", short: "ITU", city: "Istanbul, Türkiye", crest: "ITU", color: "#ff9e64", verified: true, badge: "Rising Star", tvl: 984000, members: 1042, xp: 118920, growth: 21.3, activityScore: 89 },
    { id: "bogazici", rank: 4, name: "Boğaziçi Web3", short: "BÜ", city: "Istanbul, Türkiye", crest: "BÜ", color: "#62e3b5", verified: true, badge: "", tvl: 842000, members: 892, xp: 102460, growth: 9.6, activityScore: 84 },
    { id: "hacettepe", rank: 5, name: "Hacettepe Crypto Guild", short: "H", city: "Ankara, Türkiye", crest: "H", color: "#b894ff", verified: true, badge: "", tvl: 716000, members: 764, xp: 89420, growth: 8.1, activityScore: 78 }
];

const MOCK_BOUNTIES = [
    { id: "g1", protocol: "Monad Labs", title: "Monad Ecosystem Onboarding Grant", amount: 10000, claimed: 6800, total: 10000, tags: ["Onboarding"], deadline: "12d left", minXp: 500 },
    { id: "g2", protocol: "Uniswap", title: "DeFi Security Quest", amount: 2500, claimed: 1750, total: 2500, tags: ["Security"], deadline: "8d left", minXp: 1000 },
    { id: "g3", protocol: "Wormhole", title: "Cross-chain Composability Bounty", amount: 5000, claimed: 3200, total: 5000, tags: ["Interop"], deadline: "15d left", minXp: 750 }
];

const MOCK_STUDENT = {
    address: "0x7A3F9B2C8E4D5A6F9012C7B8E9F3A4C5D6E7F902",
    guildId: "metu",
    guildName: "METU Monad DAO",
    stakedAmount: 8500,
    xp: 12480,
    level: 7,
    badges: 3
};

// ==================== STATE MANAGEMENT ====================

class DemoStateManager {
    constructor() {
        this.isDemoMode = true;
        this.isWalletConnected = false;
        this.walletAddress = null;
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.guilds = [...MOCK_GUILDS];
        this.bounties = [...MOCK_BOUNTIES];
        this.student = { ...MOCK_STUDENT };
        this.listeners = [];
    }
    
    /**
     * Subscribe to state changes
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Notify all listeners of state change
     */
    notify() {
        this.listeners.forEach(callback => callback(this.getState()));
    }
    
    /**
     * Get current state
     */
    getState() {
        return {
            isDemoMode: this.isDemoMode,
            isWalletConnected: this.isWalletConnected,
            walletAddress: this.walletAddress,
            guilds: this.guilds,
            bounties: this.bounties,
            student: this.student
        };
    }
    
    /**
     * Enable/disable demo mode
     */
    setDemoMode(enabled) {
        this.isDemoMode = enabled;
        this.notify();
    }
}

// Global state manager
const demoState = new DemoStateManager();

// ==================== UTILITY FUNCTIONS ====================

/**
 * Simulate network delay for realistic UX
 */
function simulateDelay() {
    if (!DEMO_CONFIG.simulateNetworkDelay) return Promise.resolve();
    const delay = Math.floor(Math.random() * (DEMO_CONFIG.maxDelay - DEMO_CONFIG.minDelay + 1)) + DEMO_CONFIG.minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Show toast notification
 */
function showToast(type, title, message) {
    // Try to use existing toast system if available
    if (typeof toast === 'function') {
        toast(type, title, message);
        return;
    }
    
    // Fallback toast
    const toastEl = document.createElement('div');
    toastEl.className = `demo-toast demo-toast-${type}`;
    toastEl.innerHTML = `
        <strong>${title}</strong>
        <p>${message}</p>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.classList.add('show'), 10);
    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 300);
    }, 3000);
}

// ==================== WALLET CONNECTION ====================

/**
 * Connect wallet with automatic fallback to demo mode
 */
async function connectWalletDemo() {
    try {
        // Check if MetaMask is available
        if (typeof window.ethereum === 'undefined') {
            console.warn('[DemoSimulator] No wallet detected, entering demo mode');
            demoState.isDemoMode = true;
            demoState.isWalletConnected = true;
            demoState.walletAddress = MOCK_STUDENT.address;
            showToast('info', 'Demo Mode', 'No wallet detected. Running in simulation mode.');
            demoState.notify();
            return { success: true, demoMode: true, address: MOCK_STUDENT.address };
        }
        
        // Try to connect
        await simulateDelay();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            throw new Error('No accounts');
        }
        
        // Check network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== MONAD_TESTNET.chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: MONAD_TESTNET.chainId }]
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [MONAD_TESTNET]
                    });
                } else {
                    console.warn('[DemoSimulator] Network switch failed, continuing in demo mode');
                }
            }
        }
        
        demoState.isDemoMode = false;
        demoState.isWalletConnected = true;
        demoState.walletAddress = accounts[0];
        showToast('success', 'Wallet Connected', `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        demoState.notify();
        return { success: true, demoMode: false, address: accounts[0] };
        
    } catch (error) {
        console.error('[DemoSimulator] Wallet connection failed:', error);
        // Fallback to demo mode
        demoState.isDemoMode = true;
        demoState.isWalletConnected = true;
        demoState.walletAddress = MOCK_STUDENT.address;
        showToast('info', 'Demo Mode', 'Wallet connection failed. Running in simulation mode.');
        demoState.notify();
        return { success: true, demoMode: true, address: MOCK_STUDENT.address };
    }
}

// ==================== SIMULATION FUNCTIONS ====================

/**
 * Simulate staking MON to a guild
 * @param {string} guildId - Guild identifier (e.g., 'metu')
 * @param {number} amount - Amount in MON
 */
async function simulateStakeMON(guildId = 'metu', amount = 8500) {
    await simulateDelay();
    
    try {
        // Find guild
        const guildIndex = demoState.guilds.findIndex(g => g.id === guildId);
        if (guildIndex === -1) {
            throw new Error('Guild not found');
        }
        
        // Calculate XP earned (1 MON = 100 XP)
        const xpEarned = amount * 100;
        
        // Update guild stats
        demoState.guilds[guildIndex].tvl += amount;
        demoState.guilds[guildIndex].xp += xpEarned;
        demoState.guilds[guildIndex].growth = parseFloat((demoState.guilds[guildIndex].growth + 0.5).toFixed(1));
        
        // Update student stats
        demoState.student.stakedAmount += amount;
        demoState.student.xp += xpEarned;
        
        // Re-sort guilds by TVL for leaderboard
        demoState.guilds.sort((a, b) => b.tvl - a.tvl);
        demoState.guilds.forEach((g, i) => {
            g.rank = i + 1;
        });
        
        // Save to localStorage
        if (DEMO_CONFIG.useLocalStorage) {
            localStorage.setItem('monadcampus_demo_state', JSON.stringify({
                guilds: demoState.guilds,
                student: demoState.student,
                timestamp: Date.now()
            }));
        }
        
        demoState.notify();
        showToast('success', 'Stake Successful!', `Staked ${amount.toLocaleString()} MON to ${demoState.guilds[guildIndex].name}. Earned +${xpEarned.toLocaleString()} XP!`);
        
        return {
            success: true,
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
            guild: demoState.guilds[guildIndex],
            xpEarned,
            newTotalStaked: demoState.guilds[guildIndex].tvl
        };
        
    } catch (error) {
        console.error('[DemoSimulator] Stake failed:', error);
        showToast('error', 'Stake Failed', error.message);
        throw error;
    }
}

/**
 * Simulate claiming a bounty
 * @param {string} bountyId - Bounty identifier
 * @param {string} guildId - Guild identifier
 */
async function simulateClaimBounty(bountyId = 'g1', guildId = 'metu') {
    await simulateDelay();
    
    try {
        // Find bounty
        const bountyIndex = demoState.bounties.findIndex(b => b.id === bountyId);
        if (bountyIndex === -1) {
            throw new Error('Bounty not found');
        }
        
        const bounty = demoState.bounties[bountyIndex];
        
        // Check XP requirement
        if (demoState.student.xp < bounty.minXp) {
            throw new Error(`Insufficient XP. Need ${bounty.minXp} XP, have ${demoState.student.xp} XP.`);
        }
        
        // Check if already claimed
        if (bounty.claimed >= bounty.total) {
            throw new Error('Bounty fully claimed');
        }
        
        // Calculate reward (for demo, claim a portion)
        const rewardAmount = Math.min(1000, bounty.total - bounty.claimed);
        
        // Update bounty
        demoState.bounties[bountyIndex].claimed += rewardAmount;
        
        // Update student XP (bonus XP for completing bounty)
        const bonusXp = 500;
        demoState.student.xp += bonusXp;
        
        // Save state
        if (DEMO_CONFIG.useLocalStorage) {
            localStorage.setItem('monadcampus_demo_state', JSON.stringify({
                guilds: demoState.guilds,
                bounties: demoState.bounties,
                student: demoState.student,
                timestamp: Date.now()
            }));
        }
        
        demoState.notify();
        showToast('success', 'Bounty Claimed!', `Claimed ${rewardAmount} MON from ${bounty.protocol}. Earned +${bonusXp} XP!`);
        
        return {
            success: true,
            txHash: '0x' + Math.random().toString(16).substr(2, 64),
            bounty: demoState.bounties[bountyIndex],
            rewardAmount,
            bonusXp
        };
        
    } catch (error) {
        console.error('[DemoSimulator] Claim failed:', error);
        showToast('error', 'Claim Failed', error.message);
        throw error;
    }
}

/**
 * Get live leaderboard data
 * @param {string} filter - Filter type: 'tvl', 'activity', 'students'
 */
async function getLiveLeaderboardData(filter = 'tvl') {
    await simulateDelay();
    
    try {
        let sortedGuilds = [...demoState.guilds];
        
        switch (filter) {
            case 'tvl':
                sortedGuilds.sort((a, b) => b.tvl - a.tvl);
                break;
            case 'activity':
                sortedGuilds.sort((a, b) => b.activityScore - a.activityScore);
                break;
            case 'students':
                sortedGuilds.sort((a, b) => b.members - a.members);
                break;
            default:
                sortedGuilds.sort((a, b) => b.tvl - a.tvl);
        }
        
        sortedGuilds.forEach((g, i) => {
            g.rank = i + 1;
        });
        
        return {
            success: true,
            guilds: sortedGuilds,
            filter,
            lastUpdated: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('[DemoSimulator] Leaderboard fetch failed:', error);
        throw error;
    }
}

/**
 * Get student profile
 */
async function getStudentProfile(address = null) {
    await simulateDelay();
    
    return {
        success: true,
        student: { ...demoState.student },
        badges: [
            { id: "b1", name: "METU Founding Pioneer", rarity: "Legendary", earned: true },
            { id: "b2", name: "Monad Blitz Ankara Scholar", rarity: "Epic", earned: true },
            { id: "b3", name: "Top Yield Farmer", rarity: "Rare", earned: true }
        ]
    };
}

/**
 * Get all grant vaults/bounties
 */
async function getAllGrantVaults() {
    await simulateDelay();
    
    return {
        success: true,
        vaults: demoState.bounties.map(b => ({
            id: parseInt(b.id.replace('g', '')),
            title: b.title,
            protocol: b.protocol,
            rewardPool: b.total.toString(),
            remainingPool: (b.total - b.claimed).toString(),
            claimed: b.claimed,
            total: b.total,
            minXpRequired: b.minXp,
            isCompleted: b.claimed >= b.total
        }))
    };
}

/**
 * Reset demo state
 */
function resetDemoState() {
    demoState.guilds = [...MOCK_GUILDS];
    demoState.bounties = [...MOCK_BOUNTIES];
    demoState.student = { ...MOCK_STUDENT };
    
    if (DEMO_CONFIG.useLocalStorage) {
        localStorage.removeItem('monadcampus_demo_state');
    }
    
    demoState.notify();
    showToast('info', 'Demo Reset', 'All demo data has been reset to initial state.');
}

/**
 * Load demo state from localStorage
 */
function loadDemoState() {
    if (!DEMO_CONFIG.useLocalStorage) return;
    
    try {
        const saved = localStorage.getItem('monadcampus_demo_state');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.guilds) demoState.guilds = data.guilds;
            if (data.bounties) demoState.bounties = data.bounties;
            if (data.student) demoState.student = data.student;
            demoState.notify();
            console.log('[DemoSimulator] Loaded saved demo state');
        }
    } catch (error) {
        console.error('[DemoSimulator] Failed to load demo state:', error);
    }
}

// ==================== AUTO-INITIALIZATION ====================

// Load saved state on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        loadDemoState();
        console.log('[DemoSimulator] MonadCampus Demo Simulator initialized');
        console.log('[DemoSimulator] Mode: ' + (demoState.isDemoMode ? 'DEMO/FALLBACK' : 'LIVE'));
    });
    
    // Expose to global scope for easy access
    window.MonadCampusDemo = {
        connectWalletDemo,
        simulateStakeMON,
        simulateClaimBounty,
        getLiveLeaderboardData,
        getStudentProfile,
        getAllGrantVaults,
        resetDemoState,
        demoState,
        showToast
    };
}

// ==================== EXPORTS (ES Module) ====================

export {
    connectWalletDemo,
    simulateStakeMON,
    simulateClaimBounty,
    getLiveLeaderboardData,
    getStudentProfile,
    getAllGrantVaults,
    resetDemoState,
    loadDemoState,
    demoState,
    showToast,
    DEMO_CONFIG
};

export default {
    connectWalletDemo,
    simulateStakeMON,
    simulateClaimBounty,
    getLiveLeaderboardData,
    getStudentProfile,
    getAllGrantVaults,
    resetDemoState,
    demoState
};
