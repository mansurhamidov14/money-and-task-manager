import { ParentProps } from "solid-js";

export function TransactionGroupSkeleton({ children }: ParentProps) {
  return (
    <div class="flex flex-col gap-3">
      <div class="bg-secondary-300 dark:bg-secondary-600 w-[60px] h-3 mt-1 animate-pulse rounded-md" />
      {children}
    </div>
  );
}