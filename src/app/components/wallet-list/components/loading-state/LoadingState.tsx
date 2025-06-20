import styles from "./LoadingState.module.scss";

const LoadingState = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
    <span>Loading wallets</span>
    <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "8px" }}>
      Please wait
    </p>
  </div>
);
export default LoadingState;
