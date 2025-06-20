"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Wallet } from "types/wallet";

import NetworkBalances from "../network-balances";

import styles from "./WalletItem.module.scss";

interface WalletItemProps {
  wallet: Wallet;
  onShowPassword: (
    walletId: string,
    walletName: string,
    encryptedJson: string
  ) => void;
  onDeleteWallet: (walletId: string, walletName: string) => void;
}

const WalletItem = ({
  wallet,
  onShowPassword,
  onDeleteWallet,
}: WalletItemProps) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async () => {
    try {
      setCopiedAddress(true);
      await navigator.clipboard.writeText(wallet.address);
      setTimeout(() => {
        setCopiedAddress(false);
      }, 1000);
    } catch {
      toast.error("Failed to copy address to clipboard");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.walletInfo}>
          <div className={styles.nameActionsRow}>
            <div className={styles.nameSection}>
              <h3 className={styles.name}>{wallet.name}</h3>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => onDeleteWallet(wallet.id, wallet.name)}
                className={styles.deleteButton}
                title="Delete wallet"
              >
                Delete
              </button>
            </div>
          </div>
          <div className={styles.address}>
            <span className={styles.addressText}>
              {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
            </span>
            <button onClick={handleCopyAddress} className={styles.copyButton}>
              {copiedAddress ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className={styles.date}>
            Created:{" "}
            {new Date(wallet.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      <NetworkBalances wallet={wallet} />

      <div className={styles.privateKeySection}>
        <button
          onClick={() =>
            onShowPassword(wallet.id, wallet.name, wallet.encryptedJson)
          }
          className={styles.showKeyButton}
        >
          Show Private Key
        </button>
      </div>
    </div>
  );
};

export default WalletItem;
