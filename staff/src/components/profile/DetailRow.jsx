const DetailRow = ({ label, value, icon: Icon, isStatus = false }) => {
  return (
    <div className="flex items-start min-w-0">
      {Icon && (
        <div className="mt-0.5 mr-3 text-text-secondary/40 shrink-0">
          <Icon size={15} />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-wider">
          {label}
        </span>
        {isStatus ? (
          <span
            className={`text-sm font-black mt-0.5 ${value === "Active" || value === "Approved" ? "text-success" : "text-amber-500"}`}
          >
            {value}
          </span>
        ) : (
          <span className="text-sm font-bold text-text-primary mt-0.5 break-words">
            {value || "—"}
          </span>
        )}
      </div>
    </div>
  );
};

export default DetailRow
