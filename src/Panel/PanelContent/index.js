import React from "react";
import ClassicPanelContent from "./Classic";
import ModernPanelContent from "./Modern";
import ProfessionalPanelContent from "./Professional";

function PanelContent(props) {
  const { vmDetails, dNone } = props;

  return (
    <>
      {window.currentTheme.current === "classic" ? (
        <ClassicPanelContent dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
      {window.currentTheme.current === "modern" ? (
        <ModernPanelContent dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
      {window.currentTheme.current === "professional" ? (
        <ProfessionalPanelContent dNone={dNone} vmDetails={vmDetails} />
      ) : undefined}
    </>
  );
}

export default PanelContent;
