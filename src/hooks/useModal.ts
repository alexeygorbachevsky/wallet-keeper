import { useCallback } from "react";

import {
  openModal,
  closeModal,
  selectModalIsOpen,
  selectModalProps,
} from "store/slices/modal";
import { ModalNames } from "store/slices/modal";

import { useAppDispatch, useAppSelector } from "./redux";

export const useModal = <TProps = unknown>(modalName: ModalNames) => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(state => selectModalIsOpen(state, modalName));
  const props = useAppSelector(state =>
    selectModalProps(state, modalName)
  ) as TProps;

  const open = useCallback(
    (props?: TProps) => {
      if (props) {
        dispatch(openModal({ name: modalName, props }));
      } else {
        dispatch(openModal({ name: modalName }));
      }
    },
    [modalName]
  );

  const close = useCallback(() => {
    dispatch(closeModal(modalName));
  }, [modalName]);

  return {
    isOpen,
    props,
    open,
    close,
  };
};
