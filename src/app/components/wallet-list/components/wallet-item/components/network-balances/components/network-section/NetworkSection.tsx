"use client";

import classNames from "classnames";

import type { Wallet } from "types/wallet";

import { TESTNET_NETWORKS, MAINNET_NETWORKS } from "constants/networks";

import { useAppDispatch } from "hooks/redux";

import { updateNetworkBalance } from "store/slices/wallets";

import NetworkCard from "../network-card";

import styles from "./NetworkSection.module.scss";

interface NetworkSectionProps {
  title: "testnet" | "mainnet";
  wallet: Wallet;
  showTitle?: boolean;
}

const NetworkSection = ({
  title,
  wallet,
  showTitle = true,
}: NetworkSectionProps) => {
  const dispatch = useAppDispatch();

  const networks = title === "testnet" ? TESTNET_NETWORKS : MAINNET_NETWORKS;

  return (
    <div className={styles.networkSection}>
      {showTitle && (
        <div className={styles.sectionTitle}>
          <span
            className={classNames(styles.sectionLabel, {
              [styles.testnet]: title === "testnet",
              [styles.mainnet]: title === "mainnet",
            })}
          >
            {title}
          </span>
        </div>
      )}
      <div className={styles.networkCards}>
        {networks.map(network => (
          <NetworkCard
            key={network.name}
            network={network}
            wallet={wallet}
            onUpdateBalance={params => dispatch(updateNetworkBalance(params))}
          />
        ))}
      </div>
    </div>
  );
};

export default NetworkSection;
