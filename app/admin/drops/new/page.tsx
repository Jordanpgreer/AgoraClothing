import NewDropForm from "../_forms/NewDropForm";

export default function NewDrop() {
  return (
    <div className="px-8 py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="label-sm text-charcoal/65 mb-2">Drops</p>
        <h1 className="wordmark text-2xl text-ink font-light">New Drop</h1>
      </div>
      <NewDropForm />
    </div>
  );
}
