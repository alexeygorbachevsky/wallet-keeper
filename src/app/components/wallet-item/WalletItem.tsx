"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Wallet } from "types/wallet";

import { removeWallet } from "store/slices/wallets";
import { ModalNames } from "store/slices/modal";

import { useAppDispatch } from "hooks/redux";
import { useModal } from "hooks/useModal";

import NetworkBalances from "../network-balances";

import ConfirmDeleteModal from "./components/confirm-delete-modal";
import PasswordModal from "./components/password-modal";

import styles from "./WalletItem.module.scss";

interface WalletItemProps {
  wallet: Wallet;
}

interface PasswordModalProps {
  walletId: string;
  walletName: string;
  encryptedJson: string;
}

interface ConfirmDeleteModalProps {
  walletId: string;
  walletName: string;
}

const WalletItem = ({ wallet }: WalletItemProps) => {
  const dispatch = useAppDispatch();

  const [copiedAddress, setCopiedAddress] = useState(false);

  const passwordModal = useModal<PasswordModalProps>(ModalNames.password);
  const confirmDeleteModal = useModal<ConfirmDeleteModalProps>(
    ModalNames.confirmDelete
  );

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

  const handleDelete = (walletId: string) => {
    dispatch(removeWallet(walletId));
    confirmDeleteModal.close();
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
                onClick={() =>
                  confirmDeleteModal.open({
                    walletId: wallet.id,
                    walletName: wallet.name,
                  })
                }
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
          onClick={() => {
            passwordModal.open({
              walletId: wallet.id,
              walletName: wallet.name,
              encryptedJson: wallet.encryptedJson,
            });
          }}
          className={styles.showKeyButton}
        >
          Show Private Key
        </button>
      </div>

      <PasswordModal />
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
};

export default WalletItem;
