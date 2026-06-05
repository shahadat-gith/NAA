
export const SummaryTile = ({ title, value, textColor }) => (
  <div className=" p-2 text-center shadow-xs">
    <span className={`block text-base font-black tracking-tight ${textColor}`}>
      {value}
    </span>
    <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">
      {title}
    </span>
  </div>
);