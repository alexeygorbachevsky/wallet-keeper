import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModalNames {
  walletGenerator = "wallet-generator",
  password = "password",
  confirmDelete = "confirm-delete",
}

interface ModalsState {
  openModals: Record<ModalNames, unknown>;
}

const initialState: ModalsState = {
  openModals: {} as Record<ModalNames, unknown>,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ name: ModalNames; props?: unknown }>
    ) => {
      const { name, props } = action.payload;
      state.openModals[name] = props || null;
    },
    closeModal: (state, action: PayloadAction<ModalNames>) => {
      const modalName = action.payload;
      delete state.openModals[modalName];
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectModalIsOpen = (
  state: { modal: ModalsState },
  modalName: string
) => modalName in state.modal.openModals;

export const selectModalProps = (
  state: { modal: ModalsState },
  modalName: ModalNames
) => state.modal.openModals[modalName];

export default modalSlice.reducer;
