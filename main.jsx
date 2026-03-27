import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./storage-mock.js";

/**
 * Reactアプリのエントリポイント
 * #root 要素に App コンポーネントをマウントする
 */
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
