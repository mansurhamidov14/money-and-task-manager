import { CurrencyCode, currencies } from "@app/constants";
import { JSXElement, Show } from "solid-js";

export type TransactionGroupProps = {
  date: string;
  amount: () => (null | number),
  currency: CurrencyCode;
  children: JSXElement | JSXElement[];
}

export function TransactionGroup({ amount, date, currency, children }: TransactionGroupProps) {
  return (
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-end">
        <div class="text-secondary-500 font-medium mt-1">{new Date(date).toLocaleDateString("en-EN", { month: "short", day: "2-digit" })}</div>
        <Show when={amount() !== null}>
          <div classList={{
            "rounded-lg font-medium px-2 py-0.5 mr-1 text-xs": true,
            "bg-rose-500/5 text-rose-500/50": amount()! < 0,
            "bg-teal-500/5 text-teal-500/50": amount()! > 0,
            "bg-amber-500/5 text-amber-500/50": amount() === 0
            }}>
              {`${amount()! < 0 ? "-" : ""}${currencies[currency].formatter(amount()!)}`}
          </div>
        </Show>
      </div>
      {children}
    </div>
  );
}
