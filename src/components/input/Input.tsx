"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

import styles from "./Input.module.scss";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      size = "medium",
      fullWidth = true,
      rightElement,
      className = "",
      ...props
    },
    ref
  ) => (
    <div
      className={classNames(styles.container, {
        [styles.fullWidth]: fullWidth,
      })}
    >
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          className={classNames(
            styles.input,
            styles[size],
            {
              [styles.fullWidth]: fullWidth,
              [styles.error]: error,
              [styles.hasRightElement]: rightElement,
            },
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className={styles.rightElement}>{rightElement}</div>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {hint && !error && <div className={styles.hint}>{hint}</div>}
    </div>
  )
);

Input.displayName = "Input";

export default Input;
