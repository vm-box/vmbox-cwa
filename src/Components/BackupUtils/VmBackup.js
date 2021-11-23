import React from "react";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";
import Interface from "../../Interface";
import SVGs from "../../assets/SVGs";
import MessageHandler from "../../Interface/MessageHandler";
import BackupScheduler from "./BackupScheduler";
import SecondaryDst from "./SecondaryDst";
import RestoreBackup from "./RestoreBackup";

function VmBackup(props) {
  const { vmDetails, vmBackup, Refresh } = props;

  const reloadVmBackupTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [loadedVmBackupState, setLoadedVmBackupState] = React.useState();

  const loadVmBackupState = () => {
    Interface.SendCommand(
      Interface.Commands.GetVmBackupState,
      vmBackup.Id,
      vmDetails.VmRecordId
    );
    setTimeout(() => {
      if (!reloadVmBackupTimeout.current) {
        setLoadedVmBackupState();
      }
    }, 5000);
  };

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetVmBackupState,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        if (`${parsedData.VmBackupId}` !== `${vmBackup.Id}`) return;
        setLoadedVmBackupState(parsedData);
        if (reloadVmBackupTimeout.current) {
          clearTimeout(reloadVmBackupTimeout.current);
        }
        reloadVmBackupTimeout.current = setTimeout(
          () => loadVmBackupState(),
          250
        );
      }
    );
    loadVmBackupState();
    return () => {
      if (reloadVmBackupTimeout.current) {
        clearTimeout(reloadVmBackupTimeout.current);
      }
      unmountedFlag.current = true;
    };
  }, []);

  const [modalShown, setModalShown] = React.useState(false);

  const [selectedTab, setSelectedTab] = React.useState(
    vmBackup && vmBackup.defaultTab && typeof vmBackup.defaultTab === "string"
      ? vmBackup.defaultTab
      : !vmBackup.UseOnlyDefaultSecondaryDst
      ? "SecondaryDst"
      : !vmBackup.CustomerCannotRestore
      ? "Restore"
      : ""
  );

  const openModal = () => {
    setModalShown(true);
  };

  var stateClassName = "";
  if (vmBackup.Running) {
    stateClassName = "active";
    loadVmBackupState();
  }

  const onStopClicked = () => {
    if (!vmBackup || !vmBackup.Running) return;
    Interface.SendCommand(
      Interface.Commands.CancelBackup,
      `${vmBackup.Id}`,
      vmDetails.VmRecordId
    );
  };

  return (
    <div
      className={`vmBackup ${stateClassName}`}
      onClick={() => !modalShown && openModal()}
    >
      <SVGs.UploadCloud
        size={64}
        strokeWidth={"1.2"}
        style={{
          color: "#25d5e4",
          fill: "rgba(37, 213, 228, 0.29)",
        }}
      />
      <span className={`vmBackupTitle`}>{vmBackup.BackupName}</span>
      <span
        className={`vmBackupTitle`}
        style={{ fontSize: ".6rem", wordWrap: "break-word" }}
      >
        {loadedVmBackupState
          ? loadedVmBackupState.State
          : vmBackup.RunningState}
      </span>
      <Modal
        show={modalShown}
        className={`${Interface.Theme.GetThemeAndModeClassName()} vmBackupModal`}
        centered
        size={"lg"}
        onHide={() => setModalShown(false)}
      >
        <Modal.Header className={`px-1 pt-2 pb-1`}>
          <Modal.Title className={`d-flex align-items-center w-100`}>
            <SVGs.UploadCloud
              size={58}
              strokeWidth={"1.2"}
              style={{
                margin: "0 12px",
                color: "#25d5e4",
                fill: "rgba(37, 213, 228, 0.29)",
              }}
            />
            {vmBackup.BackupName}{" "}
            <span className={`px-2`} style={{ fontSize: ".9rem" }}>
              {vmBackup.BackupDesc}
            </span>
            <span
              className={`px-2 text-center`}
              style={{ fontSize: ".9rem", flexGrow: "1" }}
            >
              {loadedVmBackupState
                ? `${loadedVmBackupState.State} ${
                    loadedVmBackupState.State !== "Finished" &&
                    loadedVmBackupState.StateDetails
                      ? loadedVmBackupState.StateDetails
                      : ""
                  }`
                : `${vmBackup.RunningState} ${
                    vmBackup.RunningState !== "Finished" &&
                    vmBackup.RunningStateDetails
                      ? vmBackup.RunningStateDetails
                      : ""
                  }`}
            </span>
          </Modal.Title>
          {vmBackup.Running ? (
            <Button
              variant={"outline-danger"}
              size={"sm"}
              onClick={onStopClicked}
            >
              {Interface.i18n.T("Stop")}
            </Button>
          ) : undefined}
        </Modal.Header>
        <Modal.Body>
          <div
            className={`d-flex justify-content-center align-items-center my-2`}
          >
            <NextBackupConfig
              vmDetails={vmDetails}
              backup={vmBackup}
              Refresh={Refresh}
            />
          </div>
          <Tabs
            activeKey={selectedTab}
            className="mt-3"
            onSelect={(e) => setSelectedTab(e)}
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            {!vmBackup.UseOnlyDefaultSecondaryDst ? (
              <Tab
                eventKey="SecondaryDst"
                title={Interface.i18n.T("Secondary Destination")}
              >
                <SecondaryDst
                  vm={vmDetails}
                  backup={vmBackup}
                  Refresh={() => {
                    setModalShown(false);
                    Refresh();
                  }}
                />
              </Tab>
            ) : undefined}
            {!vmBackup.CustomerCannotRestore ? (
              <Tab eventKey="Restore" title={Interface.i18n.T("Restore")}>
                <RestoreBackup
                  vm={vmDetails}
                  backup={vmBackup}
                  CloseMainBackupModal={() => {
                    setModalShown(false);
                    setSelectedTab("SecondaryDst");
                  }}
                  Refresh={() => Refresh()}
                />
              </Tab>
            ) : undefined}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function NextBackupConfig(props) {
  const { vmDetails, backup, Refresh } = props;

  const overrideAnyRestrictions = React.useRef();

  const onEditClickedRef = React.useRef(() => {});

  const [manualBackupModalShown, setManualBackupModalShown] =
    React.useState(false);

  const [periodicBackupModalShown, setPeriodicBackupModalShown] =
    React.useState(false);

  var defaultInterval = isNaN(Number(backup.BackupPeriodInterval))
    ? 8 * 3600
    : Number(backup.BackupPeriodInterval);
  var defaultIntervalUnit = 60;
  if (defaultInterval !== 0 && defaultInterval % 86400 === 0) {
    defaultInterval = defaultInterval / 86400;
    defaultIntervalUnit = 86400;
  } else if (defaultInterval !== 0 && defaultInterval % 3600 === 0) {
    defaultInterval = defaultInterval / 3600;
    defaultIntervalUnit = 3600;
  } else if (defaultInterval !== 0 && defaultInterval % 60 === 0) {
    defaultInterval = defaultInterval / 60;
    defaultIntervalUnit = 60;
  } else if (defaultInterval !== 0) {
    defaultIntervalUnit = 1;
  }
  const newBackupIntervalObj = React.useRef({
    interval: defaultInterval,
    unit: defaultIntervalUnit,
  });

  var nextPossibleBackupTimeStamp = 0;
  if (backup.MinimumBackupInterval > 0) {
    nextPossibleBackupTimeStamp =
      backup.LastBackupDate + backup.MinimumBackupInterval;
  }

  if (backup.ExecType === "manual") {
    return (
      <>
        <Button
          disabled={backup.Running}
          variant={`primary`}
          onClick={() => setManualBackupModalShown(true)}
          style={{ direction: Interface.i18n.GetLangDirection() }}
        >
          {Interface.i18n.T("Create a Backup Now!")}
        </Button>

        <Modal
          show={manualBackupModalShown}
          className={`${Interface.Theme.GetThemeAndModeClassName()} vmBackupModal`}
          centered
          onHide={() => setManualBackupModalShown(false)}
          backdropClassName={`backdrop-Z-index-1060`}
        >
          <Modal.Header
            style={{ direction: Interface.i18n.GetLangDirection() }}
          >
            <Modal.Title
              style={{ direction: Interface.i18n.GetLangDirection() }}
            >
              {Interface.i18n.T("Create a Backup Now!")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ direction: Interface.i18n.GetLangDirection() }}>
            {nextPossibleBackupTimeStamp > Number(new Date()) / 1000 ? (
              <p>
                {Interface.i18n.T(
                  "Cannot create a Backup yet. The minimum interval between two Backups is"
                )}
                :{" "}
                {Interface.Utils.Time.SecondsToElapsed(
                  backup.MinimumBackupInterval
                )}
                .<br />
                <br />
                {Interface.i18n.T("You can create the next backup at")}{" "}
                {Interface.Utils.Time.UnixToDateString(
                  nextPossibleBackupTimeStamp
                )}
              </p>
            ) : (
              <p>
                {Interface.i18n.T(
                  "Are you sure you want to create a Backup now?"
                )}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            {nextPossibleBackupTimeStamp > Number(new Date()) / 1000 ? (
              <Button
                variant={"outline-primary"}
                onClick={() => setManualBackupModalShown(false)}
              >
                {Interface.i18n.T("Ok")}
              </Button>
            ) : (
              <>
                <Button
                  variant={"outline-primary"}
                  onClick={() => setManualBackupModalShown(false)}
                >
                  {Interface.i18n.T("No")}
                </Button>
                <Button
                  variant={"primary"}
                  onClick={() => {
                    Interface.SendCommand(
                      Interface.Commands.SetNextBackupDate,
                      {
                        VmBackupId: backup.Id,
                        NextBackupDate: 0,
                      },
                      vmDetails.VmRecordId
                    );
                    setManualBackupModalShown(false);
                  }}
                >
                  {Interface.i18n.T("Yes")}
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  if (backup.ExecType === "periodic") {
    return (
      <div
        className={`d-flex justify-content-center align-items-center`}
        style={{ flexDirection: "column" }}
      >
        <h5
          className={`text-center mb-1`}
          style={{
            color: "#888ea8",
            direction: Interface.i18n.GetLangDirection(),
          }}
        >
          {Interface.i18n.T("Next Backup")}:
        </h5>
        <NextBackupTime
          backup={backup}
          vmDetails={vmDetails}
          Refresh={Refresh}
        />
        <h6 className={`text-center mb-1`} style={{ color: "#888ea8" }}>
          {Interface.i18n.T("Interval")}:{" "}
          {Interface.Utils.Time.SecondsToElapsed(
            defaultInterval * defaultIntervalUnit
          )}
        </h6>
        <div className={`d-flex justify-content-center py-1`}>
          <button
            className={`btn btn-outline-primary`}
            onClick={() => {
              setPeriodicBackupModalShown(true);
            }}
          >
            <SVGs.Calendar style={{ marginRight: "5px" }} />{" "}
            {Interface.i18n.T("Change Interval")}
          </button>
          <Modal
            show={periodicBackupModalShown}
            className={`${Interface.Theme.GetThemeAndModeClassName()} vmBackupModal`}
            centered
            onHide={() => setPeriodicBackupModalShown(false)}
            backdropClassName={`backdrop-Z-index-1060`}
          >
            <Modal.Header>
              <Modal.Title>{Interface.i18n.T("Change Interval")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {Interface.i18n.T("Select the period between each backup.")}
              </p>
              {backup.MinimumBackupInterval > 0 ? (
                <p>
                  {Interface.i18n.T("The Minimum Backup Interval is")}:{" "}
                  {Interface.Utils.Time.SecondsToElapsed(
                    backup.MinimumBackupInterval
                  )}
                </p>
              ) : undefined}
              <div className={`input-group mb-3 d-flex justify-content-center`}>
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    {Interface.i18n.T("Interval")}
                  </div>
                </div>
                <input
                  className="form-control hiddenNumberArrow"
                  type={"number"}
                  placeholder={"The length of each period."}
                  defaultValue={defaultInterval}
                  style={{
                    flexGrow: "0",
                    width: "auto",
                    maxWidth: "120px",
                    padding: "0.2rem 0.75rem",
                  }}
                  onChange={(e) => {
                    var N = Number(e.target.value);
                    if (isNaN(N) && e.target.value !== "-") return;
                    if (e.target.value === "") return;
                    newBackupIntervalObj.current.interval = N;
                  }}
                />

                <select
                  id={`${backup.Id}_selectBackupInterval`}
                  className={`btn btn-outline-primary`}
                  defaultValue={defaultIntervalUnit}
                  placeholder={"Select"}
                  onChange={(e) => {
                    newBackupIntervalObj.current.unit = Number(e.target.value);
                  }}
                >
                  <option value={60}>{Interface.i18n.T("Minute(s)")}</option>
                  <option value={3600}>{Interface.i18n.T("Hour(s)")}</option>
                  <option value={86400}>{Interface.i18n.T("Day(s)")}</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant={"outline-primary"}
                onClick={() => setPeriodicBackupModalShown(false)}
              >
                {Interface.i18n.T("Close")}
              </Button>
              <Button
                variant={"primary"}
                onClick={() => {
                  if (
                    newBackupIntervalObj.current.interval *
                      newBackupIntervalObj.current.unit <
                    backup.MinimumBackupInterval
                  ) {
                    Interface.Alert.Show(
                      `${Interface.i18n.T(
                        `Backup Interval can not be less than`
                      )} ${Interface.Utils.Time.SecondsToElapsed(
                        backup.MinimumBackupInterval
                      )}`,
                      "error"
                    );
                    return;
                  }

                  if (
                    newBackupIntervalObj.current.interval *
                      newBackupIntervalObj.current.unit <
                    300
                  ) {
                    Interface.Alert.Show(
                      Interface.i18n.T(
                        "Backup Interval can not be less than 5 minutes"
                      ),
                      "error"
                    );
                    return;
                  }
                  Interface.SendCommand(
                    Interface.Commands.SetBackupPeriodInterval,
                    {
                      VmBackupId: backup.Id,
                      Interval:
                        newBackupIntervalObj.current.interval *
                        newBackupIntervalObj.current.unit,
                    },
                    vmDetails.VmRecordId
                  );
                  setPeriodicBackupModalShown(false);
                  Refresh();
                }}
              >
                {Interface.i18n.T("Submit")}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

  if (backup.ExecType === "scheduled") {
    return (
      <div
        className={`d-flex justify-content-center align-items-center`}
        style={{ flexDirection: "column" }}
      >
        <h5
          className={`text-center mb-1`}
          style={{
            color: "#888ea8",
            direction: Interface.i18n.GetLangDirection(),
          }}
        >
          {Interface.i18n.T("Next Backup")}:
        </h5>
        <NextBackupTime
          backup={backup}
          vmDetails={vmDetails}
          Refresh={Refresh}
        />
        <ChangeBackupSchedule
          backup={backup}
          vmDetails={vmDetails}
          Refresh={Refresh}
        />
      </div>
    );
  }

  if (backup.ExecType === "due-date") {
    return (
      <div
        className={`d-flex justify-content-center align-items-center`}
        style={{ flexDirection: "column" }}
      >
        <h5
          className={`text-center mb-1`}
          style={{
            color: "#888ea8",
            direction: Interface.i18n.GetLangDirection(),
          }}
        >
          {Interface.i18n.T("Next Backup")}:
        </h5>
        <NextBackupTime
          backup={backup}
          vmDetails={vmDetails}
          Refresh={Refresh}
          nextPossibleBackupTimeStamp={
            nextPossibleBackupTimeStamp > 0
              ? nextPossibleBackupTimeStamp
              : false
          }
          onEditClickedRef={onEditClickedRef}
        />
        <div className={`d-flex justify-content-center py-1`}>
          <button
            className={`btn btn-sm btn-outline-primary`}
            onClick={() => onEditClickedRef.current()}
          >
            <SVGs.Calendar style={{ marginRight: "5px" }} />
            {Interface.i18n.T("Change Due-Date")}
          </button>
        </div>
      </div>
    );
  }

  return <></>;
}

function ChangeBackupSchedule(props) {
  const { backup, vmDetails, Refresh } = props;

  const [modalShown, setModalShown] = React.useState(false);

  return (
    <div className={`d-flex justify-content-center py-1`}>
      <button
        className={`btn btn-sm btn-outline-primary`}
        onClick={() => setModalShown(true)}
      >
        <SVGs.Calendar style={{ marginRight: "5px" }} />
        {Interface.i18n.T("Change Backup Schedule")}
      </button>
      <Modal
        show={modalShown}
        className={`${Interface.Theme.GetThemeAndModeClassName()} vmBackupModal`}
        size={"lg"}
        onHide={() => setModalShown(false)}
        backdropClassName={`backdrop-Z-index-1060`}
      >
        <Modal.Header>
          <Modal.Title>
            {Interface.i18n.T("Change Backup Schedule")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BackupScheduler
            backup={backup}
            BackupSchedule={backup ? backup.BackupSchedule : ""}
            onSubmit={(s) => {
              Interface.SendCommand(Interface.Commands.SetBackupSchedule, {
                VmBackupId: backup.Id,
                BackupSchedule: `${s}`,
              });
              setModalShown(false);
              Refresh();
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function NextBackupTime(props) {
  const {
    backup,
    vmDetails,
    Refresh,
    nextPossibleBackupTimeStamp,
    onEditClickedRef,
  } = props;

  const newNextBackupDate = React.useRef();

  const [modalShown, setModalShown] = React.useState(false);

  if (onEditClickedRef) {
    onEditClickedRef.current = () => {
      setModalShown(true);
      setTimeout(() => {
        window.flatpickr(
          document.getElementById(`${backup.Id}_changeNextBackupInput`),
          {
            enableTime: true,
            position: "below center",
            static: true,
            minDate:
              nextPossibleBackupTimeStamp > 0
                ? new Date(nextPossibleBackupTimeStamp * 1000)
                : new Date(),
            defaultDate:
              backup.NextBackupDate > 1632917742
                ? new Date(backup.NextBackupDate * 1000)
                : "",
            onChange: function (selectedDates, dateStr, instance) {
              newNextBackupDate.current = selectedDates[0];
            },
          }
        );
      }, 50);
    };
  }

  return (
    <>
      <h5
        className={`text-center mb-1`}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {!backup || backup.NextBackupDate < 1632917143
          ? Interface.i18n.T("Unset")
          : new Date(backup.NextBackupDate * 1000).toLocaleString()}
      </h5>
      <Modal
        show={modalShown}
        className={`${Interface.Theme.GetThemeAndModeClassName()} vmBackupModal`}
        onHide={() => setModalShown(false)}
        backdropClassName={`backdrop-Z-index-1060`}
      >
        <Modal.Header style={{ direction: Interface.i18n.GetLangDirection() }}>
          <Modal.Title style={{ direction: Interface.i18n.GetLangDirection() }}>
            {Interface.i18n.T("Edit Next Backup date and time")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ direction: Interface.i18n.GetLangDirection() }}>
          <p>
            {Interface.i18n.T(
              "You can edit the next backup date and time. but make sure you choose the correct date and time."
            )}
          </p>
          {nextPossibleBackupTimeStamp > 0 ? (
            <p>
              {Interface.i18n.T(
                "The Next Backup Date and Time can only be after"
              )}{" "}
              {Interface.Utils.Time.UnixToDateString(
                nextPossibleBackupTimeStamp
              )}
            </p>
          ) : undefined}
          <div className={`d-flex justify-content-center`}>
            <input
              id={`${backup.Id}_changeNextBackupInput`}
              className="form-control mx-auto"
              placeholder={Interface.i18n.T("Select Date & Time")}
              type={"text"}
              readOnly={true}
              style={{ textAlign: "center", flexGrow: "unset" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"outline-primary"}
            onClick={() => setModalShown(false)}
          >
            {Interface.i18n.T("Cancel")}
          </Button>
          <Button
            variant={"primary"}
            onClick={() => {
              if (nextPossibleBackupTimeStamp) {
                if (
                  nextPossibleBackupTimeStamp >
                  Number(newNextBackupDate.current) / 1000
                ) {
                  Interface.Alert.Show(
                    `${Interface.i18n.T(
                      "The Next Backup Date and Time cannot be before"
                    )} ${Interface.Utils.Time.UnixToDateString(
                      nextPossibleBackupTimeStamp
                    )}`,
                    "error"
                  );
                  return;
                }
              }
              Interface.SendCommand(
                Interface.Commands.SetNextBackupDate,
                {
                  VmBackupId: backup.Id,
                  NextBackupDate: Number(newNextBackupDate.current) / 1000,
                },
                vmDetails.VmRecordId
              );
              setModalShown(false);
              Refresh();
            }}
          >
            {Interface.i18n.T("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VmBackup;
