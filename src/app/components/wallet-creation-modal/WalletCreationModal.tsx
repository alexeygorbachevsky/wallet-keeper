"use client";

import { useForm } from "react-hook-form";

import { ModalNames } from "store/slices/modal";

import {
  createWallet as createWalletThunk,
  clearError,
} from "store/slices/wallets";

import { useAppDispatch } from "hooks/redux";

import { useModal } from "hooks/useModal";

import Modal from "components/modal";
import Input from "components/input";
import Button from "components/button";

import { getPasswordStrength } from "./duck/utils";
import { WalletFormData } from "./duck/types";
import { WALLET_VALIDATION_RULES } from "./duck/constants";

import styles from "./WalletCreationModal.module.scss";

const WalletCreationModal = () => {
  const dispatch = useAppDispatch();
  const modal = useModal(ModalNames.walletGenerator);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<WalletFormData>({
    mode: "onBlur",
    defaultValues: {
      walletName: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    },
  });

  const password = watch("password");
  const showPassword = watch("showPassword") || false;
  const showConfirmPassword = watch("showConfirmPassword") || false;
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const togglePasswordVisibility = (
    field: "showPassword" | "showConfirmPassword"
  ) => {
    const currentValue = watch(field) || false;
    setValue(field, !currentValue);
  };

  const onSubmit = async (data: WalletFormData) => {
    await dispatch(
      createWalletThunk({
        password: data.password,
        name: data.walletName,
      })
    );

    reset();
    modal.close();
  };

  const handleClose = () => {
    reset();
    dispatch(clearError());
    modal.close();
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      title="Generate New Wallet"
      size="small"
    >
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formRow}>
            <Input
              id="walletName"
              label="Wallet Name"
              placeholder="Optional"
              size="small"
              disabled={isSubmitting}
              error={errors.walletName?.message}
              {...register("walletName", WALLET_VALIDATION_RULES.walletName)}
            />
          </div>

          <div className={styles.passwordFields}>
            <div className={styles.passwordField}>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Min 8 chars, mixed case + number"
                size="small"
                disabled={isSubmitting}
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("showPassword")}
                    disabled={isSubmitting}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                }
                {...register("password", WALLET_VALIDATION_RULES.password)}
              />

              {password && passwordStrength && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthMeter}>
                    <div
                      className={styles.strengthBar}
                      style={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span
                    className={styles.strengthLabel}
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Repeat password"
              size="small"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("showConfirmPassword")
                  }
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              }
              {...register("confirmPassword", {
                ...WALLET_VALIDATION_RULES.confirmPassword,
                validate: value =>
                  value === getValues("password") || "Passwords do not match",
              })}
            />
          </div>

          <div className={styles.securityNote}>
            <div className={styles.securityIcon}>Important</div>
            <span className={styles.securityText}>
              Your password encrypts the private key locally. We cannot recover
              it if lost.
            </span>
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
              {isSubmitting ? "Creating Wallet..." : "Create Wallet"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WalletCreationModal;
