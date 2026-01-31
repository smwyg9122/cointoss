const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying TestFun Token to BNB Testnet...");

  // 1. TestFun 토큰 배포
  const TestFunToken = await hre.ethers.getContractFactory("TestFunToken");
  const token = await TestFunToken.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ TestFun Token deployed to:", tokenAddress);

  // 2. 배포 정보 출력
  const [deployer] = await hre.ethers.getSigners();
  const balance = await token.balanceOf(deployer.address);
  
  console.log("\n📊 Token Information:");
  console.log("- Token Address:", tokenAddress);
  console.log("- Deployer:", deployer.address);
  console.log("- Total Supply:", hre.ethers.formatEther(balance), "TFUN");
  console.log("\n🔗 BscScan Testnet:");
  console.log(`https://testnet.bscscan.com/address/${tokenAddress}`);

  // 3. 환경 변수 안내
  console.log("\n📝 Update your .env files:");
  console.log(`FUNS_TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`NEXT_PUBLIC_FUNS_TOKEN_ADDRESS=${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
