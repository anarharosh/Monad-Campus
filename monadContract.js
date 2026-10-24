/**
 * MonadCampus & Guild - Web3 Integration Helper
 * Clean JavaScript snippet for frontend web3 calls using ethers.js
 * 
 * Usage:
 * 1. Import ethers.js
 * 2. Set contract address and ABI
 * 3. Use these helper functions in your frontend
 */

import { ethers } from 'ethers';

// Contract Configuration
// Update these after deployment
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with deployed contract address
const MONAD_TESTNET_RPC = "https://testnet-rpc.monad.xyz/"; // Monad Testnet RPC
const MONAD_CHAIN_ID = 10143; // Monad Testnet Chain ID

// Contract ABI - Import from artifacts or define key functions
const CONTRACT_ABI = [
    // Guild Management
    "function registerGuild(string memory _name, string memory _logoURI) external",
    "function getGuild(uint256 _guildId) external view returns (tuple(uint256 id, string name, string logoURI, uint256 totalStaked, uint256 memberCount, uint256 totalXP, uint256 totalBountiesClaimed, bool isActive, uint256 registrationTime))",
    "function getAllGuilds() external view returns (tuple(uint256 id, string name, string logoURI, uint256 totalStaked, uint256 memberCount, uint256 totalXP, uint256 totalBountiesClaimed, bool isActive, uint256 registrationTime)[])",
    
    // Student Onboarding & Staking
    "function joinGuild(uint256 _guildId) external",
    "function stakeMon(uint256 _guildId) external payable",
    "function unstakeMon(uint256 _amount) external",
    "function getStudent(address _student) external view returns (tuple(uint256 guildId, uint256 stakedAmount, uint256 xp, uint256 joinTime, uint256 lastStakeTime, uint256 badgesCount))",
    
    // Leaderboard
    "function getLeaderboard() external view returns (uint256[])",
    "function getTopGuilds(uint256 _count) external view returns (tuple(uint256 id, string name, string logoURI, uint256 totalStaked, uint256 memberCount, uint256 totalXP, uint256 totalBountiesClaimed, bool isActive, uint256 registrationTime)[])",
    
    // Grant Vaults
    "function createGrantVault(string memory _title, string memory _description, uint256 _targetGuildId, uint256 _minXpRequired, uint256 _deadline) external payable",
    "function claimGrant(uint256 _vaultId, uint256 _guildId) external",
    "function getAllGrantVaults() external view returns (tuple(uint256 id, address sponsorAddress, string title, string description, uint256 rewardPool, uint256 remainingPool, uint256 targetGuildId, bool isCompleted, uint256 minXpRequired, uint256 creationTime, uint256 deadline)[])",
    
    // Badges
    "function getStudentBadges(address _student) external view returns (uint256[])",
    "function getBadge(uint256 _badgeId) external view returns (tuple(uint256 id, string name, string description, string imageURI, uint256 xpThreshold, bool isSoulbound))",
    
    // Stats
    "function getContractStats() external view returns (uint256 totalGuilds, uint256 totalStudents, uint256 totalVaults, uint256 totalStakedAllGuilds)",
    
    // Events
    "event GuildRegistered(uint256 indexed guildId, string name, string logoURI, uint256 timestamp)",
    "event StudentJoinedGuild(address indexed student, uint256 indexed guildId, string guildName, uint256 timestamp)",
    "event MonStaked(address indexed student, uint256 indexed guildId, uint256 amount, uint256 newTotalStaked, uint256 xpEarned, uint256 timestamp)",
    "event MonUnstaked(address indexed student, uint256 amount, uint256 remainingStaked, uint256 timestamp)",
    "event GrantVaultCreated(uint256 indexed vaultId, address indexed sponsor, uint256 indexed targetGuildId, string title, uint256 rewardPool, uint256 minXpRequired, uint256 deadline)",
    "event GrantClaimed(uint256 indexed vaultId, address indexed student, uint256 indexed guildId, uint256 rewardAmount, uint256 timestamp)",
    "event BadgeMinted(address indexed student, uint256 indexed badgeId, string badgeName, uint256 timestamp)"
];

// Global variables
let provider = null;
let signer = null;
let contract = null;
let userAddress = null;

/**
 * Connect wallet to the dApp
 * @returns {Promise<{address: string, success: boolean}>}
 */
