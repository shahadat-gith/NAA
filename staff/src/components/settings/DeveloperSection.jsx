import { Code2, RefreshCw, Layers } from "lucide-react";

const DeveloperSection = ({ lastUpdated, onDeveloperClick }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider px-1">System Architecture</h3>
    <div className="bg-card border border-border rounded-2xl divide-y divide-border/50 shadow-xs">
      <div className="flex items-center justify-between p-4 text-sm font-medium">
        <div className="flex items-center space-x-3 text-text-secondary">
          <Code2 size={16} className="text-primary" />
          <span>Developer</span>
        </div>
        <button type="button" onClick={onDeveloperClick} className="font-bold text-primary hover:underline bg-transparent border-none outline-none cursor-pointer">
          Shahadat Ali
        </button>
      </div>
      <div className="flex items-center justify-between p-4 text-sm font-medium">
        <div className="flex items-center space-x-3 text-text-secondary">
          <RefreshCw size={16} className="text-primary" />
          <span>Last Updated on</span>
        </div>
        <span className="text-xs text-success font-semibold">{lastUpdated || "Just now"}</span>
      </div>
      <div className="flex items-center justify-between p-4 text-sm font-medium">
        <div className="flex items-center space-x-3 text-text-secondary">
          <Layers size={16} className="text-primary" />
          <span>Current Version</span>
        </div>
        <span className="text-text-primary font-bold">v1.0.0</span>
      </div>
    </div>
  </div>
);

export default DeveloperSection;