import React from "react";
import Interface from "../../../Interface";
import { ButtonGroup, Button, DropdownButton, Dropdown } from "react-bootstrap";
import MessageHandler from "../../../Interface/MessageHandler";
import ApexCharts from "apexcharts";
import Loader from "../../../Components/Loader";

function Monitor(props) {
  const { vmDetails } = props;

  const [graphType, setGraphType] = React.useState("cpu"); // cpu or ram
  const graphTypeObj = React.useRef("cpu");
  const [timeSpan, setTimeSpan] = React.useState("RealTime");
  const timeSpanObj = React.useRef("RealTime");
  const [loading, setLoading] = React.useState(false);
  const reloadMonitorTimeout = React.useRef();
  const cpuChart = React.useRef();
  const ramChart = React.useRef();
  const performanceChart = React.useRef();

  graphTypeObj.current = graphType;
  timeSpanObj.current = timeSpan;

  const getMonitoringData = () => {
    Interface.SendCommand(
      Interface.Commands.GetMonitoringData,
      `${graphTypeObj.current}:${timeSpanObj.current}`,
      vmDetails.VmRecordId
    );
  };

  React.useEffect(() => {
    MessageHandler.On(
      MessageHandler.MessageTypes.SetMonitoringData,
      (data, vmRecordId) => {
        if (`${vmRecordId}` !== `${vmDetails.VmRecordId}`) return;
        if (graphTypeObj.current === "unmounted") return;
        var parsedData = JSON.parse(data);
        if (cpuChart.current) {
          cpuChart.current.updateOptions(
            getGaugeBarOptions(
              "CPU Usage",
              parsedData.OverallCpuUsage * 1024,
              parsedData.MaxCpuUsage * 1024,
              "Hz"
            )
          );
        }
        if (ramChart.current) {
          var maxMem = parsedData.MaxMemoryUsage;
          if (
            window.Defaults &&
            window.Defaults.ModernPanel &&
            window.Defaults.ModernPanel.Monitoring &&
            window.Defaults.ModernPanel.Monitoring.UseAllocatedMemory
          ) {
            maxMem = vmDetails.AllocatedMemory;
          }
          ramChart.current.updateOptions(
            getGaugeBarOptions(
              "RAM Usage",
              parsedData.GuestMemoryUsage * 1024,
              maxMem * 1024,
              "B"
            )
          );
        }
        var pTt = parsedData.PerformanceType.split(":");
        var pType = pTt[0];
        var pTimeSpan = pTt.length > 1 ? pTt[1] : timeSpanObj.current;
        if (
          performanceChart.current &&
          pType.toLowerCase() === graphTypeObj.current.toLowerCase() &&
          pTimeSpan.toLowerCase() === timeSpanObj.current.toLowerCase()
        ) {
          var name = graphType;
          var title = graphType;

          if (pType.includes("cpu")) {
            name = "CPU Usage";
            title = "CPU Usage";
          } else if (pType.includes("ram")) {
            name = "RAM Usage";
            title = "RAM Usage";
          }
          performanceChart.current.updateOptions(
            getLineGraphOptions(name, parsedData.Performance, title)
          );
          setLoading(false);
        }
        if (reloadMonitorTimeout.current)
          clearTimeout(reloadMonitorTimeout.current);
        reloadMonitorTimeout.current = setTimeout(
          () => getMonitoringData(),
          5000
        );
      }
    );

    cpuChart.current = new ApexCharts(
      document.getElementById(
        `cpuChart_${vmDetails ? vmDetails.VmRecordId : "0"}`
      ),
      getGaugeBarOptions("CPU Usage", 0, 0, "Hz")
    );
    cpuChart.current.render();
    ramChart.current = new ApexCharts(
      document.getElementById(
        `ramChart_${vmDetails ? vmDetails.VmRecordId : "0"}`
      ),
      getGaugeBarOptions("RAM Usage", 0, 0, "B")
    );
    ramChart.current.render();
    performanceChart.current = new ApexCharts(
      document.getElementById(
        `performanceChart_${vmDetails ? vmDetails.VmRecordId : "0"}`
      ),
      getLineGraphOptions("CPU", null, "CPU")
    );
    performanceChart.current.render();
    return () => {
      if (reloadMonitorTimeout.current) {
        clearTimeout(reloadMonitorTimeout.current);
      }
      graphTypeObj.current = "unmounted";
    };
  }, []);

  React.useEffect(() => {
    if (reloadMonitorTimeout.current) {
      clearTimeout(reloadMonitorTimeout.current);
    }
    if (vmDetails.Status === "PoweredOn") {
      setLoading(true);
    }
    getMonitoringData();
  }, [graphType, timeSpan]);

  const setNewTimespan = (newTimeSpan) => {
    if (timeSpan !== newTimeSpan) setTimeSpan(newTimeSpan);
  };

  return (
    <div className={`modernMainPanelCard p-3 mb-5`}>
      <div className={`d-flex justify-content-center row`}>
        <div className={`col-xs-12 col-md-6 col-lg-5`}>
          <div id={`cpuChart_${vmDetails ? vmDetails.VmRecordId : "0"}`}></div>
        </div>
        <div className={`col-xs-12 col-md-6 col-lg-5`}>
          <div id={`ramChart_${vmDetails ? vmDetails.VmRecordId : "0"}`}></div>
        </div>
      </div>
      <div
        className={`d-flex justify-content-center ${
          vmDetails.Status !== "PoweredOn" && vmDetails.Status !== "pending"
            ? "d-none"
            : ""
        }`}
      >
        {loading ? (
          <>
            <Loader flat />
          </>
        ) : (
          <>
            <ButtonGroup>
              <Button
                variant={graphType === "cpu" ? "primary" : "outline-primary"}
                onClick={() => {
                  if (graphType !== "cpu") setGraphType("cpu");
                }}
              >
                CPU
              </Button>
              <Button
                variant={graphType === "ram" ? "primary" : "outline-primary"}
                onClick={() => {
                  if (graphType !== "ram") setGraphType("ram");
                }}
              >
                RAM
              </Button>
              <DropdownButton
                as={ButtonGroup}
                variant={"outline-primary"}
                title={Interface.i18n.T(timeSpan)}
              >
                <Dropdown.Item onClick={() => setNewTimespan("RealTime")}>
                  {Interface.i18n.T("Real-time")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setNewTimespan("LastDay")}>
                  {Interface.i18n.T("Last Day")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setNewTimespan("LastWeek")}>
                  {Interface.i18n.T("Last week")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setNewTimespan("LastMonth")}>
                  {Interface.i18n.T("Last month")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setNewTimespan("LastYear")}>
                  {Interface.i18n.T("Last year")}
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </>
        )}
      </div>
      <div
        className={`my-4 py-3 ${
          vmDetails.Status !== "PoweredOn" && vmDetails.Status !== "pending"
            ? "d-none"
            : ""
        }`}
        id={`performanceChart_${vmDetails ? vmDetails.VmRecordId : "0"}`}
      ></div>
    </div>
  );
}

