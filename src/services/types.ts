import { Transaction, User } from "../stores";

type CreationRequestData<T> = Omit<T, "id">

export type RegisterUser = {
  password: string;
} & Omit<User, "id">;

export type NewTransaction = CreationRequestData<Transaction>;