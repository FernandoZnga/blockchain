import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";

describe("EduChain contracts", () => {
  it("mints demo tokens", async () => {
    const [owner, recipient] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("EduToken");
    const token = await factory.deploy(owner.address);
    await token.waitForDeployment();

    await token.mint(recipient.address, 1000n);
    expect(await token.balanceOf(recipient.address)).to.equal(1000n);
  });

  it("emits registry events", async () => {
    const [owner, recipient] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("TransactionRegistry");
    const registry = await factory.deploy(owner.address);
    await registry.waitForDeployment();

    await expect(registry.registerTransfer(owner.address, recipient.address, 500n, "demo-ref"))
      .to.emit(registry, "EducationalTransaction")
      .withArgs(owner.address, recipient.address, 500n, "demo-ref", anyValue);
  });
});
