import styles from "./ErrorState.module.scss";

const ErrorState = () => (
  <div className={styles.loading}>
    <div className={styles.errorIcon}>⚠️</div>
    <div className={styles.errorText}>
      <p>Loading Error</p>
    </div>
  </div>
);

export default ErrorState;
