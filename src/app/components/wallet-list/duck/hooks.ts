import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";

import { 
  loadWallets as loadWalletThunk,
  selectAllWallets
} from "store/slices/wallets";


export const useConnect=()=>{
  const wallets = useAppSelector(selectAllWallets);
  const loading = useAppSelector(state => state.wallet.loading);
  const error = useAppSelector(state => state.wallet.error);

  const dispatch = useAppDispatch();

  const loadWallets=()=>{
    dispatch(loadWalletThunk());
  }

  return {
    wallets,
    loading,
    error,
    loadWallets
  }
}