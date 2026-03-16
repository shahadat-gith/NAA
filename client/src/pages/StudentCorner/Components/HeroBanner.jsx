import React from "react";
import { NAV_ITEMS } from "../data/navData";
import "../Styles/HeroBanner.css";

export default function HeroBanner({ activeTab, setTab }) {
  return (
    <div className="hero-banner">
      <div className="hero-texture" />

      {/* title block */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Student Corner
        </div>
        <h1 className="hero-title">
          Student <span className="hero-accent">Corner</span>
        </h1>
      </div>

      {/* nav tabs — always visible, wraps on mobile */}
      <nav className="hero-nav">
        <div className="hero-nav-inner">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`hero-nav-tab ${activeTab === item.id ? "hero-nav-tab--active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span className="hero-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="hero-shapes" aria-hidden="true">
        <div className="hs hs1" />
        <div className="hs hs2" />
        <div className="hs hs3" />
      </div>
    </div>
  );
}