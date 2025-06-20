"use client";

import { useEffect, useMemo, useState } from "react";

import WalletItem from "app/components/wallet-item";

import { hasWalletBalance } from "utils/balance";

import { useConnect } from "./duck/hooks";

import LoadingState from "./components/loading-state";
import ErrorState from "./components/error-state";
import EmptyState from "./components/empty-state";
import WalletListHeader from "./components/wallet-list-header";
import WalletControls from "./components/wallet-controls";
import NoResults from "./components/no-results";

import styles from "./WalletList.module.scss";

const WalletList = () => {
  const { wallets, loading, error, loadWallets } = useConnect();

  const [searchQuery, setSearchQuery] = useState("");
  const [onlyWithBalances, setOnlyWithBalances] = useState(false);

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
            <WalletItem key={wallet.id} wallet={wallet} />
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default WalletList;