function getGaugeBarOptions(name, value, from, suffix) {
  var format = (val) => {
    val = parseFloat(val);
    if (val > 1024) {
      val = val / 1024;
      if (val > 1024) {
        return (val / 1024).toFixed(2) + " G" + suffix;
      }
      return val.toFixed(2) + " M" + suffix;
    }
    return val.toFixed(2) + " K" + suffix;
  };
  var formatted = format(value) + " / " + format(from);
  return {
    series: [(value / from) * 100],
    chart: {
      height: 280,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val) {
              return formatted;
            },
            color: "#111",
            fontSize: "15px",
            offsetY: 0,
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [name],
  };
}

function getLineGraphOptions(name, data, title) {
  var utcOffset = 1000 * 60 * -1 * new Date().getTimezoneOffset();
  if (data) {
    data.forEach((d) => {
      if (typeof d.x === "number") {
        d.x += utcOffset;
      }
    });
  }
  return {
    series: [
      {
        name: name,
        data: data ? data : [10, 10, 10, 10, 10],
      },
    ],
    theme: {
      mode: window.currentThemeMode.current,
    },
    chart: {
      height: 350,
      type: "line",

      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 500,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "straight",
      curve: "smooth",
      width: 3,
    },
    title: {
      text: title ? title : name,
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm:ss",
      },
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    xaxis: {
      type: "datetime",
      // labels: {
      //   formatter: function (value, timestamp) {
      //     return timestamp; // The formatter function overrides format property
      //   },
      // },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${parseFloat(val).toFixed(2)}%`,
      },
    },
  };
}

export default Monitor;
