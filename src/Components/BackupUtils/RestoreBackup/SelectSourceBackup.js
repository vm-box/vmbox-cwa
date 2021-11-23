import React from "react";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";
import Loader from "../../Loader";

function SelectSourceBackup(props) {
  const {
    vm,
    backup,
    selectedBackupPlanId,
    selectedSourceBackup,
    setSelectedSourceBackup,
  } = props;

  const reloadVmBackupTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [backupRestores, setBackupRestores] = React.useState();
  const [refreshT, refresh] = React.useState(false);

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetBackupRestores,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vm.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        if (`${parsedData.VmBackupId}` !== `${selectedBackupPlanId}`) return;
        if (parsedData.Error !== "") {
          Interface.Alert.Show(parsedData.Error, "error");
        }
        setBackupRestores(
          parsedData.BackupRestores && parsedData.BackupRestores.length
            ? parsedData.BackupRestores
            : []
        );
      }
    );
    return () => {
      if (reloadVmBackupTimeout.current) {
        clearTimeout(reloadVmBackupTimeout.current);
      }
      unmountedFlag.current = true;
    };
  }, []);

  React.useEffect(() => {
    Interface.SendCommand(
      Interface.Commands.GetBackupRestores,
      selectedBackupPlanId,
      vm.VmRecordId
    );
  }, [refreshT]);

  var sortedBackupRestores = null;
  if (backupRestores) {
    sortedBackupRestores = backupRestores.sort((a, b) =>
      a.TimeStamp > b.TimeStamp ? 1 : a.TimeStamp === b.TimeStamp ? 0 : -1
    );
  }

  return (
    <>
      <h5
        className={`mt-3 mb-3 my-1`}
        style={{ direction: Interface.i18n.GetLangDirection() }}
      >
        {Interface.i18n.T("Select a Backup to restore")}:
      </h5>
      {sortedBackupRestores ? (
        sortedBackupRestores.length > 0 ? (
          <div
            className={`d-flex justify-content-center mx-2 mb-3`}
            style={{ flexWrap: "wrap" }}
          >
            {sortedBackupRestores.map((backupFile, i) => (
              <div
                key={i}
                className={`py-2 px-3 m-1 text-center`}
                style={{
                  cursor: "pointer",
                  borderRadius: "5px",
                  border:
                    backupFile === selectedSourceBackup
                      ? "2px solid grey"
                      : "2px dashed grey",
                }}
                onClick={() => setSelectedSourceBackup(backupFile)}
              >
                <Interface.ToolTip
                  title={`${new Date(
                    backupFile.TimeStamp * 1000
                  ).toUTCString()}`}
                >
                  <span className={`mb-2`} style={{ fontSize: "1.1rem" }}>
                    {Interface.Utils.Time.UnixToDateString(
                      backupFile.TimeStamp
                    )}
                  </span>
                </Interface.ToolTip>
                <p
                  className={`mt-1 text-center`}
                  style={{ fontSize: "0.7rem", marginBottom: "0" }}
                >
                  <b>{Interface.i18n.T("Type")}:</b>
                  <br />
                  {backupFile.BackupType}
                </p>
                <p
                  className={`mt-1 text-center`}
                  style={{ fontSize: "0.7rem", marginBottom: "0" }}
                >
                  <b>{Interface.i18n.T("Source")}:</b>
                  <br />
                  {backupFile.Origin}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <h6 className={`text-center`}>
            {Interface.i18n.T("No Backups found")}
          </h6>
        )
      ) : (
        <div className={`d-flex justify-content-center my-2 mb-4`}>
          <Loader />
        </div>
      )}
    </>
  );
}

export default SelectSourceBackup;
