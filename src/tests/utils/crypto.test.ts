import { describe, it, expect } from "vitest";
import {
  generateWallet,
  encryptPrivateKey,
  decryptPrivateKey,
} from "utils/crypto";

describe.concurrent("crypto utils", () => {
  describe.concurrent("generateWallet", () => {
    it("should generate wallet with valid address and private key", () => {
      const result = generateWallet();

      expect(result).toHaveProperty("address");
      expect(result).toHaveProperty("privateKey");
      expect(result.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(result.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe.concurrent("encryptPrivateKey", () => {
    it("should encrypt private key with password", async () => {
      const privateKey =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const password = "testPassword123";

      const encrypted = await encryptPrivateKey(privateKey, password);

      expect(typeof encrypted).toBe("string");
      expect(encrypted.length).toBeGreaterThan(0);
      expect(encrypted).not.toBe(privateKey);
    }, 10000);
  });

  describe.concurrent("decryptPrivateKey", () => {
    it("should decrypt private key with correct password", async () => {
      const privateKey =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const password = "testPassword123";

      const encrypted = await encryptPrivateKey(privateKey, password);
      const decrypted = await decryptPrivateKey(encrypted, password);

      expect(decrypted).toBe(privateKey);
    }, 15000);

    it("should throw error with wrong password", async () => {
      const privateKey =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";

      const encrypted = await encryptPrivateKey(privateKey, password);

      await expect(decryptPrivateKey(encrypted, wrongPassword)).rejects.toThrow(
        "Failed to decrypt private key"
      );
    }, 10000);
  });
});
