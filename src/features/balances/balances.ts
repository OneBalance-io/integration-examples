import { AssetId } from "../assets/assets";

export interface UserBalance {
  balanceByAsset: BalanceByAsset[];
  totalBalance: TotalFiatBalance;
}

export interface BalanceByAsset {
  aggregatedAssetId: AssetId; // Example: ob:usd
  balance: string; // BigInt as string
  fiatValue?: number;
  individualAssetBalances: IndividualAssetBalanceWithFiat[];
}

export interface IndividualAssetBalanceWithFiat {
  assetType: string; // CAIP-19 format, e.g., eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 for USDC on ETH Mainnet
  balance: string; // BigInt as string
  fiatValue?: number;
}

export interface TotalFiatBalance {
  fiatValue: number;
}
