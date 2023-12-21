import type { CurrencyCode } from "@app/constants";
import { AsyncStore } from "../types";

export type Account = {
  id: number;
  user: number;
  title: string;
  balance: number;
  currency: CurrencyCode;
  skin: number;
  primary: boolean;
}

export type AccountsStore = AsyncStore<Account[]>;