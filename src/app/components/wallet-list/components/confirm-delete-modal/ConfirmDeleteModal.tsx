"use client";

import { FC } from "react";

import { ModalNames } from "store/slices/modal";

import { useModal } from "hooks/useModal";

import Modal from "components/modal";
import Button from "components/button";

import styles from "./ConfirmDeleteModal.module.scss";

interface ConfirmDeleteModalProps {
  walletId: string;
  walletName: string;
}

interface ConfirmDeleteModalActionsProps {
  onConfirm: (walletId: string) => void;
  loading?: boolean;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalActionsProps> = ({
  onConfirm,
  loading = false,
}) => {
  const modal = useModal<ConfirmDeleteModalProps>(ModalNames.confirmDelete);

  const handleConfirm = () => {
    if (modal.props?.walletId) {
      onConfirm(modal.props.walletId);
    }
  };

  if (!modal.isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={modal.close}
      title="Delete Wallet"
      size="small"
    >
      <div className={styles.container}>
        <p className={styles.description}>
          Are you sure you want to delete &quot;{modal.props?.walletName}&quot;?
        </p>
        <div className={styles.warning}>
          <strong>This action cannot be undone.</strong>
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={modal.close}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={handleConfirm}
            disabled={loading}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
