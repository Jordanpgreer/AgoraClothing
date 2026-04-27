"use client";

import { useState, useTransition } from "react";
import { updateAdminTodo } from "@/lib/actions";
import type { AdminTodoSection } from "@/lib/admin-todos";
import { useSavedFlag } from "@/components/admin/useSavedFlag";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function TodoBoard({ sections }: { sections: AdminTodoSection[] }) {
  const [items, setItems] = useState(sections);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useSavedFlag();

  function toggleItem(sectionId: string, itemId: string) {
    setItems((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((todo) =>
                todo.id === itemId ? { ...todo, done: !todo.done } : todo,
              ),
            }
          : section,
      ),
    );
  }

  function renameItem(sectionId: string, itemId: string, text: string) {
    setItems((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((todo) =>
                todo.id === itemId ? { ...todo, text } : todo,
              ),
            }
          : section,
      ),
    );
  }

  function addItem(sectionId: string) {
    setItems((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [
                ...section.items,
                { id: makeId(), text: "New to-do item", done: false },
              ],
            }
          : section,
      ),
    );
  }

  function removeItem(sectionId: string, itemId: string) {
    setItems((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((todo) => todo.id !== itemId),
            }
          : section,
      ),
    );
  }

  function addSection() {
    setItems((current) => [
      ...current,
      { id: makeId(), title: "New Section", items: [] },
    ]);
  }

  function renameSection(sectionId: string, title: string) {
    setItems((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, title } : section,
      ),
    );
  }

  function removeSection(sectionId: string) {
    setItems((current) => current.filter((section) => section.id !== sectionId));
  }

  function save() {
    start(async () => {
      await updateAdminTodo(items);
      setSaved();
    });
  }

  const totals = {
    total: items.reduce((sum, section) => sum + section.items.length, 0),
    complete: items.reduce(
      (sum, section) => sum + section.items.filter((todo) => todo.done).length,
      0,
    ),
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1.4fr_0.9fr_0.9fr]">
        <div className="border border-charcoal/15 bg-white p-5 sm:p-6">
          <p className="label-sm text-charcoal/55">Progress</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <span className="font-display text-5xl text-ink">{totals.complete}</span>
            <span className="text-sm text-charcoal/60 sm:pb-2">of {totals.total} complete</span>
          </div>
          <div className="mt-4 h-2 bg-limestone">
            <div
              className="h-full bg-charcoal transition-[width] duration-300"
              style={{
                width:
                  totals.total === 0
                    ? "0%"
                    : `${Math.round((totals.complete / totals.total) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="border border-charcoal/15 bg-white p-5 sm:p-6">
          <p className="label-sm text-charcoal/55">Sections</p>
          <p className="mt-3 font-display text-4xl text-ink">{items.length}</p>
        </div>

        <div className="border border-charcoal/15 bg-white p-5 sm:p-6">
          <p className="label-sm text-charcoal/55">Actions</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addSection}
              className="label-sm border border-ink/30 px-3 py-2 text-ink transition hover:bg-ink hover:text-bone"
            >
              Add Section
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="label-sm bg-ink px-4 py-2 text-bone transition hover:bg-charcoal disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? "Saving..." : "Save Board"}
            </button>
          </div>
          {saved && <p className="label-sm mt-3 text-charcoal/60">Saved.</p>}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {items.map((section) => {
          const doneCount = section.items.filter((todo) => todo.done).length;

          return (
            <section key={section.id} className="border border-charcoal/15 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-charcoal/10 pb-4">
                <div className="min-w-0 flex-1">
                  <input
                    value={section.title}
                    onChange={(event) => renameSection(section.id, event.target.value)}
                    className="wordmark w-full bg-transparent text-lg text-ink outline-none"
                  />
                  <p className="label-sm mt-2 text-charcoal/55">
                    {doneCount} / {section.items.length} complete
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="label-sm text-charcoal/55 transition hover:text-ink"
                >
                  Remove Section
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {section.items.map((todo) => (
                  <div
                    key={todo.id}
                    className="grid gap-3 border border-charcoal/10 bg-bone/40 px-3 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-start"
                  >
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleItem(section.id, todo.id)}
                      className="h-4 w-4 accent-charcoal sm:mt-1"
                    />
                    <textarea
                      value={todo.text}
                      onChange={(event) =>
                        renameItem(section.id, todo.id, event.target.value)
                      }
                      rows={todo.text.length > 120 ? 4 : 2}
                      className={`min-h-12 w-full resize-y bg-transparent text-sm leading-relaxed text-ink outline-none ${
                        todo.done ? "text-charcoal/45 line-through" : ""
                      }`}
                    />
                    <div className="flex justify-end sm:block">
                      <button
                        type="button"
                        onClick={() => removeItem(section.id, todo.id)}
                        className="label-sm text-charcoal/50 transition hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addItem(section.id)}
                  className="label-sm border border-ink/30 px-3 py-2 text-ink transition hover:bg-ink hover:text-bone"
                >
                  Add Item
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
