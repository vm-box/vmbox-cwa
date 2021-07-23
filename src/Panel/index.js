import React from "react";
import Interface from "../Interface";
import MessageHandler from "../Interface/MessageHandler";

function Panel(props) {
  React.useEffect(() => {
    window.Interface = Interface;

    MessageHandler.On(MessageHandler.MessageTypes.SetPanelDetails, (data) => {
      data = JSON.parse(data);
      console.log(data);
      setTimeout(
        () => Interface.SendCommand(Interface.Commands.GetPanelDetails),
        5000
      );
    });
  }, []);

  return <></>;
}

export default Panel;