export async function connectWallet() {
    try {
        // Check if MetaMask or other wallet is installed
        if (typeof window.ethereum === 'undefined') {
            throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
        }
        
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }
        
        userAddress = accounts[0];
        
        // Create provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        // Check if on correct network (Monad Testnet)
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== MONAD_CHAIN_ID) {
            try {
                // Try to switch to Monad Testnet
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
                });
            } catch (switchError) {
                // If network doesn't exist, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
                            chainName: 'Monad Testnet',
                            nativeCurrency: {
                                name: 'MON',
                                symbol: 'MON',
                                decimals: 18
                            },
                            rpcUrls: [MONAD_TESTNET_RPC],
                            blockExplorerUrls: ['https://testnet.monadexplorer.com/']
                        }]
                    });
                } else {
                    throw switchError;
                }
            }
            // Reinitialize after network switch
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
        }
        
        // Initialize contract
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log('Wallet connected:', userAddress);
        return { address: userAddress, success: true };
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
    }
}

/**
 * Get contract instance (read-only) for fetching data without wallet connection
 * @returns {ethers.Contract}
 */
export function getReadOnlyContract() {
    if (!contract) {
        const readProvider = new ethers.JsonRpcProvider(MONAD_TESTNET_RPC);
        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
    }
    return contract;
}

/**
 * Fetch guild leaderboard
 * @returns {Promise<Array>} Array of guild IDs sorted by ranking
 */
