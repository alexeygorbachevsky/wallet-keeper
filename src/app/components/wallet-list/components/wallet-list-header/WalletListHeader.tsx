import styles from "./WalletListHeader.module.scss";

interface WalletListHeaderProps {
  filteredWalletsCount: number;
  visibleWalletsCount: number;
}

const WalletListHeader = ({
  filteredWalletsCount,
  visibleWalletsCount,
}: WalletListHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.titleSection}>
      <h2 className={styles.title}>My Wallets</h2>
      <div className={styles.stats}>
        <span className={styles.count}>
          {filteredWalletsCount} of {visibleWalletsCount} wallets
        </span>
      </div>
    </div>
  </div>
);

export default WalletListHeader;
