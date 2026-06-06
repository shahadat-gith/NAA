import React from "react";

const FeesTab = ({data, loading}) => {
  return (
    <div className="ft-container">
      <div className="ft-empty-state">
        <div className="ft-icon">💰</div>
        <h3>Fees Settings</h3>
        <p>Fee configuration will be available soon.</p>
      </div>
    </div>
  );
};

export default FeesTab;