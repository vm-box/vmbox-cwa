import React from "react";
import { Button } from "react-bootstrap";
import Interface from "../../../Interface";
import Finish from "./Finish";
import SelectBackupPlan from "./SelectBackupPlan";
import SelectSourceBackup from "./SelectSourceBackup";

function RestoreBackup(props) {
  const { vm, backup, CloseMainBackupModal, Refresh } = props;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [selectedBackupPlanId, setSelectedBackupPlanId] = React.useState(
    backup.Id
  );
  const [selectedSourceBackup, setSelectedSourceBackup] = React.useState(false);
  const [restoreOptions, setRestoreOptions] = React.useState({
    PowerOnAfterRestore: false,
  });

  return (
    <>
      {stepIndex === 0 ? (
        <SelectBackupPlan
          vm={vm}
          backup={backup}
          selectedBackupPlanId={selectedBackupPlanId}
          setSelectedBackupPlanId={(backupId) =>
            setSelectedBackupPlanId(backupId)
          }
        />
      ) : stepIndex === 1 ? (
        <SelectSourceBackup
          vm={vm}
          backup={backup}
          selectedBackupPlanId={selectedBackupPlanId}
          selectedSourceBackup={selectedSourceBackup}
          setSelectedSourceBackup={(backupId) =>
            setSelectedSourceBackup(backupId)
          }
        />
      ) : stepIndex === 2 ? (
        <Finish
          vm={vm}
          backup={backup}
          selectedBackupPlanId={selectedBackupPlanId}
          selectedSourceBackup={selectedSourceBackup}
          restoreOptions={restoreOptions}
          setRestoreOptions={(opts) => setRestoreOptions(opts)}
        />
      ) : undefined}
      <div className={`d-flex justify-content-center`}>
        {stepIndex > 0 ? (
          <Button
            className={`mx-1`}
            variant={"outline-primary"}
            onClick={() => setStepIndex(stepIndex - 1)}
          >
            {Interface.i18n.T("Previous")}
          </Button>
        ) : undefined}
        {stepIndex < 2 ? (
          <Button
            className={`mx-1`}
            variant={"primary"}
            onClick={() => {
              if (stepIndex === 1 && !selectedSourceBackup) {
                Interface.Alert.Show("Please select a Backup first", "error");
                return;
              }
              setStepIndex(stepIndex + 1);
            }}
          >
            {Interface.i18n.T("Next")}
          </Button>
        ) : undefined}
        {stepIndex === 2 ? (
          <Button
            className={`mx-1`}
            variant={"primary"}
            onClick={() => {
              Interface.SendCommand(
                Interface.Commands.RestoreBackup,
                {
                  VmBackupId: selectedBackupPlanId,
                  PowerOnAfterRestore: !!restoreOptions.PowerOnAfterRestore,
                  BackupType: selectedSourceBackup.BackupType,
                  Origin: selectedSourceBackup.Origin,
                  TimeStamp: selectedSourceBackup.TimeStamp,
                },
                vm.VmRecordId
              );
              Refresh();
              CloseMainBackupModal();
            }}
          >
            {Interface.i18n.T("Finish")}
          </Button>
        ) : undefined}
      </div>
    </>
  );
}

export default RestoreBackup;
