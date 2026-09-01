interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  darkMode: boolean;
}

function StatCard({
  title,
  value,
  description,
  darkMode,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-colors ${
        darkMode
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          darkMode
            ? "text-slate-400"
            : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${
          darkMode
            ? "text-white"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

      {description && (
        <p
          className={`mt-1 text-xs ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;