import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Overview from "./Overview";
import Install from "./Install";
import Monitor from "./Monitor";
import Scripts from "./Scripts";
import Interface from "../../../Interface";
import VmBackups from "./VmBackups";

function ProfessionalPanelContent(props) {
  const { vmDetails, dNone } = props;

  return (
    <>
      <div className={`PanelContent px-2 ${dNone ? "d-none" : ""}`}>
        <Tabs
          defaultActiveKey="Overview"
          className="mb-3"
          style={{ direction: Interface.i18n.GetLangDirection() }}
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
          <Tab eventKey="VmBackup" title={Interface.i18n.T("Backup")}>
            <VmBackups vmDetails={vmDetails} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default ProfessionalPanelContent;
