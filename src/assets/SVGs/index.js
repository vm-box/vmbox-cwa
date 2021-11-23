import React from "react";

function User(props) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width ? props.width : props.size ? props.size : "24"}
        height={props.height ? props.height : props.size ? props.size : "24"}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-user"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </>
  );
}

function Globe(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      // style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="#909090"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z" />
      </g>
    </svg>
  );
}

function XSquare(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-x-square"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="9" x2="15" y2="15"></line>
      <line x1="15" y1="9" x2="9" y2="15"></line>
    </svg>
  );
}

function Maximize(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-maximize-2"
    >
      <polyline points="15 3 21 3 21 9"></polyline>
      <polyline points="9 21 3 21 3 15"></polyline>
      <line x1="21" y1="3" x2="14" y2="10"></line>
      <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
  );
}

function Minus(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-minus"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function Target(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-target"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

function IsoFile(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 56 56"
    >
      <g>
        <path
          style={{ fill: "#E9E9E0" }}
          d="M36.985,0H7.963C7.155,0,6.5,0.655,6.5,1.926V55c0,0.345,0.655,1,1.463,1h40.074   c0.808,0,1.463-0.655,1.463-1V12.978c0-0.696-0.093-0.92-0.257-1.085L37.607,0.257C37.442,0.093,37.218,0,36.985,0z"
        />
        <polygon
          style={{ fill: "#D9D7CA" }}
          points="37.5,0.151 37.5,12 49.349,12  "
        />
        <path
          style={{ fill: "#71C285" }}
          d="M48.037,56H7.963C7.155,56,6.5,55.345,6.5,54.537V39h43v15.537C49.5,55.345,48.845,56,48.037,56z"
        />
        <g>
          <path
            style={{ fill: "#FFFFFF" }}
            d="M20.453,53h-1.668V42.924h1.668V53z"
          />
          <path
            style={{ fill: "#FFFFFF" }}
            d="M28.67,50.238c0,0.364-0.075,0.718-0.226,1.06s-0.362,0.643-0.636,0.902s-0.611,0.467-1.012,0.622    c-0.401,0.155-0.857,0.232-1.367,0.232c-0.219,0-0.444-0.012-0.677-0.034s-0.468-0.062-0.704-0.116    c-0.237-0.055-0.463-0.13-0.677-0.226s-0.399-0.212-0.554-0.349l0.287-1.176c0.127,0.073,0.289,0.144,0.485,0.212    s0.398,0.132,0.608,0.191c0.209,0.06,0.419,0.107,0.629,0.144c0.209,0.036,0.405,0.055,0.588,0.055c0.556,0,0.982-0.13,1.278-0.39    s0.444-0.645,0.444-1.155c0-0.31-0.105-0.574-0.314-0.793c-0.21-0.219-0.472-0.417-0.786-0.595s-0.654-0.355-1.019-0.533    c-0.365-0.178-0.707-0.388-1.025-0.629c-0.319-0.241-0.584-0.526-0.793-0.854c-0.21-0.328-0.314-0.738-0.314-1.23    c0-0.446,0.082-0.843,0.246-1.189s0.385-0.641,0.663-0.882s0.602-0.426,0.971-0.554s0.759-0.191,1.169-0.191    c0.419,0,0.843,0.039,1.271,0.116c0.428,0.077,0.774,0.203,1.039,0.376c-0.055,0.118-0.119,0.248-0.191,0.39    c-0.073,0.142-0.142,0.273-0.205,0.396c-0.064,0.123-0.119,0.226-0.164,0.308c-0.046,0.082-0.073,0.128-0.082,0.137    c-0.055-0.027-0.116-0.063-0.185-0.109s-0.167-0.091-0.294-0.137c-0.128-0.046-0.297-0.077-0.506-0.096    c-0.21-0.019-0.479-0.014-0.807,0.014c-0.183,0.019-0.355,0.07-0.52,0.157s-0.311,0.193-0.438,0.321    c-0.128,0.128-0.229,0.271-0.301,0.431c-0.073,0.159-0.109,0.313-0.109,0.458c0,0.364,0.104,0.658,0.314,0.882    c0.209,0.224,0.469,0.419,0.779,0.588c0.31,0.169,0.646,0.333,1.012,0.492c0.364,0.159,0.704,0.354,1.019,0.581    s0.576,0.513,0.786,0.854C28.564,49.261,28.67,49.7,28.67,50.238z"
          />
          <path
            style={{ fill: "#FFFFFF" }}
            d="M38.568,47.914c0,0.848-0.107,1.595-0.321,2.242s-0.511,1.185-0.889,1.613s-0.82,0.752-1.326,0.971    s-1.06,0.328-1.661,0.328s-1.155-0.109-1.661-0.328s-0.948-0.542-1.326-0.971s-0.675-0.966-0.889-1.613s-0.321-1.395-0.321-2.242    s0.107-1.593,0.321-2.235s0.511-1.178,0.889-1.606s0.82-0.754,1.326-0.978s1.06-0.335,1.661-0.335s1.155,0.111,1.661,0.335    s0.948,0.549,1.326,0.978s0.675,0.964,0.889,1.606S38.568,47.066,38.568,47.914z M34.33,51.729c0.337,0,0.658-0.066,0.964-0.198    s0.579-0.349,0.82-0.649s0.431-0.695,0.567-1.183s0.209-1.082,0.219-1.784c-0.01-0.684-0.08-1.265-0.212-1.743    s-0.314-0.873-0.547-1.183s-0.497-0.533-0.793-0.67s-0.608-0.205-0.937-0.205c-0.338,0-0.658,0.063-0.964,0.191    s-0.579,0.344-0.82,0.649s-0.431,0.699-0.567,1.183s-0.21,1.075-0.219,1.777c0.009,0.684,0.08,1.267,0.212,1.75    s0.314,0.877,0.547,1.183s0.497,0.528,0.793,0.67S34.002,51.729,34.33,51.729z"
          />
        </g>
        <circle style={{ fill: "#C8BDB8" }} cx="27.5" cy="21" r="12" />
        <circle style={{ fill: "#E9E9E0" }} cx="27.5" cy="21" r="3" />
        <path
          style={{ fill: "#D3CCC9" }}
          d="M25.379,18.879c0.132-0.132,0.276-0.245,0.425-0.347l-2.361-8.813   c-1.615,0.579-3.134,1.503-4.427,2.796c-1.294,1.293-2.217,2.812-2.796,4.427l8.813,2.361   C25.134,19.155,25.247,19.011,25.379,18.879z"
        />
        <path
          style={{ fill: "#D3CCC9" }}
          d="M30.071,23.486l2.273,8.483c1.32-0.582,2.56-1.402,3.641-2.484c1.253-1.253,2.16-2.717,2.743-4.275   l-8.188-2.194C30.255,22.939,29.994,23.2,30.071,23.486z"
        />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
}

function Monitor(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );
}

