export interface IUser {
  id: string;
  name: string;
  amount: number;
}

export type PersonOption = {
  value: string;
  label: string;
};

// types.ts (or where your types are defined)
export type Expense = {
  id: string;
  name: string;
  total: number;
  amountPerPerson: number;
  people: IUser[];
  date: string;
  creator: string; // New property for the creator
  status: string;
};
