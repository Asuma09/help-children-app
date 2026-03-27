import { useState } from "react";
import { store } from "../store";
import { LoginCard } from "./ui.jsx";
import { DQ } from "../constants";

/**
 * ログイン / 新規登録画面コンポーネント — ドラクエ風
 */
export default function Login({ onLogin }) {
    const [step, setStep] = useState("choose");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pass, setPass] = useState("");
    const [isParent, setIsParent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const goTo = (s) => {
        setEmail(""); setPassword(""); setPass("");
        setIsParent(false); setErr(""); setStep(s);
    };

    const validate = () => {
        if (!email.trim()) { setErr("メールアドレスを いれてくれ"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("メールアドレスが ただしくないぞ"); return false; }
        if (!password.trim()) { setErr("パスワードを いれてくれ"); return false; }
        if (!pass.trim()) { setErr("あいことばを いれてくれ"); return false; }
        return true;
    };

    const register = async () => {
        if (!validate()) return;
        setLoading(true); setErr("");
        try {
            const familyId = await store.registerUser(email.trim(), password.trim(), pass.trim());
            onLogin({ familyId, role: "parent" });
        } catch (e) { setErr(e?.message || "なにかが おかしい"); }
        setLoading(false);
    };

    const login = async () => {
        if (!validate()) return;
        setLoading(true); setErr("");
        try {
            const familyId = await store.loginUser(email.trim(), password.trim(), pass.trim());
            onLogin({ familyId, role: isParent ? "parent" : "child" });
        } catch (e) { setErr(e?.message || "なにかが おかしい"); }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: 24,
            background: DQ.bg,
        }}>
            {/* === 冒険の入口 === */}
            {step === "choose" && (
                <LoginCard>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: 48, animation: "torch 3s ease-in-out infinite" }}>🏰</div>
                        <h1 style={{
                            fontSize: 22, fontWeight: 700,
                            color: DQ.gold, marginTop: 12,
                            textShadow: "0 0 10px rgba(255,215,0,0.4)",
                        }}>
                            ぼうけんのしょ
                        </h1>
                        <p style={{ color: DQ.dim, fontSize: 13, marginTop: 8 }}>
                            どうする？
                        </p>
                    </div>
                    <button className="dq-btn bounce" onClick={() => goTo("register")}
                        style={{ width: "100%", marginBottom: 10, fontSize: 16, fontWeight: 700 }}>
                        📜 あたらしく ぼうけんをはじめる
                    </button>
                    <button className="dq-btn bounce" onClick={() => goTo("login")}
                        style={{ width: "100%", fontSize: 16, fontWeight: 700 }}>
                        📖 ぼうけんのしょを ひらく
                    </button>
                </LoginCard>
            )}

            {/* === 新規登録 === */}
            {step === "register" && (
                <LoginCard>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 40 }}>📜</div>
                        <h1 style={{
                            fontSize: 20, fontWeight: 700,
                            color: DQ.gold, marginTop: 8,
                            textShadow: "0 0 8px rgba(255,215,0,0.3)",
                        }}>
                            ぼうけんのしょを つくる
                        </h1>
                        <p style={{ color: DQ.dim, fontSize: 12, marginTop: 6 }}>
                            おうちのひとが とうろくしてくれ
                        </p>
                    </div>
                    <input className="dq-input" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="メールアドレス" type="email" />
                    <input className="dq-input" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="パスワード" type="password" />
                    <input className="dq-input" value={pass} onChange={e => setPass(e.target.value)}
                        placeholder="あいことば" onKeyDown={e => e.key === "Enter" && register()} />
                    {err && <p style={{ color: DQ.danger, fontSize: 13, textAlign: "center", marginBottom: 8 }}>{err}</p>}
                    <button className="dq-btn bounce" onClick={register} disabled={loading}
                        style={{ width: "100%", marginBottom: 8, fontSize: 16, fontWeight: 700, textAlign: "center", paddingLeft: 16 }}>
                        {loading ? "⏳ きろくちゅう..." : "⚔️ とうろく！"}
                    </button>
                    <button onClick={() => goTo("choose")}
                        style={{
                            width: "100%", padding: 10, border: "1px solid #334466",
                            borderRadius: 8, background: "transparent", color: DQ.dim,
                            cursor: "pointer", fontSize: 13, fontFamily: "'DotGothic16', monospace",
                        }}>
                        ← もどる
                    </button>
                </LoginCard>
            )}

            {/* === ログイン === */}
            {step === "login" && (
                <LoginCard>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <div style={{ fontSize: 40 }}>📖</div>
                        <h1 style={{
                            fontSize: 20, fontWeight: 700,
                            color: DQ.gold, marginTop: 8,
                            textShadow: "0 0 8px rgba(255,215,0,0.3)",
                        }}>
                            ぼうけんのしょを ひらく
                        </h1>
                        <p style={{ color: DQ.dim, fontSize: 12, marginTop: 6 }}>
                            とうろくした じょうほうを いれてくれ
                        </p>
                    </div>
                    <input className="dq-input" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="メールアドレス" type="email" />
                    <input className="dq-input" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="パスワード" type="password" />
                    <input className="dq-input" value={pass} onChange={e => setPass(e.target.value)}
                        placeholder="あいことば" onKeyDown={e => e.key === "Enter" && login()} />
                    {/* 親ですか？チェック */}
                    <label style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 10, padding: "10px 0", marginBottom: 8, cursor: "pointer",
                        fontSize: 15, fontWeight: 700, color: DQ.gold,
                    }}>
                        <input type="checkbox" checked={isParent} onChange={e => setIsParent(e.target.checked)}
                            style={{ width: 20, height: 20, accentColor: DQ.gold, cursor: "pointer" }} />
                        👑 おうちのひとですか？
                    </label>
                    {err && <p style={{ color: DQ.danger, fontSize: 13, textAlign: "center", marginBottom: 8 }}>{err}</p>}
                    <button className="dq-btn bounce" onClick={login} disabled={loading}
                        style={{ width: "100%", marginBottom: 8, fontSize: 16, fontWeight: 700, textAlign: "center", paddingLeft: 16 }}>
                        {loading ? "⏳ よみこみちゅう..." : "🗝️ ログイン！"}
                    </button>
                    <button onClick={() => goTo("choose")}
                        style={{
                            width: "100%", padding: 10, border: "1px solid #334466",
                            borderRadius: 8, background: "transparent", color: DQ.dim,
                            cursor: "pointer", fontSize: 13, fontFamily: "'DotGothic16', monospace",
                        }}>
                        ← もどる
                    </button>
                </LoginCard>
            )}
        </div>
    );
}
