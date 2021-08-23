import React from "react";

import QuickActions_Classic from "./classic";
import QuickActions_Modern from "./modern";
import QuickActions_Professional from "./professional";

function QuickActions(props) {
  const { vmDetails, dNone } = props;

  return (
    <>
      {window.currentTheme.current === "classic" ? (
        <QuickActions_Classic dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
      {window.currentTheme.current === "modern" ? (
        <QuickActions_Modern dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
      {window.currentTheme.current === "professional" ? (
        <QuickActions_Professional dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
    </>
  );
}

export default QuickActions;
