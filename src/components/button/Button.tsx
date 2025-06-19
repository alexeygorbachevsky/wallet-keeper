"use client";

import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import classNames from "classnames";

import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium";
  loading?: boolean;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
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
        [styles.loading]: loading,
      },
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <span className={styles.spinner} />}
    <span className={styles.content}>{children}</span>
  </button>
);

export default Button;
