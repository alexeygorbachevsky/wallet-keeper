import { configureStore } from "@reduxjs/toolkit";

import walletReducer from "./slices/wallets";
import modalReducer from "./slices/modal";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    modal: modalReducer,
  },
});

export default store;