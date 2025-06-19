import Input from "components/input";
import Checkbox from "components/checkbox";

import styles from "./WalletControls.module.scss";

interface WalletControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onlyWithBalances: boolean;
  onBalanceFilterChange: (checked: boolean) => void;
}

const WalletControls = ({
  searchQuery,
  onSearchChange,
  onlyWithBalances,
  onBalanceFilterChange,
}: WalletControlsProps) => (
  <div className={styles.controls}>
    <Input
      placeholder="Search wallets by name or address..."
      value={searchQuery}
      onChange={e => onSearchChange(e.target.value)}
      className={styles.searchInput}
    />
    <Checkbox
      checked={onlyWithBalances}
      onChange={e => onBalanceFilterChange(e.target.checked)}
      label="Only with balances"
      className={styles.balanceFilter}
    />
  </div>
);

export default WalletControls;
