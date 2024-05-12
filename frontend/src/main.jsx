import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./data/Context.jsx";
import Routes from "./Routes.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </ContextProvider>
    </React.StrictMode>
);