export async function fetchLeaderboard() {
    try {
        const readContract = getReadOnlyContract();
        const leaderboard = await readContract.getLeaderboard();
        console.log('Leaderboard:', leaderboard);
        return leaderboard.map(id => Number(id));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}

/**
 * Fetch top guilds with full details
 * @param {number} count - Number of top guilds to fetch
 * @returns {Promise<Array>} Array of guild objects
 */
export async function fetchTopGuilds(count = 10) {
    try {
        const readContract = getReadOnlyContract();
        const guilds = await readContract.getTopGuilds(count);
        
        // Format guild data
        return guilds.map(guild => ({
            id: Number(guild.id),
            name: guild.name,
            logoURI: guild.logoURI,
            totalStaked: ethers.formatEther(guild.totalStaked),
            totalStakedWei: guild.totalStaked.toString(),
            memberCount: Number(guild.memberCount),
            totalXP: Number(guild.totalXP),
            totalBountiesClaimed: ethers.formatEther(guild.totalBountiesClaimed),
            isActive: guild.isActive,
            registrationTime: Number(guild.registrationTime)
        }));
    } catch (error) {
        console.error('Error fetching top guilds:', error);
        throw error;
    }
}

/**
 * Fetch all guilds
 * @returns {Promise<Array>} Array of all guild objects
 */
export async function fetchAllGuilds() {
    try {
        const readContract = getReadOnlyContract();
        const guilds = await readContract.getAllGuilds();
        
        return guilds.map(guild => ({
            id: Number(guild.id),
            name: guild.name,
            logoURI: guild.logoURI,
            totalStaked: ethers.formatEther(guild.totalStaked),
            totalStakedWei: guild.totalStaked.toString(),
            memberCount: Number(guild.memberCount),
            totalXP: Number(guild.totalXP),
            totalBountiesClaimed: ethers.formatEther(guild.totalBountiesClaimed),
            isActive: guild.isActive,
            registrationTime: Number(guild.registrationTime)
        }));
    } catch (error) {
        console.error('Error fetching all guilds:', error);
        throw error;
    }
}

/**
 * Join a guild
 * @param {number} guildId - ID of guild to join
 * @returns {Promise<Object>} Transaction receipt
 */
export async function joinGuild(guildId) {
    try {
        if (!contract || !signer) {
            throw new Error('Wallet not connected. Please connect wallet first.');
        }
        
        console.log('Joining guild:', guildId);
        const tx = await contract.joinGuild(guildId);
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return receipt;
    } catch (error) {
        console.error('Error joining guild:', error);
        throw error;
    }
}

/**
 * Stake MON to a guild
 * @param {number} guildId - ID of guild to stake to
 * @param {string} amountInMon - Amount in MON (e.g., "10.5")
 * @returns {Promise<Object>} Transaction receipt
 */
export async function stakeMon(guildId, amountInMon) {
    try {
        if (!contract || !signer) {
            throw new Error('Wallet not connected. Please connect wallet first.');
        }
        
        const amountWei = ethers.parseEther(amountInMon);
        console.log('Staking:', amountInMon, 'MON to guild:', guildId);
        
        const tx = await contract.stakeMon(guildId, { value: amountWei });
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return receipt;
    } catch (error) {
        console.error('Error staking MON:', error);
        throw error;
    }
}

/**
 * Unstake MON
 * @param {string} amountInMon - Amount in MON to unstake
 * @returns {Promise<Object>} Transaction receipt
 */
export async function unstakeMon(amountInMon) {
    try {
        if (!contract || !signer) {
            throw new Error('Wallet not connected. Please connect wallet first.');
        }
        
        const amountWei = ethers.parseEther(amountInMon);
        console.log('Unstaking:', amountInMon, 'MON');
        
        const tx = await contract.unstakeMon(amountWei);
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return receipt;
    } catch (error) {
        console.error('Error unstaking MON:', error);
        throw error;
    }
}

/**
 * Fetch student profile
 * @param {string} address - Student wallet address (optional, uses connected wallet if not provided)
 * @returns {Promise<Object>} Student profile
 */
export async function fetchStudentProfile(address = null) {
    try {
        const readContract = getReadOnlyContract();
        const studentAddr = address || userAddress;
        
        if (!studentAddr) {
            throw new Error('No address provided');
        }
        
        const student = await readContract.getStudent(studentAddr);
        
        return {
            guildId: Number(student.guildId),
            stakedAmount: ethers.formatEther(student.stakedAmount),
            stakedAmountWei: student.stakedAmount.toString(),
            xp: Number(student.xp),
            joinTime: Number(student.joinTime),
            lastStakeTime: Number(student.lastStakeTime),
            badgesCount: Number(student.badgesCount)
        };
    } catch (error) {
        console.error('Error fetching student profile:', error);
        throw error;
    }
}

/**
 * Fetch all grant vaults
 * @returns {Promise<Array>} Array of grant vault objects
 */
export async function fetchGrantVaults() {
    try {
        const readContract = getReadOnlyContract();
        const vaults = await readContract.getAllGrantVaults();
        
        return vaults.map(vault => ({
            id: Number(vault.id),
            sponsorAddress: vault.sponsorAddress,
            title: vault.title,
            description: vault.description,
            rewardPool: ethers.formatEther(vault.rewardPool),
            rewardPoolWei: vault.rewardPool.toString(),
            remainingPool: ethers.formatEther(vault.remainingPool),
            remainingPoolWei: vault.remainingPool.toString(),
            targetGuildId: Number(vault.targetGuildId),
            isCompleted: vault.isCompleted,
            minXpRequired: Number(vault.minXpRequired),
            creationTime: Number(vault.creationTime),
            deadline: Number(vault.deadline)
        }));
    } catch (error) {
        console.error('Error fetching grant vaults:', error);
        throw error;
    }
}

/**
 * Claim grant from vault
 * @param {number} vaultId - Vault ID
 * @param {number} guildId - Guild ID
 * @returns {Promise<Object>} Transaction receipt
 */
export async function claimGrant(vaultId, guildId) {
    try {
        if (!contract || !signer) {
            throw new Error('Wallet not connected. Please connect wallet first.');
        }
        
        console.log('Claiming grant:', vaultId, 'for guild:', guildId);
        const tx = await contract.claimGrant(vaultId, guildId);
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return receipt;
    } catch (error) {
        console.error('Error claiming grant:', error);
        throw error;
    }
}

/**
 * Fetch contract statistics
 * @returns {Promise<Object>} Contract stats
 */
export async function fetchContractStats() {
    try {
        const readContract = getReadOnlyContract();
        const stats = await readContract.getContractStats();
        
        return {
            totalGuilds: Number(stats.totalGuilds),
            totalStudents: Number(stats.totalStudents),
            totalVaults: Number(stats.totalVaults),
            totalStakedAllGuilds: ethers.formatEther(stats.totalStakedAllGuilds)
        };
    } catch (error) {
        console.error('Error fetching contract stats:', error);
        throw error;
    }
}

/**
 * Get connected wallet address
 * @returns {string|null}
 */
export function getConnectedAddress() {
    return userAddress;
}

/**
 * Check if wallet is connected
 * @returns {boolean}
 */
export function isWalletConnected() {
    return !!userAddress && !!contract;
}

// Example usage in frontend:
/*
import { connectWallet, fetchTopGuilds, joinGuild, stakeMon } from './monadContract.js';

// Connect wallet
const wallet = await connectWallet();

// Fetch leaderboard
const topGuilds = await fetchTopGuilds(5);
console.log('Top guilds:', topGuilds);

// Join guild
await joinGuild(1);

// Stake 10 MON
await stakeMon(1, "10");
*/
