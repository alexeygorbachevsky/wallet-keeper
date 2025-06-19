"use client";

import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => (
  <button
    className={classNames(
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.fullWidth]: fullWidth,
        [styles.loading]: loading,
      },
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <span className={styles.spinner} />}

    {!loading && leftIcon && (
      <span className={styles.leftIcon}>{leftIcon}</span>
    )}

    <span className={styles.content}>{children}</span>

    {!loading && rightIcon && (
      <span className={styles.rightIcon}>{rightIcon}</span>
    )}
  </button>
);

export default Button
