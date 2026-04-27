export function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 border border-charcoal/15 bg-white p-5 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="wordmark text-base text-ink mb-1">{title}</h2>
        {description && (
          <p className="text-[12px] text-charcoal/65">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

export function FieldRow({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <p className="label-sm text-charcoal/65 mb-2">{label}</p>
      {children}
    </div>
  );
}
