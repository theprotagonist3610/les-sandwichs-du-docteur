import useTheme from "../hooks/useTheme";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex text-sm border rounded-full overflow-hidden">
      {themes.map(({ id, label, icon }, index) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`flex items-center px-2 py-1 gap-1 transition text-xs font-medium
            ${theme === id ? "bg-primary" : "text-app"}
            ${index === 0 ? "rounded-l-full" : ""}
            ${index === themes.length - 1 ? "rounded-r-full" : ""}
            ${index > 0 && "border-l border-accent"}
          `}>
          <span>{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
