"use client";

import { ModalNames } from "store/slices/modal";

import Button from "components/button";

import { useModal } from "hooks/useModal";

import styles from "./Header.module.scss";

const Header = () => {
  const walletGeneratorModal = useModal(ModalNames.walletGenerator);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h1 className={styles.title}>Wallet Keeper</h1>
            <p className={styles.description}>
              Securely manage your cryptocurrency wallets
            </p>
          </div>
          <Button
            className={styles.generateButton}
            onClick={() => {
              walletGeneratorModal.open();
            }}
            variant="primary"
            size="medium"
          >
            Generate Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
