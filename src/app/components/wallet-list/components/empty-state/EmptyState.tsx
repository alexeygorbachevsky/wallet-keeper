import styles from "./EmptyState.module.scss";

const EmptyState = () => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>💼</div>
    <h3 className={styles.emptyTitle}>No wallets found</h3>
    <p className={styles.emptyDescription}>
      Create your first wallet to start securely storing cryptocurrencies
    </p>
  </div>
);

export default EmptyState;
