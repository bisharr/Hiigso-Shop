export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
}) {
  const alignment =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`mb-8 flex flex-col ${alignment}`}>
      {badge && (
        <span className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
          {badge}
        </span>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
