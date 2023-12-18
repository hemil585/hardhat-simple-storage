import { ethers, network, run } from "hardhat"
import "dotenv/config"

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  const simpleStorage = await SimpleStorageFactory.deploy()
  console.log('deploying....');

  const contractAddress = await simpleStorage.getAddress()
  console.log(`Contract address: ${contractAddress}`);

  // Verifying and Publishing contract on "Sepolia" network
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.waitForDeployment();
    await verify(contractAddress, []);
  }

  // Interacting with the "SimpleStorage" contract
  const currentFavoriteNumber: bigint = await simpleStorage.retrieve();
  console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);
  await simpleStorage.store(2121); // Assuming 'store' takes a uint256 argument
  const updatedFavoriteNumber: bigint = await simpleStorage.retrieve();
  console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`);

}


async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()