export interface IUser {
  displayName: string;
  email: string;
}
export interface IPeople {
  id: string;
  name: string;
  amount: number;
}

export type PersonOption = {
  value: string;
  label: string;
};

export interface IAuthContext {
  user: IUser;
  setUser: (user: IUser) => void;
}

// types.ts (or where your types are defined)
export type Expense = {
  id: string;
  name: string;
  total: number;
  amountPerPerson: number;
  people: IPeople[];
  date: string;
  creator: string; // New property for the creator
  status: string;
};
