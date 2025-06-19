import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  className?: string;
}

const ErrorState = ({ className }: ErrorStateProps) => (
  <div className={className}>
    <div className={styles.loading}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorText}>
        <p>Loading Error</p>
      </div>
    </div>
  </div>
);

export default ErrorState;
