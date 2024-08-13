export interface IUser {
  id: string;
  name: string;
}

export type PersonOption = {
  value: string;
  label: string;
};

// types.ts (or where your types are defined)
export type Expense = {
  id: number;
  name: string;
  total: number;
  amountPerPerson: number;
  people: string[];
  date: string;
  creator: string; // New property for the creator
  status: string;
};
