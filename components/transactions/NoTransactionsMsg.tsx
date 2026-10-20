import { Inbox } from "lucide-react";

export default function NoTransactionsMsg() {
  return (
    <div className="p-12 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 text-center space-y-2">
      <Inbox className="h-8 w-8 text-zinc-600 mx-auto" />
      <h3 className="text-sm font-semibold text-zinc-300">No transactions found</h3>
      <p className="text-xs text-zinc-500">Try adjusting your filters or add a new transaction.</p>
    </div>
  );
}