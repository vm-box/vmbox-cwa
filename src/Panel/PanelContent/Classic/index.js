import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Overview from "./Overview";
import Install from "./Install";
import Monitor from "./Monitor";
import Scripts from "./Scripts";
import Interface from "../../../Interface";
import VmBackups from "./VmBackups";

function ClassicPanelContent(props) {
  const { vmDetails, dNone } = props;

  return (
    <>
      <div className={`PanelContent container mt-3 ${dNone ? "d-none" : ""}`}>
        <Tabs
          style={{ direction: Interface.i18n.GetLangDirection() }}
          defaultActiveKey="Overview"
          className="mb-3"
        >
          <Tab eventKey="Overview" title={Interface.i18n.T("Overview")}>
            <Overview vmDetails={vmDetails} />
          </Tab>
          <Tab eventKey="Install" title={Interface.i18n.T("Install")}>
            <Install vmDetails={vmDetails} />
          </Tab>
          <Tab eventKey="Monitor" title={Interface.i18n.T("Monitor")}>
            <Monitor vmDetails={vmDetails} />
          </Tab>
          <Tab eventKey="Scripts" title={Interface.i18n.T("Scripts")}>
            <Scripts vmDetails={vmDetails} />
          </Tab>
          <Tab eventKey="VmBackups" title={Interface.i18n.T("Backups")}>
            <VmBackups vmDetails={vmDetails} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default ClassicPanelContent;
