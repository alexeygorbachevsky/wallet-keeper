"use client";

import { useMemo, useState } from "react";

import type { Wallet } from "types/wallet";

import { TESTNET_NETWORKS, MAINNET_NETWORKS } from "constants/networks";

import { updateNetworkBalance } from "store/slices/wallets";

import Checkbox from "components/checkbox";

import { useAppDispatch } from "hooks/redux";

import styles from "./NetworkBalancesHeader.module.scss";

interface NetworkBalancesHeaderProps {
  wallet: Wallet;
  showTestnet: boolean;
  onShowTestnet: (show: boolean) => void;
}

const NetworkBalancesHeader = ({
  wallet,
  showTestnet,
  onShowTestnet,
}: NetworkBalancesHeaderProps) => {
  const dispatch = useAppDispatch();
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const allNetworks = useMemo(
    () => [...MAINNET_NETWORKS, ...(showTestnet ? TESTNET_NETWORKS : [])],
    [showTestnet]
  );

  const { isSomeBalanceLoading, areAllBalancesLoaded } = useMemo(
    () => ({
      isSomeBalanceLoading: allNetworks.some(
        network => wallet.networkBalances?.[network.name]?.loading
      ),
      areAllBalancesLoaded: allNetworks.every(
        network => wallet.networkBalances?.[network.name]?.balance
      ),
    }),
    [allNetworks, wallet.networkBalances]
  );

  const handleUpdateAllBalances = async () => {
    setIsLoadingAll(true);

    const updatingNetworks = showTestnet ? allNetworks : MAINNET_NETWORKS;

    try {
      const promises = updatingNetworks.map(network =>
        dispatch(
          updateNetworkBalance({
            walletId: wallet.id,
            networkName: network.name,
          })
        ).unwrap()
      );

      await Promise.all(promises);
    } finally {
      setIsLoadingAll(false);
    }
  };

  return (
    <div className={styles.header}>
      <h4 className={styles.title}>Network Balances</h4>
      <div className={styles.headerActions}>
        <div className={styles.testnetToggle}>
          <Checkbox
            id={`testnet-toggle-${wallet.id}`}
            checked={showTestnet}
            onChange={e => onShowTestnet(e.target.checked)}
            label="Show Testnet"
            size="small"
          />
        </div>
        <button
          onClick={handleUpdateAllBalances}
          className={styles.refreshAllButton}
          title="Refresh all balances"
          disabled={isLoadingAll || isSomeBalanceLoading}
        >
          {isLoadingAll ? (
            <span className={styles.loadingText}>Loading...</span>
          ) : areAllBalancesLoaded ? (
            "Refresh All"
          ) : (
            "Load All"
          )}
        </button>
      </div>
    </div>
  );
};

export default NetworkBalancesHeader;
