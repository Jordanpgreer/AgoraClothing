import NewDropForm from "../_forms/NewDropForm";

export default function NewDrop() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <p className="mb-2 label-sm text-charcoal/65">Drops</p>
        <h1 className="wordmark text-2xl font-light text-ink">New Drop</h1>
      </div>
      <NewDropForm />
    </div>
  );
}
