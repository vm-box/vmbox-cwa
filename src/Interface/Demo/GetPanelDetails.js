function GetPanelDetails(wsObj, message) {
  var VmRecordId = message.VmRecordId;
  var messages = [
    {
      type: "SetAllMachines",
      data: JSON.stringify([
        {
          Id: "3",
          Hostname: "MetricMolly",
          IpAddress: "144.163.74.162",
        },
        {
          Id: "4",
          Hostname: "DangerousDzo",
          IpAddress: "144.163.74.161",
        },
      ]),
    },
    {
      type: "SetCustomerDetails",
      data: JSON.stringify({
        FirstName: "John",
        LastName: "Doe",
        Email: "john@doe.com",
        IsPersistent: true,
        Sessions: null,
      }),
    },
  ];
  if (VmRecordId === "3") {
    messages.push({
      type: "SetPanelDetails",
      data: JSON.stringify({
        VmRecordId: "3",
        Status: getVmState(VmRecordId),
        Actions: getVmActions(VmRecordId),
        IsSuspended: false,
        IpAddress: "144.163.74.162",
        OsPassword: "T1gxt2oj",
        OsType: "Windows",
        TemplateName: "Windows Server 2019",
        Hostname: "MetricMolly.vm-box.com",
        MaxCpuUsage: 10797,
        CpuSockets: 1,
        CpuCores: 8,
        MaxMemoryUsage: 8192,
        AllocatedMemory: 12288,
        MaxDiskUsage: 40960,
        GuestMemoryUsage: 6314,
        OverallCpuUsage: 6320,
        UptimeSeconds: 684661,
      }),
    });
  } else if (VmRecordId === "4" || true) {
    messages.push({
      type: "SetPanelDetails",
      data: JSON.stringify({
        VmRecordId: "4",
        Status: getVmState(VmRecordId),
        Actions: getVmActions(VmRecordId),
        IsSuspended: false,
        IpAddress: "144.163.74.161",
        OsPassword: "x2tTjg1o",
        OsType: "Debian8",
        TemplateName: "Debian 10",
        Hostname: "DangerousDzo.vm-box.com",
        MaxCpuUsage: 20797,
        CpuSockets: 2,
        CpuCores: 6,
        MaxMemoryUsage: 24000,
        AllocatedMemory: 24000,
        MaxDiskUsage: 102400,
        GuestMemoryUsage: 18604,
        OverallCpuUsage: 12603,
        UptimeSeconds: 547813,
      }),
    });
  }
  setTimeout(() => {
    wsObj.onmessage({
      data: JSON.stringify(messages),
    });
  }, 350);
}

function getVmState(vmRecordId) {
  if (!window.VmState || !window.VmState[`${vmRecordId}`]) return "PoweredOn";
  return `${window.VmState[`${vmRecordId}`]}`;
}
function getVmActions(vmRecordId) {
  var state = getVmState(vmRecordId);
  switch (state) {
    case "PoweredOn":
      return ["VmSuspend", "PowerOff", "PowerReset"];
    case "PoweredOff":
      return ["PowerOn"];
    case "VmSuspended":
      return ["PowerOff", "PowerOn"];
    default:
      return [];
  }
}

export default GetPanelDetails;
