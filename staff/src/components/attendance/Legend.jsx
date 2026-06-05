export const Legend = ({ dotClass, text }) => (
  <div className="flex items-center text-[10px] font-semibold text-text-secondary">
    <div
      className={`w-2 h-2 rounded-xs mr-1 border border-border/40 shrink-0 ${dotClass}`}
    />
    <span>{text}</span>
  </div>
);
