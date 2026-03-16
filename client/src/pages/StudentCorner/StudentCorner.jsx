import React, { useCallback } from "react";
import "./Styles/StudentCorner.css";
import HeroBanner from "./Components/HeroBanner";
import SectionPanel from "./Components/SectionPanel";
import { NAV_ITEMS } from "./data/navData";

// ── URL param helpers ──────────────────────────────────────────────
function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function setUrlParam(key, value) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
}

function useUrlNav() {
  const tabFromUrl = getUrlParam("tab");
  const subFromUrl = getUrlParam("sub");

  const validTab  = NAV_ITEMS.find((n) => n.id === tabFromUrl) ? tabFromUrl : NAV_ITEMS[0].id;
  const activeTab = NAV_ITEMS.find((n) => n.id === validTab);
  const validSub  = activeTab?.children.find((c) => c.id === subFromUrl)
    ? subFromUrl
    : activeTab?.children[0]?.id ?? null;

  const setTab = useCallback((tabId) => {
    const tab = NAV_ITEMS.find((n) => n.id === tabId);
    setUrlParam("tab", tabId);
    setUrlParam("sub", tab?.children[0]?.id ?? "");
    window.dispatchEvent(new Event("popstate"));
  }, []);

  const setSub = useCallback((subId) => {
    setUrlParam("sub", subId);
    window.dispatchEvent(new Event("popstate"));
  }, []);

  return { activeTab: validTab, activeSub: validSub, setTab, setSub };
}

export default function StudentCorner() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    window.addEventListener("popstate", forceUpdate);
    return () => window.removeEventListener("popstate", forceUpdate);
  }, []);

  const { activeTab, activeSub, setTab, setSub } = useUrlNav();

  return (
    <div className="sc-root">
      <HeroBanner activeTab={activeTab} setTab={setTab} />
      <div className="sc-body">
        <SectionPanel activeTab={activeTab} activeSub={activeSub} setSub={setSub} />
      </div>
    </div>
  );
}