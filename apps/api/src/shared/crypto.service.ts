import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

@Injectable()
export class CryptoService {
  private readonly key = createHash("sha256")
    .update(process.env.MASTER_ENCRYPTION_KEY ?? "replace-me")
    .digest();

  encrypt(value: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decrypt(value: string) {
    const [ivHex, encryptedHex] = value.split(":");
    const decipher = createDecipheriv("aes-256-cbc", this.key, Buffer.from(ivHex, "hex"));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);
    return decrypted.toString("utf8");
  }

  maskCardNumber(value: string) {
    return `**** **** **** ${value.slice(-4)}`;
  }

  maskAccountNumber(value: string) {
    return `****${value.slice(-4)}`;
  }
}
