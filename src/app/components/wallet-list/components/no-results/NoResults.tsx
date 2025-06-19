import styles from "./NoResults.module.scss";

const NoResults = () => (
  <div className={styles.noResults}>
    <div className={styles.noResultsIcon}>🔍</div>
    <h3>No wallets match your search</h3>
    <p>Try adjusting your search terms</p>
  </div>
);

export default NoResults;
