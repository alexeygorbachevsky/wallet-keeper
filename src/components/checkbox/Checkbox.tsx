"use client";

import { FC, InputHTMLAttributes, Ref } from "react";
import classNames from "classnames";

import CheckIcon from "assets/check.svg"

import styles from "./Checkbox.module.scss";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  size?: "default" | "small";
  ref?: Ref<HTMLInputElement>;
}

const Checkbox: FC<Props> = ({
  ref,
  label,
  className = "",
  checked,
  size = "default",
  ...props
}) => (
  <label
    className={classNames(
      styles.container,
      { [styles.small]: size === "small" },
      className
    )}
  >
    <input
      ref={ref}
      type="checkbox"
      className={classNames(
        styles.checkbox,
        {
          [styles.small]: size === "small",
          [styles.checked]: checked,
          [styles.disabled]: props.disabled,
        },
        className
      )}
      checked={checked}
      {...props}
    />
    <span className={styles.checkmark}>{checked && <CheckIcon />}</span>
    {label && <span className={styles.label}>{label}</span>}
  </label>
);

export default Checkbox;
