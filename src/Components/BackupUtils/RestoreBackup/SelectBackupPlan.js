import React from "react";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";
import Loader from "../../Loader";

function SelectBackupPlan(props) {
  const { vm, backup, selectedBackupPlanId, setSelectedBackupPlanId } = props;

  const reloadVmBackupTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [restoreBackups, setRestoreBackups] = React.useState();
  const [refreshT, refresh] = React.useState(false);

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetRestoreBackups,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vm.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        if (`${parsedData.VmBackupId}` !== `${backup.Id}`) return;
        setRestoreBackups(parsedData);
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
      Interface.Commands.GetRestoreBackups,
      backup.Id,
      vm.VmRecordId
    );
  }, [refreshT]);

  return (
    <>
      <h5
        className={`mt-3 mb-3 my-1`}
        style={{ direction: Interface.i18n.GetLangDirection() }}
      >
        {Interface.i18n.T("Select a Backup Plan")}:
      </h5>
      {restoreBackups ? (
        restoreBackups.VMs && restoreBackups.VMs.length > 0 ? (
          restoreBackups.VMs.map((VM, i) => (
            <div key={i}>
              {VM.Backups && VM.Backups.length > 0 ? (
                <>
                  <h6 className={`mt-2 my-1`}>{VM.VmHostName}:</h6>
                  <div
                    className={`d-flex justify-content-center mx-2 mb-3`}
                    style={{ flexWrap: "wrap" }}
                  >
                    {VM.Backups.map((Backup, bI) => (
                      <div
                        key={bI}
                        className={`py-2 px-3 m-1 text-center`}
                        style={{
                          cursor: "pointer",
                          borderRadius: "5px",
                          border:
                            Backup.Id === selectedBackupPlanId
                              ? "2px solid grey"
                              : "2px dashed grey",
                        }}
                        onClick={() => setSelectedBackupPlanId(Backup.Id)}
                      >
                        <span className={`mb-2`} style={{ fontSize: "1.1rem" }}>
                          {Backup.Name}
                        </span>
                        <p
                          className={`mt-1 text-center`}
                          style={{ fontSize: "0.7rem", marginBottom: "0" }}
                        >
                          <b>{Interface.i18n.T("Last Backup Date")}:</b>
                          <br />
                          {Interface.Utils.Time.UnixToDateString(
                            Backup.LastBackupDate
                          )}
                        </p>
                        <p
                          className={`mt-1 text-center`}
                          style={{ fontSize: "0.7rem", marginBottom: "0" }}
                        >
                          <b>{Interface.i18n.T("Backup Count")}:</b>
                          <br />
                          {Backup.BackupCount}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : undefined}
            </div>
          ))
        ) : (
          <h6 className={`text-center`}>{Interface.i18n.T("No VMs found!")}</h6>
        )
      ) : (
        <div className={`d-flex justify-content-center my-2 mb-4`}>
          <Loader />
        </div>
      )}
    </>
  );
}

export default SelectBackupPlan;
