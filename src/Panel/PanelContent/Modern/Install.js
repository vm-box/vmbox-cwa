import React from "react";
import { DropdownButton, Dropdown, Button, Modal } from "react-bootstrap";
import SVGs from "../../../assets/SVGs";
import Loader from "../../../Components/Loader";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";

function Install(props) {
  const { vmDetails } = props;

  return (
    <div
      className={`modernMainPanelCard p-3 mb-5`}
      style={{ direction: Interface.i18n.GetLangDirection() }}
    >
      <h3 style={{ borderBottom: "1px solid #aaaaaa80" }}>
        {Interface.i18n.T("Install")}
      </h3>
      <PlanTemplates vmDetails={vmDetails} />
      <CdDrives vmDetails={vmDetails} />
    </div>
  );
}

function PlanTemplates(props) {
  const { vmDetails } = props;

  const [temps, setTemps] = React.useState();

  const [selectedTemplate, setSelectedTemplate] = React.useState();
  const [modalShown, setModalShown] = React.useState(false);

  React.useEffect(() => {
    MessageHandler.On(MessageHandler.MessageTypes.SetPlanTemplates, (data) => {
      var parsedData = JSON.parse(data);
      if (parsedData.length) {
        setTemps(parsedData);
      } else {
        setTemps([]);
      }
    });
    Interface.SendCommand(
      Interface.Commands.GetPlanTemplates,
      "",
      vmDetails.VmRecordId
    );
  }, []);

  var groups = {};
  var allLogos = [];
  var tempsWithLogo = temps
    ? !vmDetails.Status.toLowerCase().includes("pending")
      ? temps.map((t) => {
          var logo = window.OsLogos.other;
          if (window.OsTags[t.Name]) {
            logo = window.OsTags[t.Name];
          } else if (window.OsTags[t.OsType]) {
            logo = window.OsTags[t.OsType];
          }
          if (!groups[logo]) {
            groups[logo] = [];
            if (!allLogos) allLogos = [];
            allLogos.push(logo);
          }
          groups[logo].push(t);
          return { ...t, Logo: logo };
        })
      : []
    : null;

  // each card has a logo and a list of templates. if there is only one template, it's not a list. it's a description
  var cards = [];

  if (window.Defaults.ModernPanel.InstallSection.GroupPlanTemplates) {
    cards = allLogos
      ? allLogos.map((l) => ({
          Logo: l,
          templates: groups[l],
        }))
      : null;
  } else {
    cards = tempsWithLogo
      ? tempsWithLogo.map((t) => ({
          Logo: t.Logo,
          templates: [t],
        }))
      : null;
  }

  const ReinstallOsClicked = (template) => () => {
    setSelectedTemplate(template);
    setModalShown(true);
  };

  const ReinstallOs = () => {
    Interface.SendCommand(
      Interface.Commands.EditPlanTemplate,
      selectedTemplate.Id,
      vmDetails.VmRecordId
    );
    setModalShown(false);
  };

  return (
    <>
      <div
        className={`planTemplatesContainer d-flex justify-content-center`}
        style={{ flexWrap: "wrap" }}
      >
        {cards ? (
          cards.length > 0 ? (
            cards.map((c, i) => (
              <div
                key={i}
                className={`p-2 col-xs-12 col-md-6 col-lg-5 col-xl-4`}
                style={{ minWidth: "60px" }}
              >
                <span
                  className={`InstallCard w-100 m-2 p-2 d-flex justify-content-around align-items-center`}
                >
                  <img
                    className={`p-2`}
                    style={{ display: "inline", width: "80px" }}
                    src={c.Logo}
                  />
                  {c.templates.length > 1 ? (
                    <>
                      <DropdownButton
                        variant={"outline-secondary"}
                        size={"sm"}
                        title={Interface.i18n.T("Select a Template")}
                        style={{ display: "inline", marginRight: "10px" }}
                      >
                        {c.templates.map((t, i) => (
                          <Dropdown.Item
                            key={i}
                            onSelect={ReinstallOsClicked(t)}
                          >
                            {t.Name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </>
                  ) : c.templates.length > 0 ? (
                    <Button
                      variant={"outline-secondary"}
                      size={"sm"}
                      onClick={ReinstallOsClicked(c.templates[0])}
                    >
                      {Interface.i18n.T("Install")} {c.templates[0].Name}
                    </Button>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            ))
          ) : (
            <div className={`text-center w-100 py-4`}>
              {Interface.i18n.T("No Templates found")}
            </div>
          )
        ) : (
          <Loader style={{ margin: "1rem auto" }} />
        )}
      </div>

      <Modal show={modalShown} centered onHide={() => setModalShown(false)}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Are you sure?")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ direction: Interface.i18n.GetLangDirection() }}>
          {selectedTemplate
            ? `${Interface.i18n.T("You're about to Install this OS:")} ${
                selectedTemplate.Name
              }`
            : undefined}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("No")}
          </Button>
          <Button onClick={() => ReinstallOs()}>
            {Interface.i18n.T("Yes")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function CdDrives(props) {
  const { vmDetails } = props;

  const [cdDrives, setCdDrives] = React.useState([]);
  const [selectedIso, setSelectedIso] = React.useState();
  const [modalShown, setModalShown] = React.useState(false);

  React.useEffect(() => {
    MessageHandler.On(MessageHandler.MessageTypes.SetCdDrives, (data) => {
      var parsedData = JSON.parse(data);
      if (parsedData.length) {
        setCdDrives(parsedData);
      }
    });
    Interface.SendCommand(
      Interface.Commands.GetCdDrives,
      "",
      vmDetails.VmRecordId
    );
  }, []);

  const InsertIsoClicked = (cdDrive) => () => {
    setSelectedIso(cdDrive);
    setModalShown(true);
  };

  const EjectIsoClicked = () => {
    setSelectedIso();
    setModalShown(true);
  };

  const InsertOrEjectIso = () => {
    if (selectedIso) {
      // insert
      Interface.SendCommand(
        Interface.Commands.InsertISO,
        selectedIso.Id,
        vmDetails.VmRecordId
      );
    } else {
      // eject
      Interface.SendCommand(
        Interface.Commands.EjectISO,
        "",
        vmDetails.VmRecordId
      );
    }
    setModalShown(false);
  };

  return (
    <>
      <div
        className={`cdDrivesContainer d-flex justify-content-center`}
        style={{ flexWrap: "wrap" }}
      >
        {!vmDetails.Status.toLowerCase().includes("pending")
          ? cdDrives.map((cd, i) => (
              <div
                key={i}
                className={`p-2 col-xs-12 col-md-6 col-lg-5 col-xl-4`}
              >
                <span
                  className={`InstallCard w-100 m-2 p-2 d-flex justify-content-around align-items-center`}
                >
                  <SVGs.IsoFile
                    className={`p-2`}
                    size={"80"}
                    style={{ display: "inline", width: "80px" }}
                  />
                  <Button
                    variant={"outline-secondary"}
                    size={"sm"}
                    onClick={InsertIsoClicked(cd)}
                  >
                    {Interface.i18n.T("Insert")} {cd.Name}
                  </Button>
                </span>
              </div>
            ))
          : undefined}

        {!vmDetails.Status.toLowerCase().includes("pending") &&
        cdDrives.length > 0 ? (
          <div className={`p-2 col-xs-12 col-md-6 col-lg-5 col-xl-4`}>
            <span
              className={`InstallCard w-100 m-2 p-2 d-flex justify-content-around align-items-center`}
            >
              <SVGs.IsoFile
                className={`p-2`}
                size={"80"}
                style={{ display: "inline", width: "80px" }}
              />
              <Button
                variant={"outline-secondary"}
                size={"sm"}
                onClick={() => EjectIsoClicked()}
              >
                {Interface.i18n.T("Eject ISO")}
              </Button>
            </span>
          </div>
        ) : undefined}
      </div>

      <Modal show={modalShown} centered onHide={() => setModalShown(false)}>
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title>{Interface.i18n.T("Are you sure?")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ direction: Interface.i18n.GetLangDirection() }}>
          {selectedIso
            ? `${Interface.i18n.T("You're about to Insert ISO Image:")} ${
                selectedIso.Name
              }`
            : Interface.i18n.T("You're about to Eject all ISO images.")}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("No")}
          </Button>
          <Button onClick={() => InsertOrEjectIso()}>
            {Interface.i18n.T("Yes")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Install;
