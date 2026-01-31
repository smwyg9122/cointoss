const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  
  const FUNS_TOKEN_ADDRESS = process.env.FUNS_TOKEN_ADDRESS;
  const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS || deployer.address;
  const RELAYER_ADDRESS = process.env.RELAYER_ADDRESS || deployer.address;
  
  console.log("FUNS Token:", FUNS_TOKEN_ADDRESS);
  console.log("Signer Address:", SIGNER_ADDRESS);
  console.log("Relayer Address:", RELAYER_ADDRESS);
  
  const CoinToss = await hre.ethers.getContractFactory("CoinTossGasless");
  const coinToss = await CoinToss.deploy(FUNS_TOKEN_ADDRESS, SIGNER_ADDRESS, RELAYER_ADDRESS);
  
  await coinToss.waitForDeployment();
  const address = await coinToss.getAddress();
  
  console.log("\n✅ CoinTossGasless deployed to:", address);
  console.log("\n📋 Save this information:");
  console.log("CONTRACT_ADDRESS=" + address);
  console.log("\n📝 Next steps:");
  console.log("1. Copy the CONTRACT_ADDRESS above");
  console.log("2. Add it to backend/.env and frontend/.env.local");
  console.log("3. Approve FUNS tokens for this contract");
  console.log("4. Call depositBankroll() to fund the contract");
  console.log("5. Send BNB to Relayer address for gas fees");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });