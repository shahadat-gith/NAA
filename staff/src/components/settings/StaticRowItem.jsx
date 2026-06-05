const StaticRowItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 text-sm font-medium">
    <div className="flex items-center space-x-3 text-text-secondary shrink-0">
      <Icon size={16} className="text-primary" />
      <span>{label}</span>
    </div>
    <span className="text-text-primary font-bold truncate max-w-60 text-right">{value || "—"}</span>
  </div>
);

export default StaticRowItem;