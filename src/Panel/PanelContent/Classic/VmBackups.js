import React from "react";
import Interface from "../../../Interface";
import MessageHandler from "../../../Interface/MessageHandler";
import Loader from "../../../Components/Loader";
import VmBackup from "../../../Components/BackupUtils/VmBackup";

function VmBackups(props) {
  const { vmDetails } = props;

  const reloadVmBackupsTimeout = React.useRef();
  const unmountedFlag = React.useRef(false);

  const [vmBackups, setVmBackups] = React.useState();
  const vmBackupsObj = React.useRef(vmBackups);
  vmBackupsObj.current = vmBackups;

  const loadVmBackups = () => {
    Interface.SendCommand(
      Interface.Commands.GetVmBackups,
      "",
      vmDetails.VmRecordId
    );
  };

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetPanelVmBackups,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (unmountedFlag.current) return;
        var parsedData = JSON.parse(data);
        setVmBackups(parsedData ? parsedData : []);
        if (reloadVmBackupsTimeout.current) {
          clearTimeout(reloadVmBackupsTimeout.current);
        }
        reloadVmBackupsTimeout.current = setTimeout(
          () => loadVmBackups(),
          3000
        );
      }
    );
    loadVmBackups();
    return () => {
      if (reloadVmBackupsTimeout.current) {
        clearTimeout(reloadVmBackupsTimeout.current);
      }
      unmountedFlag.current = true;
    };
  }, []);

  return (
    <>
      <div className={`d-flex vmBackupsList`} style={{ flexWrap: "wrap" }}>
        {vmBackups ? (
          vmBackups.length > 0 ? (
            vmBackups.map((b, i) => (
              <VmBackup
                key={i}
                vmDetails={vmDetails}
                vmBackup={b}
                Refresh={() => loadVmBackups()}
              />
            ))
          ) : (
            <div className={`text-center w-100 py-4`}>
              {Interface.i18n.T("No Backup Plans found")}
            </div>
          )
        ) : (
          <Loader style={{ margin: "1rem auto" }} />
        )}
      </div>
    </>
  );
}

export default VmBackups;
