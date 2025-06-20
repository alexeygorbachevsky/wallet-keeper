"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { ModalNames } from "store/slices/modal";

import { useModal } from "hooks/useModal";

import { decryptPrivateKey } from "utils/crypto";

import Modal from "components/modal";
import Input from "components/input";
import Button from "components/button";

import { PASSWORD_VALIDATION_RULES } from "./duck/constants";

import styles from "./PasswordModal.module.scss";

interface PasswordModalProps {
  walletId: string;
  walletName: string;
  encryptedJson: string;
}

interface PasswordFormData {
  password: string;
  showPassword?: boolean;
  privateKey?: string;
  showPrivateKey?: boolean;
}

const PasswordModal = () => {
  const [copied, setCopied] = useState(false);

  const modal = useModal<PasswordModalProps>(ModalNames.password);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordFormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      showPassword: false,
      privateKey: "",
      showPrivateKey: false,
    },
  });

  const privateKey = watch("privateKey") || "";
  const showPassword = watch("showPassword") || false;
  const showPrivateKey = watch("showPrivateKey") || false;

  const togglePasswordVisibility = () => {
    setValue("showPassword", !showPassword);
  };

  const togglePrivateKeyVisibility = () => {
    setValue("showPrivateKey", !showPrivateKey);
  };

  useEffect(() => {
    if (modal.isOpen) {
      reset();
      setCopied(false);
      setTimeout(() => setFocus("password"));
    }
  }, [modal.isOpen, reset, setFocus]);

  const handleFormSubmit = async (data: PasswordFormData) => {
    if (!modal.props) {
      return;
    }

    try {
      const decryptedKey = await decryptPrivateKey(
        modal.props.encryptedJson,
        data.password
      );
      setValue("privateKey", decryptedKey);
    } catch {
      setError("password", {
        type: "manual",
        message: "Invalid password",
      });
    }
  };

  const handleClose = () => {
    reset();
    modal.close();
  };

  const handleCopyPrivateKey = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      title="Reveal Private Key"
      size="small"
    >
      <div className={styles.container}>
        {!privateKey ? (
          <>
            <p className={styles.description}>
              Enter the password for &quot;{modal.props?.walletName}&quot; to
              access its private key.
            </p>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className={styles.form}
            >
              <div className={styles.formRow}>
                <Input
                  id="modal-password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  size="small"
                  disabled={isSubmitting}
                  error={errors.password?.message}
                  rightElement={
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={isSubmitting}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  }
                  {...register("password", PASSWORD_VALIDATION_RULES.password)}
                />
              </div>
              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                >
                  Confirm
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.privateKeyContent}>
            <div className={styles.privateKeyHeader}>
              <span className={styles.label}>
                Private Key for &quot;{modal.props?.walletName}&quot;
              </span>
              <button
                type="button"
                onClick={handleCopyPrivateKey}
                className={styles.copyButton}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <Input
              value={
                showPrivateKey ? privateKey : "•".repeat(privateKey.length)
              }
              size="small"
              readOnly
              rightElement={
                <button type="button" onClick={togglePrivateKeyVisibility}>
                  {showPrivateKey ? "Hide" : "Show"}
                </button>
              }
            />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="primary"
                size="small"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PasswordModal;
