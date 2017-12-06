import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Blueprint from "@blueprintjs/core";
import '../node_modules/@blueprintjs/core/dist/blueprint.css';
import './assets/css/normalize.css';
import App from "./components/app";

ReactDOM.render(
    <App />,
    document.getElementById("root")
);