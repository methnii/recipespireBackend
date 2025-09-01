export interface InventoryItem {
  id?: number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
  };
  quantity: number;
  expirationDate?: Date;
  location?: string;
  minStockLevel?: number;
  status: InventoryStatus;
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}