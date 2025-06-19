import Header from "./components/header";
import WalletList from "./components/wallet-list";
import WalletCreationModal from "./components/wallet-creation-modal";

import styles from "./page.module.scss";

const Home = () => (
  <div className={styles.page}>
    <Header />
    <main className={styles.main}>
      <WalletList />
      <WalletCreationModal />
    </main>
  </div>
);

export default Home;
