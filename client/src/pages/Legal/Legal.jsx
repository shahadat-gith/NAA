import React from "react";
import "./Legal.css";

import {
  useParams,
  Navigate,
} from "react-router-dom";

import Privacy from "./Privacy";
import Terms from "./Terms";
import RefundPolicy from "./RefundPolicy";
import DataPolicy from "./DataPolicy";
import Cookies from "./Cookies";

const legalPages = {
  privacy: Privacy,
  terms: Terms,
  refund: RefundPolicy,
  "data-policy": DataPolicy,
  cookies: Cookies,
};

const Legal = () => {
  const { page } = useParams();

  // Default page
  const currentPage = page || "privacy";

  // Matched component
  const Component =
    legalPages[currentPage];

  // Invalid route
  if (!Component) {
    return (
      <Navigate
        to="/legal/privacy"
        replace
      />
    );
  }

  return (
    <main
      className="legal-layout"
      aria-label="Legal Pages"
    >
      <Component />
    </main>
  );
};

export default Legal;