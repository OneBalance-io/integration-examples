export type AssetId = `${string}:${string}`;

export interface Asset {
  aggregatedAssetId: AssetId;
  symbol: string;
  name: string;
  decimals: number;
  aggregatedEntities: {
    assetType: string;
    decimals: number;
    name: string;
    symbol: string;
  }[];
}
