export type ItemType = "bottle" | "crate" | "pet";
export type ItemCondition = "good" | "damaged" | "crushed";

export interface CollectionPartner {
  id: string;
  name: string;
  type: "distributor" | "collection_partner" | "informal_collector";
  location: string; // Or a more complex location object
}

export interface CollectionLog {
  id: string;
  timestamp: Date;
  partnerId: string; // Foreign key to CollectionPartner
  items: {
    type: ItemType;
    quantity: number;
    condition: ItemCondition;
  }[];
  incentivePaid?: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  partnerId?: string; // Link user to a partner organization
  role: "nb_admin" | "partner_user";
}