"use client";

import { useEffect, useRef, ReactNode, FC, MouseEvent } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import CloseIcon from "assets/close.svg";

import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "small" | "medium" | "large";
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOverlay = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose, closeOnEscape]);

  const handleMouseDown = (event: MouseEvent) => {
    mouseDownTarget.current = event.target;
  };

  const handleOverlayClick = (event: MouseEvent) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget &&
      mouseDownTarget.current === event.target
    ) {
      onClose();
    }
    mouseDownTarget.current = null;
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={classNames(styles.modal, styles[size])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
      >
        <div className={styles.header}>
          {title && (
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};

export default Modal;
