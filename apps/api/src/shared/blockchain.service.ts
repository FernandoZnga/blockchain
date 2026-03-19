import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class BlockchainService {
  private readonly provider = new ethers.JsonRpcProvider(
    process.env.BLOCKCHAIN_RPC_URL ?? "http://localhost:8545",
    Number(process.env.BLOCKCHAIN_CHAIN_ID ?? 31337),
  );

  async health() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return { online: true, blockNumber };
    } catch {
      return { online: false, blockNumber: null };
    }
  }

  async createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.signingKey.publicKey,
    };
  }

  async buildEducationalTransfer(reference: string, fromAddress: string, toAddress: string, amount: string) {
    const hash = ethers.id(`${reference}:${fromAddress}:${toAddress}:${amount}:${Date.now()}`);
    return {
      hash,
      blockNumber: await this.provider.getBlockNumber().catch(() => 0),
      reference,
    };
  }
}
