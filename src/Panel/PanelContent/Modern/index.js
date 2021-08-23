import React from "react";
import { Container } from "react-bootstrap";
import StaticContent from "./StaticContent";
import MainContainer from "./MainContainer";

function ModernPanelContent(props) {
  const { vmDetails, dNone } = props;

  const [modernMainPanelDisplayNone, setModernMainPanelDisplayNone] =
    React.useState(false);
  const [top, setTop] = React.useState(1);
  const staticRect = React.useRef(0);
  const containerRef = React.useRef();
  const staticContainerRef = React.useRef();

  React.useEffect(() => {
    const onScroll = () => {
      if (containerRef.current && window.$("body").width() > 766) {
        if (staticContainerRef.current) {
          staticRect.current = staticContainerRef.current.getClientRects()[0];
        }
        setTop(containerRef.current.getClientRects()[0].top);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Container
        fluid
        className={`d-flex justify-content-center align-items-start mt-4 px-5`}
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
        }}
      >
        <div className={`w-100`} ref={containerRef}></div>
        <div
          ref={staticContainerRef}
          className={top > 0 ? `col-xs-12 col-md-4 col-lg-3` : ""}
          style={
            top > 0
              ? {}
              : {
                  position: "fixed",
                  left: staticRect.current.left,
                  width: staticRect.current.width,
                  top: "0",
                }
          }
        >
          <StaticContent
            vmDetails={vmDetails}
            mainPanelDisPlayNone={modernMainPanelDisplayNone}
            setMainPanelDisPlayNone={(e) => setModernMainPanelDisplayNone(e)}
          />
        </div>
        {top < 0 ? (
          <div className={`col-xs-12 col-md-4 col-lg-3`}></div>
        ) : undefined}
        <div className={`col-xs-12 col-md-8 col-lg-9`}>
          <MainContainer
            vmDetails={vmDetails}
            dNone={dNone || modernMainPanelDisplayNone}
          />
        </div>
      </Container>
    </>
  );
}

export default ModernPanelContent;
