

export const Input = ({ label, name, type = "text", value, onChange, placeholder, required = false, ...props }) => (
  <div className="flex flex-col space-y-2 w-full min-w-0">
    <label htmlFor={name} className="text-xs font-bold text-text-secondary uppercase tracking-wider">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="w-full px-4 py-3 border rounded-2xl bg-background border-border text-text-primary text-sm font-medium outline-none placeholder:text-text-secondary/40 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      {...props}
    />
  </div>
);