import { useState } from "react";
import { css, DQ } from "./constants";
import Login from "./components/Login.jsx";
import Parent from "./components/Parent.jsx";
import Child from "./components/Child.jsx";

/**
 * アプリのルートコンポーネント
 * セッション（ログイン状態）に応じて Login / Parent / Child を切り替える
 */
export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("__habit__") || "null"); } catch { return null; }
  });

  const save = (s) => {
    setSession(s);
    s ? localStorage.setItem("__habit__", JSON.stringify(s)) : localStorage.removeItem("__habit__");
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: DQ.bg, fontFamily: "'DotGothic16', monospace" }}>
        {!session && <Login onLogin={save} />}
        {session?.role === "parent" && <Parent session={session} onLogout={() => save(null)} />}
        {session?.role === "child" && <Child session={session} onLogout={() => save(null)} />}
      </div>
    </>
  );
}
