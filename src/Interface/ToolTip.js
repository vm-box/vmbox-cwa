import React from "react";
import { Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";

function ToolTip(props) {
  const { title, children } = props;

  const [shown, setShown] = React.useState(false);
  const target = React.useRef();

  return (
    <>
      <span {...props} ref={target}>
        {children}
      </span>
      <Overlay target={target.current} show={shown} placement={"bottom"}>
        <Tooltip placement={"bottom"}>{title}</Tooltip>
      </Overlay>
    </>
  );
}

export default ToolTip;
