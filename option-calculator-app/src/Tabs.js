import React from "react";

function Tabs({ activeTab, onChange }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "form" ? "active" : ""}
        onClick={() => onChange("form")}
      >
        Form
      </button>
      <button
        className={activeTab === "table" ? "active" : ""}
        onClick={() => onChange("table")}
      >
        Table
      </button>
      <button
        className={activeTab === "graphs" ? "active" : ""}
        onClick={() => onChange("graphs")}
      >
        Graphs
      </button>
    </div>
  );
}

export default Tabs;
