"use client";

import { useMemo } from "react";
import classNames from "classnames";

import type { Wallet } from "types/wallet";
import type { NetworkNames } from "types/networks";

import { formatBalance } from "utils/balance";

import styles from "./NetworkCard.module.scss";

interface NetworkCardProps {
  network: {
    name: NetworkNames;
    symbol: string;
  };
  wallet: Wallet;
  onUpdateBalance: (params: {
    walletId: string;
    networkName: NetworkNames;
  }) => void;
}

const NetworkCard = ({
  network,
  wallet,
  onUpdateBalance,
}: NetworkCardProps) => {
  const networkBalance = wallet.networkBalances?.[network.name];
  const isLoading = networkBalance?.loading || false;
  const hasError = !!networkBalance?.error;
  const balance = networkBalance?.balance;

  const balanceString = useMemo(() => {
    if (!balance) {
      return "";
    }

    return formatBalance(balance, network.symbol);
  }, [balance, network.symbol]);

  const renderBalanceContent = () => {
    if (isLoading) {
      return <span className={styles.spinner}></span>;
    }

    if (hasError) {
      return <span className={styles.error}>Retry</span>;
    }

    if (balanceString) {
      return <span className={styles.balance}>{balanceString}</span>;
    }

    return <span className={styles.notLoaded}>Click to load</span>;
  };

  return (
    <button
      type="button"
      className={classNames(styles.networkCard, {
        [styles.error]: hasError,
      })}
      onClick={() =>
        onUpdateBalance({
          walletId: wallet.id,
          networkName: network.name,
        })
      }
      disabled={isLoading}
    >
      <div className={styles.networkContent}>
        <span className={styles.networkName}>{network.name}</span>
        <div className={styles.balanceArea}>{renderBalanceContent()}</div>
      </div>
    </button>
  );
};

export default NetworkCard;