function Pause(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );
}

function Power(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
  );
}

function Play(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
}

function Repeat(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
  );
}

function CPU(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="css-i6dzq1"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>
  );
}

function RAM(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      x="0px"
      y="0px"
      viewBox="0 0 299.92 299.92"
    >
      <g>
        <g>
          <g>
            <path d="M293.4,65.2H6.52C2.914,65.2,0,68.114,0,71.72v117.36c0,3.606,2.914,6.52,6.52,6.52h6.52v32.6     c0,3.606,2.914,6.52,6.52,6.52h260.8c3.606,0,6.52-2.914,6.52-6.52v-32.6h6.52c3.606,0,6.52-2.914,6.52-6.52V71.72     C299.92,68.114,297.006,65.2,293.4,65.2z M273.84,221.68h-19.56H228.2h-26.08h-26.08h-26.08h-26.08H97.8H71.72H45.64H26.08V195.6     h19.56h26.08H97.8h26.08h26.08h26.08h26.08h26.08h26.08h19.56V221.68z M286.88,182.56h-6.52H19.56h-6.52V78.24h273.84V182.56z" />
            <path d="M32.6,169.52h39.12c3.606,0,6.52-2.914,6.52-6.52V97.8c0-3.606-2.914-6.52-6.52-6.52H32.6c-3.606,0-6.52,2.914-6.52,6.52     V163C26.08,166.606,28.994,169.52,32.6,169.52z M39.12,104.32H65.2v52.16H39.12V104.32z" />
            <path d="M97.8,169.52h39.12c3.606,0,6.52-2.914,6.52-6.52V97.8c0-3.606-2.914-6.52-6.52-6.52H97.8c-3.606,0-6.52,2.914-6.52,6.52     V163C91.28,166.606,94.194,169.52,97.8,169.52z M104.32,104.32h26.08v52.16h-26.08V104.32z" />
            <path d="M163,169.52h39.12c3.606,0,6.52-2.914,6.52-6.52V97.8c0-3.606-2.914-6.52-6.52-6.52H163c-3.606,0-6.52,2.914-6.52,6.52     V163C156.48,166.606,159.394,169.52,163,169.52z M169.52,104.32h26.08v52.16h-26.08V104.32z" />
            <path d="M228.2,169.52h39.12c3.606,0,6.52-2.914,6.52-6.52V97.8c0-3.606-2.914-6.52-6.52-6.52H228.2     c-3.606,0-6.52,2.914-6.52,6.52V163C221.68,166.606,224.594,169.52,228.2,169.52z M234.72,104.32h26.08v52.16h-26.08V104.32z" />
            <path d="M52.16,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C49.246,221.68,52.16,218.766,52.16,215.16z" />
            <path d="M78.24,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C75.326,221.68,78.24,218.766,78.24,215.16z" />
            <path d="M104.32,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C101.406,221.68,104.32,218.766,104.32,215.16z" />
            <path d="M130.4,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C127.486,221.68,130.4,218.766,130.4,215.16z" />
            <path d="M156.48,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52s-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     S156.48,218.766,156.48,215.16z" />
            <path d="M182.56,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C179.646,221.68,182.56,218.766,182.56,215.16z" />
            <path d="M208.64,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C205.726,221.68,208.64,218.766,208.64,215.16z" />
            <path d="M234.72,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C231.806,221.68,234.72,218.766,234.72,215.16z" />
            <path d="M260.8,215.16v-13.04c0-3.606-2.914-6.52-6.52-6.52c-3.606,0-6.52,2.914-6.52,6.52v13.04c0,3.606,2.914,6.52,6.52,6.52     C257.886,221.68,260.8,218.766,260.8,215.16z" />
          </g>
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
}

function Database(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="css-i6dzq1"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
}

function UploadCloud(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-upload-cloud"
      {...props}
    >
      <polyline points="16 16 12 12 8 16"></polyline>
      <line x1="12" y1="12" x2="12" y2="21"></line>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
      <polyline points="16 16 12 12 8 16"></polyline>
    </svg>
  );
}

function Calendar(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-calendar"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function CircleAdd(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-plus-circle"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function RecycleBin(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : props.size ? props.size : "24"}
      height={props.height ? props.height : props.size ? props.size : "24"}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-trash-2"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

export default {
  User,
  Globe,
  XSquare,
  Maximize,
  Minus,
  Target,
  IsoFile,
  Monitor,
  Pause,
  Power,
  Play,
  Repeat,
  CPU,
  RAM,
  Database,
  UploadCloud,
  Calendar,
  CircleAdd,
  RecycleBin,
};
