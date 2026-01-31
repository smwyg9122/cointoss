const hre = require("hardhat");

async function main() {
  console.log("🎲 Deploying CoinToss Game to BNB Testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying from:", deployer.address);

  const FUNS_TOKEN_ADDRESS = process.env.FUNS_TOKEN_ADDRESS;
  const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS;
  const RELAYER_ADDRESS = process.env.RELAYER_ADDRESS;

  console.log("\n📋 Configuration:");
  console.log("- FUNS Token:", FUNS_TOKEN_ADDRESS);
  console.log("- Signer:", SIGNER_ADDRESS);
  console.log("- Relayer:", RELAYER_ADDRESS);

  console.log("\n🚀 Deploying CoinTossGame...");
  const CoinTossGame = await hre.ethers.getContractFactory("CoinTossGame");
  const game = await CoinTossGame.deploy(FUNS_TOKEN_ADDRESS, SIGNER_ADDRESS, RELAYER_ADDRESS);
  await game.waitForDeployment();

  const gameAddress = await game.getAddress();
  console.log("✅ CoinTossGame deployed to:", gameAddress);
  console.log("\n🔗 BscScan:", "https://testnet.bscscan.com/address/" + gameAddress);
  console.log("\n📝 Update your .env files:");
  console.log("Backend: CONTRACT_ADDRESS=" + gameAddress);
  console.log("Frontend: NEXT_PUBLIC_CONTRACT_ADDRESS=" + gameAddress);
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
