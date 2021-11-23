import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Monitor from "./Monitor";
import Install from "./Install";
import Scripts from "./Scripts";
import VmBackups from "./VmBackups";

function MainContainer(props) {
  const { vmDetails, dNone } = props;
  return (
    <div
      className={`PanelContent container mt-3 px-3 ${dNone ? "d-none" : ""}`}
    >
      <Monitor vmDetails={vmDetails} />
      <Install vmDetails={vmDetails} />
      <Scripts vmDetails={vmDetails} />
      <VmBackups vmDetails={vmDetails} />
      <div className={`py-5`}></div>
    </div>
  );
}

export default MainContainer;
