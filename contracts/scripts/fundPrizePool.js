const hre = require("hardhat");

async function main() {
  console.log("💰 Funding Prize Pool...\n");
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 From wallet:", deployer.address);
  
  const FUNS_TOKEN_ADDRESS = process.env.FUNS_TOKEN_ADDRESS;
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  
  console.log("- TFUN Token:", FUNS_TOKEN_ADDRESS);
  console.log("- Contract:", CONTRACT_ADDRESS);
  
  // 정확한 경로로 IERC20 가져오기
  const Token = await hre.ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
    FUNS_TOKEN_ADDRESS
  );
  
  const ownerBalance = await Token.balanceOf(deployer.address);
  console.log("\n💼 Your TFUN balance:", hre.ethers.formatEther(ownerBalance), "TFUN");
  
  const amountToFund = hre.ethers.parseEther("10000000");
  console.log("\n📤 Transferring to Prize Pool...");
  console.log("- Amount:", hre.ethers.formatEther(amountToFund), "TFUN");
  console.log("- To:", CONTRACT_ADDRESS);
  
  const tx = await Token.transfer(CONTRACT_ADDRESS, amountToFund);
  console.log("\n⏳ Waiting for confirmation...");
  await tx.wait();
  
  console.log("✅ Transfer complete!");
  console.log("🔗 Transaction:", tx.hash);
  
  const contractBalance = await Token.balanceOf(CONTRACT_ADDRESS);
  console.log("\n💰 Prize Pool Balance:", hre.ethers.formatEther(contractBalance), "TFUN");
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
