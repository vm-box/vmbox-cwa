function GetPlanTemplates(wsObj, message) {
  var VmRecordId = message.VmRecordId;
  var messages = [];
  messages.push({
    type: "SetPlanTemplates",
    vmRecordId: VmRecordId,
    data: JSON.stringify([
      { Id: "65", Name: "Windows Server 2019", OsType: "Windows" },
      { Id: "66", Name: "Windows Server 2016", OsType: "Windows" },
      { Id: "67", Name: "Ubuntu Server 20.04", OsType: "Ubuntu18" },
      { Id: "68", Name: "Ubuntu Server 18.04", OsType: "Ubuntu18" },
      { Id: "69", Name: "Debian 10.6", OsType: "Debian8" },
      { Id: "70", Name: "Debian 8.11", OsType: "Debian8" },
      { Id: "71", Name: "CentOS 8", OsType: "CentOs7" },
      { Id: "72", Name: "CentOS 7", OsType: "CentOs7" },
    ]),
  });
  setTimeout(() => {
    wsObj.onmessage({
      data: JSON.stringify(messages),
    });
  }, 350);
}

export default GetPlanTemplates;
