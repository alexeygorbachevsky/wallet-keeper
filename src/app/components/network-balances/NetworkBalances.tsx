"use client";

import { useState } from "react";

import type { Wallet } from "types/wallet";

import NetworkBalancesHeader from "./components/network-balances-header";
import NetworkSection from "./components/network-section";

import styles from "./NetworkBalances.module.scss";

interface NetworkBalancesProps {
  wallet: Wallet;
}

const NetworkBalances = ({ wallet }: NetworkBalancesProps) => {
  const [showTestnet, setShowTestnet] = useState(true);

  return (
    <div className={styles.container}>
      <NetworkBalancesHeader
        wallet={wallet}
        showTestnet={showTestnet}
        onShowTestnet={setShowTestnet}
      />

      <div className={styles.networks}>
        {showTestnet && <NetworkSection title="testnet" wallet={wallet} />}
        <NetworkSection title="mainnet" wallet={wallet} showTitle={showTestnet} />
      </div>
    </div>
  );
};

export default NetworkBalances;
