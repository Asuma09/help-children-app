import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./storage-mock.js";

/**
 * 共通クリック音（カチャッというレトロな効果音）
 */
const playClick = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { }
};

// ボタンなどのクリック時に効果音を鳴らす（全体適用）
if (typeof window !== "undefined") {
    window.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("label") || e.target.closest(".dq-btn")) {
            playClick();
        }
    }, { capture: true });
}

/**
 * Reactアプリのエントリポイント
 * #root 要素に App コンポーネントをマウントする
 */
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
