import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import modalReducer, {
  openModal,
  closeModal,
  selectModalIsOpen,
  selectModalProps,
  ModalNames,
} from "store/slices/modal/modalSlice";

describe.concurrent("modalSlice", () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => {
    return configureStore({
      reducer: {
        modal: modalReducer,
      },
    });
  };

  beforeEach(() => {
    store = setupStore();
  });

  describe.concurrent("reducers", () => {
    it("should handle openModal without props", () => {
      store.dispatch(openModal({ name: ModalNames.walletGenerator }));
      const props = selectModalProps(
        store.getState(),
        ModalNames.walletGenerator
      );

      expect(
        selectModalIsOpen(store.getState(), ModalNames.walletGenerator)
      ).toBe(true);
      expect(
        selectModalProps(store.getState(), ModalNames.walletGenerator)
      ).toBeNull();
      expect(props).toBeNull();
    });

    it("should handle openModal with props", () => {
      const props = { walletId: "123", name: "Test Wallet" };

      store.dispatch(
        openModal({
          name: ModalNames.password,
          props,
        })
      );

      expect(selectModalIsOpen(store.getState(), ModalNames.password)).toBe(
        true
      );
      expect(selectModalProps(store.getState(), ModalNames.password)).toEqual(
        props
      );
    });

    it("should handle closeModal", () => {
      store.dispatch(openModal({ name: ModalNames.walletGenerator }));
      expect(
        selectModalIsOpen(store.getState(), ModalNames.walletGenerator)
      ).toBe(true);

      store.dispatch(closeModal(ModalNames.walletGenerator));
      expect(
        selectModalIsOpen(store.getState(), ModalNames.walletGenerator)
      ).toBe(false);

      const props = selectModalProps(
        store.getState(),
        ModalNames.walletGenerator
      );
      expect(props).toBe(undefined);
    });
  });

  describe.concurrent("selectors", () => {
    it("should return isOpen equals true for open modal", () => {
      const isOpenModal = selectModalIsOpen(
        store.getState(),
        ModalNames.walletGenerator
      );
      expect(isOpenModal).toBe(false);

      store.dispatch(openModal({ name: ModalNames.walletGenerator }));

      const isOpen = selectModalIsOpen(
        store.getState(),
        ModalNames.walletGenerator
      );
      expect(isOpen).toBe(true);
    });

    it("should return props for modal with props", () => {
      const testProps = { walletId: "123", name: "Test" };
      store.dispatch(
        openModal({ name: ModalNames.password, props: testProps })
      );

      const props = selectModalProps(store.getState(), ModalNames.password);
      expect(props).toEqual(testProps);
    });
  });
});
