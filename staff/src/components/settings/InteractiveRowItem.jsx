const InteractiveRowItem = ({ icon: Icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full p-4 flex items-start text-left bg-transparent border-none outline-none cursor-pointer hover:bg-text-primary/5 transition-colors group first:rounded-t-2xl last:rounded-b-2xl"
  >
    <div className="mt-0.5 mr-3 text-primary shrink-0"><Icon size={16} /></div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors tracking-tight">{title}</h4>
      <p className="text-xs font-medium text-text-secondary mt-0.5 leading-relaxed">{description}</p>
    </div>
  </button>
);

export default InteractiveRowItem;