import { Show, createSignal } from "solid-js";
import { PickerValue } from "@rnwonder/solid-date-picker";
import { SectionTitle } from "@app/components";
import { Message } from "@app/i18n/components";
import { CategoryId } from "@app/constants";
import { transactions } from "@app/stores";
import { initialDateRange } from "./consts";
import { CategoryFilter, DateFilter, FilteredTransactions, TransactionListSkeleton } from "./components";
import { DateFilter as TDateFilter, DateFilterTab } from "./types";
import { getDateFilters } from "./helpers";

export function HistoryScreen() {
  const [prevDateFilterTab, setPrevDateFilterTab] = createSignal<DateFilterTab>("month");
  const [dateFilterTab, setDateFilterTab] = createSignal<DateFilterTab>("month");
  const [filterDateRanges, setFilterDateRanges] = createSignal<PickerValue>(initialDateRange);
  const [categoryFilter, setCategoryFilter] = createSignal<CategoryId | null>(null);
  const [dateFilter, setDateFilter] = createSignal<TDateFilter>(getDateFilters(dateFilterTab()));

  return (
    <main class="bg-secondary-50 p-3 overflow-y-scroll">
      <h1 class="text-center text-4xl">History Screen</h1>
      <DateFilter
        previousTab={prevDateFilterTab}
        setPreviousTab={setPrevDateFilterTab}
        activeTab={dateFilterTab}
        setActiveTab={setDateFilterTab}
        filterDateRanges={filterDateRanges}
        setFilterDateRanges={setFilterDateRanges}
        setDateFilter={setDateFilter}
      />
      <SectionTitle>
        <Message>HistoryScreen.detailTransactions</Message>
      </SectionTitle>
      <CategoryFilter filter={categoryFilter} setFilter={setCategoryFilter} />
      <Show
        when={!transactions.transactionsStore().isLoading}
        fallback={<TransactionListSkeleton />}
      >
        <FilteredTransactions
          dateFilter={dateFilter}
          categoryFilter={categoryFilter}
        />
      </Show>
    </main>
  );
}
