import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  className?: string;
}

const EmptyState = ({ className }: EmptyStateProps) => (
  <div className={className}>
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>💼</div>
      <h3 className={styles.emptyTitle}>No wallets found</h3>
      <p className={styles.emptyDescription}>
        Create your first wallet to start securely storing cryptocurrencies
      </p>
    </div>
  </div>
);

export default EmptyState;
