import SendAction from "./SendAction";

export default (wsObj, message) => {
  var VmRecordId = message.VmRecordId;
  window.VmState[`${VmRecordId}`] = "pending";
  setTimeout(() => {
    wsObj.onmessage({
      data: JSON.stringify([{ type: "Reload" }]),
    });
    SendAction(wsObj, message, message.Type, [
      {
        name: "Prepairing",
        percentage: 20,
        done: false,
      },
      {
        name: "PoweringOff",
        percentage: 0,
        done: false,
      },
    ]);
    setTimeout(() => {
      SendAction(wsObj, message, message.Type, [
        {
          name: "Prepairing",
          percentage: 100,
          done: true,
        },
        {
          name: "PoweringOff",
          percentage: 20,
          done: false,
        },
      ]);
      setTimeout(() => {
        SendAction(wsObj, message, message.Type, [
          {
            name: "Prepairing",
            percentage: 100,
            done: true,
          },
          {
            name: "PoweringOff",
            percentage: 60,
            done: false,
          },
        ]);
        window.VmState[`${VmRecordId}`] = "PoweredOff";
        setTimeout(() => {
          SendAction(wsObj, message, message.Type, [
            {
              name: "Prepairing",
              percentage: 100,
              done: true,
            },
            {
              name: "PoweringOff",
              percentage: 100,
              done: true,
            },
          ]);
          setTimeout(() => {
            wsObj.onmessage({
              data: JSON.stringify([{ type: "Reload" }]),
            });
          }, 50);
        }, 300);
      }, 800);
    }, 500);
  }, 20);
};
