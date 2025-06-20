"use client";

import { useEffect, useMemo, useState } from "react";

import { hasWalletBalance } from "utils/balance";

import { removeWallet } from "store/slices/wallets";
import { ModalNames } from "store/slices/modal";

import { useAppDispatch } from "hooks/redux";
import { useModal } from "hooks/useModal";

import WalletItem from "app/components/wallet-item";

import LoadingState from "./components/loading-state";
import ErrorState from "./components/error-state";
import EmptyState from "./components/empty-state";
import WalletListHeader from "./components/wallet-list-header";
import WalletControls from "./components/wallet-controls";
import NoResults from "./components/no-results";
import PasswordModal from "./components/password-modal";
import ConfirmDeleteModal from "./components/confirm-delete-modal";

import { useConnect } from "./duck/hooks";

import styles from "./WalletList.module.scss";

const WalletList = () => {
  const dispatch = useAppDispatch();
  const { wallets, loading, error, loadWallets } = useConnect();

  const [searchQuery, setSearchQuery] = useState("");
  const [onlyWithBalances, setOnlyWithBalances] = useState(false);

  const passwordModal = useModal(ModalNames.password);
  const confirmDeleteModal = useModal(ModalNames.confirmDelete);

  useEffect(() => {
    loadWallets();
  }, []);

  const filteredWallets = useMemo(
    () =>
      wallets.filter(wallet => {
        if (onlyWithBalances && !hasWalletBalance(wallet)) {
          return false;
        }

        return (
          wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wallet.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }),
    [wallets, searchQuery, onlyWithBalances]
  );

  const handleShowPassword = (
    walletId: string,
    walletName: string,
    encryptedJson: string
  ) => {
    passwordModal.open({
      walletId,
      walletName,
      encryptedJson,
    });
  };

  const handleDeleteWallet = (walletId: string, walletName: string) => {
    confirmDeleteModal.open({
      walletId,
      walletName,
    });
  };

  const handleConfirmDelete = (walletId: string) => {
    dispatch(removeWallet(walletId));
    confirmDeleteModal.close();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState />
      </div>
    );
  }

  if (!wallets.length) {
    return (
      <div className={styles.container}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <WalletListHeader
        filteredWalletsCount={filteredWallets.length}
        visibleWalletsCount={wallets.length}
      />

      {wallets.length > 0 && (
        <WalletControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onlyWithBalances={onlyWithBalances}
          onBalanceFilterChange={setOnlyWithBalances}
        />
      )}

      {filteredWallets.length ? (
        <div className={styles.walletGrid}>
          {filteredWallets.map(wallet => (
            <WalletItem
              key={wallet.id}
              wallet={wallet}
              onShowPassword={handleShowPassword}
              onDeleteWallet={handleDeleteWallet}
            />
          ))}
        </div>
      ) : (
        <NoResults />
      )}

      <PasswordModal />
      <ConfirmDeleteModal onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default WalletList;
