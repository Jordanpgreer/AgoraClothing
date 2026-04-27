import TodoBoard from "./_components/TodoBoard";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminTodosPage() {
  const content = await loadContent();

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-sm mb-2 text-charcoal/65">Admin To-Do</p>
          <h1 className="wordmark text-2xl font-light text-ink">
            Track launch work and add new tasks as they come up.
          </h1>
        </div>
        <div className="border border-charcoal/15 bg-white px-4 py-3 text-right">
          <p className="label-sm text-charcoal/55">Checklist</p>
          <p className="mt-1 text-sm text-charcoal/75">
            Seeded with your full project list. Check items off as work lands.
          </p>
        </div>
      </div>

      <TodoBoard sections={content.adminTodo ?? []} />
    </div>
  );
}
