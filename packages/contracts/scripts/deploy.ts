import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenFactory = await ethers.getContractFactory("EduToken");
  const token = await tokenFactory.deploy(deployer.address);
  await token.waitForDeployment();

  const registryFactory = await ethers.getContractFactory("TransactionRegistry");
  const registry = await registryFactory.deploy(deployer.address);
  await registry.waitForDeployment();

  const output = {
    chainId: 31337,
    deployer: deployer.address,
    eduToken: {
      address: await token.getAddress(),
      abi: JSON.parse(token.interface.formatJson()),
    },
    transactionRegistry: {
      address: await registry.getAddress(),
      abi: JSON.parse(registry.interface.formatJson()),
    },
  };

  const targetDir = join(process.cwd(), "artifacts", "deployments");
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, "localhost.json"), JSON.stringify(output, null, 2));
  console.log(output);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
