import styles from "./LoadingState.module.scss";

interface LoadingStateProps {
  className?: string;
}

const LoadingState = ({ className }: LoadingStateProps) => (
  <div className={className}>
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <span>Loading wallets</span>
      <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "8px" }}>
        Please wait
      </p>
    </div>
  </div>
);
export default LoadingState;
