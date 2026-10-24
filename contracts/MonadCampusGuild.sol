// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title MonadCampusGuild
 * @author MonadCampus Team - Monad Blitz Ankara
 * @notice A gamified Student-DAO & Institutional Micro-Grant platform optimized for Monad's parallelized execution
 * @dev Production-grade smart contract suite with gas optimization and comprehensive event logging for subgraphs
 * 
 * Key Features:
 * - University Guild management and dynamic leaderboard
 * - Student onboarding and MON staking with XP rewards
 * - Institutional micro-grants and bounty vaults
 * - Soulbound achievement badges (ERC721-style representation)
 * - Optimized for Monad's high-throughput parallel execution model
 */
contract MonadCampusGuild is Ownable, ReentrancyGuard, Pausable {
    using Address for address payable;

    // ==================== STRUCTS ====================

    /**
     * @notice Guild structure representing a university
     * @param id Unique guild identifier
     * @param name University/guild name
     * @param logoURI URI to guild logo
     * @param totalStaked Total MON staked in this guild
     * @param memberCount Number of students in this guild
     * @param totalXP Total XP accumulated by this guild
     * @param totalBountiesClaimed Total bounties claimed from grant vaults
     * @param isActive Whether the guild is active
     * @param registrationTime Timestamp when guild was registered
     */
    struct Guild {
        uint256 id;
        string name;
        string logoURI;
        uint256 totalStaked;
        uint256 memberCount;
        uint256 totalXP;
        uint256 totalBountiesClaimed;
        bool isActive;
        uint256 registrationTime;
    }

    /**
     * @notice Student profile structure
     * @param guildId ID of guild the student belongs to (0 if none)
     * @param stakedAmount Amount of MON staked by this student
     * @param xp Student's total XP
     * @param joinTime Timestamp when student joined a guild
     * @param lastStakeTime Timestamp of last stake action
     * @param badgesCount Number of badges earned
     */
    struct Student {
        uint256 guildId;
        uint256 stakedAmount;
        uint256 xp;
        uint256 joinTime;
        uint256 lastStakeTime;
        uint256 badgesCount;
    }

    /**
     * @notice Grant vault structure for institutional micro-grants
     * @param id Unique vault identifier
     * @param sponsorAddress Address of protocol/sponsor creating the vault
     * @param title Grant/bounty title
     * @param description Grant description
     * @param rewardPool Total reward pool in MON
     * @param remainingPool Remaining rewards to be claimed
     * @param targetGuildId Target specific guild (0 means any guild can participate)
     * @param isCompleted Whether vault is completed/expired
     * @param minXpRequired Minimum XP required to claim
     * @param creationTime Timestamp when vault was created
     * @param deadline Optional deadline for claiming
     */
    struct GrantVault {
        uint256 id;
        address payable sponsorAddress;
        string title;
        string description;
        uint256 rewardPool;
        uint256 remainingPool;
        uint256 targetGuildId;
        bool isCompleted;
        uint256 minXpRequired;
        uint256 creationTime;
        uint256 deadline;
    }

    /**
     * @notice Achievement badge structure
     * @param id Unique badge identifier
     * @param name Badge name (e.g., "METU Pioneer")
     * @param description Badge description
     * @param imageURI URI to badge image
     * @param xpThreshold XP required to earn this badge
     * @param isSoulbound Whether badge is non-transferable
     */
    struct Badge {
        uint256 id;
        string name;
        string description;
        string imageURI;
        uint256 xpThreshold;
        bool isSoulbound;
    }

    // ==================== STATE VARIABLES ====================

    // Guild management
    mapping(uint256 => Guild) public guilds;
    uint256 public guildCount;
    uint256[] public guildIdsList; // For leaderboard iteration optimization
    
    // Student management
    mapping(address => Student) public students;
    address[] public studentAddressesList;
    
    // Grant vaults
    mapping(uint256 => GrantVault) public grantVaults;
    uint256 public grantVaultCount;
    
    // Badge system
    mapping(uint256 => Badge) public badges;
    uint256 public badgeCount;
    mapping(address => mapping(uint256 => bool)) public studentBadges; // student => badgeId => hasBadge
    mapping(address => uint256[]) public studentBadgeList;
    
    // XP and rewards configuration
    uint256 public constant XP_PER_MON_STAKED = 100; // 1 MON = 100 XP per epoch
    uint256 public constant MIN_STAKE_AMOUNT = 0.001 ether; // Minimum stake amount
    uint256 public constant MAX_STAKE_AMOUNT = 250000 ether; // Maximum stake amount
    
    // Leaderboard cache for gas optimization
    uint256[] public topGuildsCache; // Cached top guild IDs sorted by ranking score
    uint256 public lastLeaderboardUpdate;
    uint256 public constant LEADERBOARD_UPDATE_INTERVAL = 1 hours;
    
    // ==================== EVENTS ====================
    // Events optimized for subgraph indexing on Monad
    
    event GuildRegistered(
        uint256 indexed guildId,
        string name,
        string logoURI,
        uint256 timestamp
    );
    
    event StudentJoinedGuild(
        address indexed student,
        uint256 indexed guildId,
        string guildName,
        uint256 timestamp
    );
    
    event MonStaked(
        address indexed student,
        uint256 indexed guildId,
        uint256 amount,
        uint256 newTotalStaked,
        uint256 xpEarned,
        uint256 timestamp
    );
    
    event MonUnstaked(
        address indexed student,
        uint256 amount,
        uint256 remainingStaked,
        uint256 timestamp
    );
    
    event GrantVaultCreated(
        uint256 indexed vaultId,
        address indexed sponsor,
        uint256 indexed targetGuildId,
        string title,
        uint256 rewardPool,
        uint256 minXpRequired,
        uint256 deadline
    );
    
    event GrantClaimed(
        uint256 indexed vaultId,
        address indexed student,
        uint256 indexed guildId,
        uint256 rewardAmount,
        uint256 timestamp
    );
    
    event BadgeMinted(
        address indexed student,
        uint256 indexed badgeId,
        string badgeName,
        uint256 timestamp
    );
    
    event LeaderboardUpdated(
        uint256[] topGuildIds,
        uint256 timestamp
    );
    
    event GuildStatsUpdated(
        uint256 indexed guildId,
        uint256 totalStaked,
        uint256 memberCount,
        uint256 totalXP
    );

    // ==================== MODIFIERS ====================

    modifier onlyRegisteredStudent() {
        require(students[msg.sender].guildId != 0, "Student not registered to any guild");
        require(students[msg.sender].joinTime > 0, "Student not properly onboarded");
        _;
    }
    
    modifier validGuild(uint256 _guildId) {
        require(_guildId > 0 && _guildId <= guildCount, "Invalid guild ID");
        require(guilds[_guildId].isActive, "Guild is not active");
        _;
    }
    
    modifier validVault(uint256 _vaultId) {
        require(_vaultId > 0 && _vaultId <= grantVaultCount, "Invalid vault ID");
        require(!grantVaults[_vaultId].isCompleted, "Vault is already completed");
        _;
    }

    // ==================== CONSTRUCTOR ====================

    constructor() Ownable(msg.sender) {
        // Initialize with some default badges for common achievements
        _createBadge("Monad Ankara Scholar", "Participated in Monad Blitz Ankara", "", 0, true);
        _createBadge("First Staker", "Made first stake to a campus guild", "", 100, true);
        _createBadge("Top Liquidity Provider", "Staked significant amount to guild", "", 10000, true);
        _createBadge("Guild Champion", "Contributed massively to guild success", "", 50000, true);
        _createBadge("Bounty Hunter", "Claimed multiple grant bounties", "", 5000, true);
    }

    // ==================== GUILD MANAGEMENT ====================

    /**
     * @notice Register a new university guild
     * @dev Only owner can register guilds. Optimized for parallel execution
     * @param _name Name of the university/guild
     * @param _logoURI URI to guild logo
     */
    function registerGuild(string memory _name, string memory _logoURI) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        require(bytes(_name).length > 0, "Guild name cannot be empty");
        
        guildCount++;
        guilds[guildCount] = Guild({
            id: guildCount,
            name: _name,
            logoURI: _logoURI,
            totalStaked: 0,
            memberCount: 0,
            totalXP: 0,
            totalBountiesClaimed: 0,
            isActive: true,
            registrationTime: block.timestamp
        });
        
        guildIdsList.push(guildCount);
        
        emit GuildRegistered(guildCount, _name, _logoURI, block.timestamp);
    }

    /**
     * @notice Get guild information
     * @param _guildId Guild identifier
     * @return Guild struct data
     */
    function getGuild(uint256 _guildId) external view validGuild(_guildId) returns (Guild memory) {
        return guilds[_guildId];
    }

    /**
     * @notice Get all active guilds
     * @dev Returns array of all guilds for frontend display
     * @return Array of Guild structs
     */
    function getAllGuilds() external view returns (Guild[] memory) {
        Guild[] memory allGuilds = new Guild[](guildCount);
        for (uint256 i = 1; i <= guildCount; i++) {
            allGuilds[i - 1] = guilds[i];
        }
        return allGuilds;
    }

    // ==================== STUDENT ONBOARDING & STAKING ====================

    /**
     * @notice Join a university guild
     * @dev Binds student's wallet to a guild. Can only join if not already in a guild
     * @param _guildId ID of guild to join
     */
    function joinGuild(uint256 _guildId) 
        external 
        validGuild(_guildId) 
        whenNotPaused 
    {
        require(students[msg.sender].guildId == 0, "Already joined a guild");
        require(students[msg.sender].joinTime == 0, "Student already registered");
        
        // Initialize student profile
        students[msg.sender] = Student({
            guildId: _guildId,
            stakedAmount: 0,
            xp: 0,
            joinTime: block.timestamp,
            lastStakeTime: 0,
            badgesCount: 0
        });
        
        studentAddressesList.push(msg.sender);
        
        // Update guild stats
        guilds[_guildId].memberCount++;
        emit GuildStatsUpdated(_guildId, guilds[_guildId].totalStaked, guilds[_guildId].memberCount, guilds[_guildId].totalXP);
        
        emit StudentJoinedGuild(msg.sender, _guildId, guilds[_guildId].name, block.timestamp);
        
        // Award "First Staker" badge later if they stake, but also check initial badges
        _checkAndMintBadges(msg.sender);
    }

    /**
     * @notice Stake native MON into guild pool
     * @dev Payable function - allows students to stake MON. Awards XP automatically
     * @param _guildId ID of guild to stake to (must be same as student's guild)
     */
    function stakeMon(uint256 _guildId) 
        external 
        payable 
        onlyRegisteredStudent 
        validGuild(_guildId) 
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value >= MIN_STAKE_AMOUNT, "Stake amount too low");
        require(msg.value <= MAX_STAKE_AMOUNT, "Stake amount too high");
        require(students[msg.sender].guildId == _guildId, "Must stake to your own guild");
        
        // Calculate XP earned: 1 MON = 100 XP per epoch
        uint256 xpEarned = (msg.value * XP_PER_MON_STAKED) / 1 ether;
        
        // Update student stats
        students[msg.sender].stakedAmount += msg.value;
        students[msg.sender].xp += xpEarned;
        students[msg.sender].lastStakeTime = block.timestamp;
        
        // Update guild stats
        guilds[_guildId].totalStaked += msg.value;
        guilds[_guildId].totalXP += xpEarned;
        
        emit GuildStatsUpdated(_guildId, guilds[_guildId].totalStaked, guilds[_guildId].memberCount, guilds[_guildId].totalXP);
        
        emit MonStaked(msg.sender, _guildId, msg.value, guilds[_guildId].totalStaked, xpEarned, block.timestamp);
        
        // Check and mint badges based on new XP/stats
        _checkAndMintBadges(msg.sender);
        
        // Update leaderboard cache if interval passed
        _updateLeaderboardCacheIfNeeded();
    }

    /**
     * @notice Unstake MON from guild pool
     * @dev Allows students to withdraw their staked MON. Note: XP remains earned
     * @param _amount Amount of MON to unstake
     */
    function unstakeMon(uint256 _amount) 
        external 
        onlyRegisteredStudent 
        whenNotPaused 
        nonReentrant 
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(students[msg.sender].stakedAmount >= _amount, "Insufficient staked amount");
        
        uint256 guildId = students[msg.sender].guildId;
        
        // Update student stats
        students[msg.sender].stakedAmount -= _amount;
        
        // Update guild stats
        guilds[guildId].totalStaked -= _amount;
        
        emit GuildStatsUpdated(guildId, guilds[guildId].totalStaked, guilds[guildId].memberCount, guilds[guildId].totalXP);
        
        // Transfer MON back to student
        payable(msg.sender).sendValue(_amount);
        
        emit MonUnstaked(msg.sender, _amount, students[msg.sender].stakedAmount, block.timestamp);
        
        // Update leaderboard cache if interval passed
        _updateLeaderboardCacheIfNeeded();
    }

    // ==================== INSTITUTIONAL MICRO-GRANT & BOUNTY VAULTS ====================

    /**
     * @notice Create a grant vault for institutional micro-grants
     * @dev Protocols/Sponsors can deposit MON to create targeted bounties
     * @param _title Grant title
     * @param _description Grant description
     * @param _targetGuildId Target specific guild (0 for all guilds)
     * @param _minXpRequired Minimum XP required to claim
     * @param _deadline Deadline for claiming (0 for no deadline)
     */
    function createGrantVault(
        string memory _title,
        string memory _description,
        uint256 _targetGuildId,
        uint256 _minXpRequired,
        uint256 _deadline
    ) 
        external 
        payable 
        whenNotPaused 
    {
        require(msg.value > 0, "Reward pool must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetGuildId == 0 || (_targetGuildId >= 1 && _targetGuildId <= guildCount), "Invalid target guild");
        
        if (_deadline > 0) {
            require(_deadline > block.timestamp, "Deadline must be in the future");
        }
        
        grantVaultCount++;
        
        grantVaults[grantVaultCount] = GrantVault({
            id: grantVaultCount,
            sponsorAddress: payable(msg.sender),
            title: _title,
            description: _description,
            rewardPool: msg.value,
            remainingPool: msg.value,
            targetGuildId: _targetGuildId,
            isCompleted: false,
            minXpRequired: _minXpRequired,
            creationTime: block.timestamp,
            deadline: _deadline
        });
        
        emit GrantVaultCreated(
            grantVaultCount,
            msg.sender,
            _targetGuildId,
            _title,
            msg.value,
            _minXpRequired,
            _deadline
        );
    }

    /**
     * @notice Claim grant from a bounty vault
     * @dev Authenticated guild members can claim rewards upon completing bounties
     * @param _vaultId ID of grant vault
     * @param _guildId Guild ID of the claiming student
     */
    function claimGrant(uint256 _vaultId, uint256 _guildId) 
        external 
        onlyRegisteredStudent 
        validVault(_vaultId) 
        validGuild(_guildId) 
        whenNotPaused 
        nonReentrant 
    {
        GrantVault storage vault = grantVaults[_vaultId];
        Student storage student = students[msg.sender];
        
        // Validation checks
        require(student.guildId == _guildId, "Must claim for your own guild");
        require(vault.targetGuildId == 0 || vault.targetGuildId == _guildId, "Not eligible for this vault");
        require(student.xp >= vault.minXpRequired, "Insufficient XP to claim");
        require(vault.remainingPool > 0, "No rewards remaining");
        
        if (vault.deadline > 0) {
            require(block.timestamp <= vault.deadline, "Vault deadline has passed");
        }
        
        // Calculate reward amount (for simplicity, distribute remaining pool or fixed amount)
        // In production, this could be more sophisticated based on contribution
        uint256 rewardAmount = vault.remainingPool;
        // For demo purposes, allow claiming full remaining pool
        // You could split rewards based on contribution metrics
        
        // Update vault
        vault.remainingPool = 0;
        vault.isCompleted = true;
        
        // Update guild stats
        guilds[_guildId].totalBountiesClaimed += rewardAmount;
        
        emit GuildStatsUpdated(_guildId, guilds[_guildId].totalStaked, guilds[_guildId].memberCount, guilds[_guildId].totalXP);
        
        // Transfer reward to student
        payable(msg.sender).sendValue(rewardAmount);
        
        emit GrantClaimed(_vaultId, msg.sender, _guildId, rewardAmount, block.timestamp);
        
        // Check and mint badges
        _checkAndMintBadges(msg.sender);
    }

    /**
     * @notice Get grant vault information
     * @param _vaultId Vault identifier
     * @return GrantVault struct data
     */
    function getGrantVault(uint256 _vaultId) external view validVault(_vaultId) returns (GrantVault memory) {
        return grantVaults[_vaultId];
    }

    /**
     * @notice Get all grant vaults
     * @return Array of GrantVault structs
     */
    function getAllGrantVaults() external view returns (GrantVault[] memory) {
        GrantVault[] memory allVaults = new GrantVault[](grantVaultCount);
        for (uint256 i = 1; i <= grantVaultCount; i++) {
            allVaults[i - 1] = grantVaults[i];
        }
        return allVaults;
    }

    // ==================== BADGE SYSTEM (SOULBOUND) ====================

    /**
     * @notice Create a new achievement badge (owner only)
     * @param _name Badge name
     * @param _description Badge description
     * @param _imageURI Badge image URI
     * @param _xpThreshold XP threshold to earn
     * @param _isSoulbound Whether badge is soulbound
     */
    function createBadge(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _xpThreshold,
        bool _isSoulbound
    ) external onlyOwner {
        _createBadge(_name, _description, _imageURI, _xpThreshold, _isSoulbound);
    }
    
    function _createBadge(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _xpThreshold,
        bool _isSoulbound
    ) internal {
        require(bytes(_name).length > 0, "Badge name cannot be empty");
        
        badgeCount++;
        badges[badgeCount] = Badge({
            id: badgeCount,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            xpThreshold: _xpThreshold,
            isSoulbound: _isSoulbound
        });
    }

    /**
     * @notice Check and mint eligible badges for a student
     * @dev Internal function called after actions that might earn badges
     * @param _student Student address
     */
    function _checkAndMintBadges(address _student) internal {
        Student storage student = students[_student];
        if (student.guildId == 0) return;
        
        for (uint256 i = 1; i <= badgeCount; i++) {
            if (!studentBadges[_student][i] && student.xp >= badges[i].xpThreshold) {
                // Special badge conditions
                bool eligible = false;
                
                if (i == 1) {
                    // Monad Ankara Scholar - already awarded on registration context
                    eligible = true;
                } else if (i == 2) {
                    // First Staker
                    eligible = student.stakedAmount >= MIN_STAKE_AMOUNT;
                } else if (i == 3) {
                    // Top Liquidity Provider
                    eligible = student.stakedAmount >= 10000 ether;
                } else if (i == 4) {
                    // Guild Champion
                    eligible = student.xp >= 50000;
                } else if (i == 5) {
                    // Bounty Hunter
                    eligible = guilds[student.guildId].totalBountiesClaimed > 0; // simplified
                } else {
                    eligible = student.xp >= badges[i].xpThreshold;
                }
                
                if (eligible) {
                    studentBadges[_student][i] = true;
                    student.badgesCount++;
                    studentBadgeList[_student].push(i);
                    
                    emit BadgeMinted(_student, i, badges[i].name, block.timestamp);
                }
            }
        }
    }

    /**
     * @notice Get student's badges
     * @param _student Student address
     * @return Array of badge IDs owned by student
     */
    function getStudentBadges(address _student) external view returns (uint256[] memory) {
        return studentBadgeList[_student];
    }

    /**
     * @notice Get badge information
     * @param _badgeId Badge identifier
     * @return Badge struct data
     */
    function getBadge(uint256 _badgeId) external view returns (Badge memory) {
        require(_badgeId > 0 && _badgeId <= badgeCount, "Invalid badge ID");
        return badges[_badgeId];
    }

    // ==================== LEADERBOARD ====================

    /**
     * @notice Get leaderboard - guilds sorted by ranking score
     * @dev Ranking: totalStaked + XP points (1 XP = 0.01 MON equivalent for ranking)
     * @return Array of guild IDs sorted by ranking
     */
    function getLeaderboard() external view returns (uint256[] memory) {
        uint256[] memory guildIds = new uint256[](guildCount);
        uint256[] memory scores = new uint256[](guildCount);
        
        // Calculate ranking scores for all active guilds
        for (uint256 i = 1; i <= guildCount; i++) {
            if (guilds[i].isActive) {
                guildIds[i - 1] = i;
                // Ranking score: totalStaked + (totalXP * 0.01 ether equivalent)
                scores[i - 1] = guilds[i].totalStaked + (guilds[i].totalXP * 1e16); // 0.01 ether per XP
            }
        }
        
        // Simple bubble sort for small number of guilds (gas efficient enough for hackathon)
        // For production with many guilds, would use off-chain indexing
        for (uint256 i = 0; i < guildCount; i++) {
            for (uint256 j = i + 1; j < guildCount; j++) {
                if (scores[j] > scores[i]) {
                    // Swap
                    uint256 tempScore = scores[i];
                    scores[i] = scores[j];
                    scores[j] = tempScore;
                    
                    uint256 tempId = guildIds[i];
                    guildIds[i] = guildIds[j];
                    guildIds[j] = tempId;
                }
            }
        }
        
        return guildIds;
    }

    /**
     * @notice Get top N guilds from leaderboard
     * @param _count Number of top guilds to return
     * @return Array of guild data for top guilds
     */
    function getTopGuilds(uint256 _count) external view returns (Guild[] memory) {
        uint256[] memory leaderboard = this.getLeaderboard();
        uint256 resultCount = _count > guildCount ? guildCount : _count;
        Guild[] memory topGuilds = new Guild[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            topGuilds[i] = guilds[leaderboard[i]];
        }
        
        return topGuilds;
    }

    /**
     * @notice Update leaderboard cache (internal, called periodically)
     */
    function _updateLeaderboardCacheIfNeeded() internal {
        if (block.timestamp >= lastLeaderboardUpdate + LEADERBOARD_UPDATE_INTERVAL) {
            uint256[] memory leaderboard = this.getLeaderboard();
            topGuildsCache = leaderboard;
            lastLeaderboardUpdate = block.timestamp;
            emit LeaderboardUpdated(leaderboard, block.timestamp);
        }
    }

    /**
     * @notice Force update leaderboard cache (owner only)
     */
    function forceUpdateLeaderboard() external onlyOwner {
        uint256[] memory leaderboard = this.getLeaderboard();
        topGuildsCache = leaderboard;
        lastLeaderboardUpdate = block.timestamp;
        emit LeaderboardUpdated(leaderboard, block.timestamp);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get student profile
     * @param _student Student address
     * @return Student struct data
     */
    function getStudent(address _student) external view returns (Student memory) {
        return students[_student];
    }

    /**
     * @notice Get contract statistics
     * @return Total guilds, students, vaults, total staked across all guilds
     */
    function getContractStats() external view returns (
        uint256 totalGuilds,
        uint256 totalStudents,
        uint256 totalVaults,
        uint256 totalStakedAllGuilds
    ) {
        totalGuilds = guildCount;
        totalStudents = studentAddressesList.length;
        totalVaults = grantVaultCount;
        
        uint256 totalStaked = 0;
        for (uint256 i = 1; i <= guildCount; i++) {
            totalStaked += guilds[i].totalStaked;
        }
        totalStakedAllGuilds = totalStaked;
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @notice Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Toggle guild active status
     * @param _guildId Guild ID
     * @param _active Active status
     */
    function setGuildActive(uint256 _guildId, bool _active) external onlyOwner validGuild(_guildId) {
        guilds[_guildId].isActive = _active;
    }

    /**
     * @notice Emergency withdraw (owner only, should not be used in normal operation)
     * @dev Only for emergency situations
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).sendValue(address(this).balance);
    }

    /**
     * @notice Allow contract to receive MON
     */
    receive() external payable {}
}