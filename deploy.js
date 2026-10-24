/**
 * Hardhat Deployment Script for MonadCampusGuild
 * Configured for Monad Testnet / Devnet RPC
 * 
 * Usage:
 * 1. Install dependencies: npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
 * 2. Configure hardhat.config.js with Monad network
 * 3. Run: npx hardhat run deploy.js --network monadTestnet
 */

const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting MonadCampusGuild deployment...");
    
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Get account balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MON");
    
    // Deploy MonadCampusGuild contract
    console.log("\n📦 Deploying MonadCampusGuild...");
    const MonadCampusGuild = await hre.ethers.getContractFactory("MonadCampusGuild");
    const monadCampusGuild = await MonadCampusGuild.deploy();
    
    await monadCampusGuild.waitForDeployment();
    const contractAddress = await monadCampusGuild.getAddress();
    
    console.log("✅ MonadCampusGuild deployed to:", contractAddress);
    console.log("🔗 Transaction hash:", monadCampusGuild.deploymentTransaction().hash);
    
    // Register initial university guilds for Monad Blitz Ankara
    console.log("\n🏛️  Registering initial campus guilds...");
    
    const initialGuilds = [
        { name: "METU Monad DAO", logoURI: "https://example.com/metu.png" },
        { name: "Bilkent Web3 Guild", logoURI: "https://example.com/bilkent.png" },
        { name: "ITU Blockchain", logoURI: "https://example.com/itu.png" },
        { name: "Boğaziçi University Blockchain Club", logoURI: "https://example.com/boun.png" },
        { name: "Hacettepe Blockchain Society", logoURI: "https://example.com/hacettepe.png" },
        { name: "Ankara University Crypto Club", logoURI: "https://example.com/ankara.png" }
    ];
    
    for (let i = 0; i < initialGuilds.length; i++) {
        console.log(`  Registering ${initialGuilds[i].name}...`);
        const tx = await monadCampusGuild.registerGuild(
            initialGuilds[i].name,
            initialGuilds[i].logoURI
        );
        await tx.wait();
        console.log(`  ✅ ${initialGuilds[i].name} registered`);
    }
    
    // Create a sample grant vault from Monad Labs
    console.log("\n💰 Creating sample grant vault...");
    const grantTx = await monadCampusGuild.createGrantVault(
        "Monad Builder Bounties",
        "Fund student builders to create amazing dApps on Monad. Build, ship, get rewarded.",
        0, // Target all guilds
        1000, // Minimum 1000 XP required
        Math.floor(Date.now() / 1000) + 86400 * 30 // 30 days deadline
    );
    
    // Send some MON as reward pool
    // Note: In practice, you'd send value with the transaction
    await grantTx.wait();
    console.log("✅ Sample grant vault created");
    
    // Get contract stats
    console.log("\n📊 Contract Statistics:");
    const stats = await monadCampusGuild.getContractStats();
    console.log("  Total Guilds:", stats.totalGuilds.toString());
    console.log("  Total Students:", stats.totalStudents.toString());
    console.log("  Total Vaults:", stats.totalVaults.toString());
    console.log("  Total Staked:", hre.ethers.formatEther(stats.totalStakedAllGuilds), "MON");
    
    // Get leaderboard
    console.log("\n🏆 Initial Leaderboard:");
    const leaderboard = await monadCampusGuild.getLeaderboard();
    for (let i = 0; i < leaderboard.length; i++) {
        const guild = await monadCampusGuild.getGuild(leaderboard[i]);
        console.log(`  #${i + 1} ${guild.name} - ${hre.ethers.formatEther(guild.totalStaked)} MON staked`);
    }
    
    // Deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("Contract Address:", contractAddress);
    console.log("Network: Monad Testnet/Devnet");
    console.log("Deployer:", deployer.address);
    console.log("\n📋 Next Steps:");
    console.log("1. Update CONTRACT_ADDRESS in monadContract.js with:", contractAddress);
    console.log("2. Verify contract on block explorer (if available)");
    console.log("3. Fund grant vaults with additional MON");
    console.log("4. Test staking and guild joining functionality");
    console.log("=".repeat(60));
    
    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployer: deployer.address,
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        guildsRegistered: initialGuilds.length
    };
    
    fs.writeFileSync(
        'deployment-info.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
