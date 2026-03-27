import { useState, useEffect, useCallback } from "react";
import { TIMES, todayStr, DQ } from "../constants";
import { store } from "../store";
import { Section, STitle, TimeChip, Loader } from "./ui.jsx";

/**
 * おうちのひと（親）画面コンポーネント — ドラクエ風
 */
export default function Parent({ session, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [name, setName] = useState("");
    const [tod, setTod] = useState("morning");
    const [tab, setTab] = useState("tasks");
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    const load = useCallback(async () => {
        const [t, c] = await Promise.all([
            store.getTasks(session.familyId),
            store.getCompletions(session.familyId, todayStr()),
        ]);

        // 過去7日間の実績を取得（今日は除く）
        const histVars = [];
        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            histVars.push(d.toISOString().split("T")[0]);
        }
        const histData = await Promise.all(histVars.map(async d => {
            const comps = await store.getCompletions(session.familyId, d);
            return { date: d, count: comps.length };
        }));

        setTasks(t); setCompletions(c); setHistory(histData); setLoading(false);
    }, [session.familyId]);

    useEffect(() => { load(); }, [load]);

    const addTask = async () => {
        if (!name.trim()) return;
        const task = { id: crypto.randomUUID(), name: name.trim(), time_of_day: tod };
        const next = [...tasks, task];
        await store.saveTasks(session.familyId, next);
        setName(""); await load();
    };

    const delTask = async (tid) => {
        if (!confirm("このタスクを けしますか？")) return;
        const next = tasks.filter(t => t.id !== tid);
        await store.saveTasks(session.familyId, next);
        await load();
    };

    const reset = async () => {
        if (!confirm("きょうの きろくを リセットしますか？")) return;
        await store.resetCompletions(session.familyId, todayStr());
        await load();
    };

    const isDone = (tid) => completions.includes(tid);

    const prog = (t) => {
        const tt = tasks.filter(x => x.time_of_day === t);
        return { total: tt.length, done: tt.filter(x => isDone(x.id)).length };
    };

    if (loading) return <Loader />;

    return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", minHeight: "100vh", background: DQ.bg }}>
            {/* ヘッダー */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <div style={{
                        fontSize: 20, fontWeight: 700, color: DQ.gold,
                        textShadow: "0 0 8px rgba(255,215,0,0.3)",
                    }}>
                        👑 おうちのひと
                    </div>
                    <div style={{ fontSize: 12, color: DQ.dim, marginTop: 2 }}>{todayStr()}</div>
                </div>
                <button onClick={onLogout} style={{
                    padding: "8px 16px", borderRadius: 8,
                    border: `1px solid #334466`, background: DQ.windowBg,
                    color: DQ.dim, cursor: "pointer", fontSize: 13,
                    fontFamily: "'DotGothic16', monospace",
                }}>
                    ← もどる
                </button>
            </div>

            {/* タブ切り替え */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {[["tasks", "⚔️ かんり"], ["progress", "📊 きょう"], ["history", "📜 かこ"]].map(([v, l]) => (
                    <button key={v} onClick={() => setTab(v)} style={{
                        flex: 1, padding: "12px 0",
                        border: `2px solid ${tab === v ? DQ.gold : "#334466"}`,
                        borderRadius: 8,
                        background: tab === v ? "rgba(255,215,0,0.1)" : DQ.windowBg,
                        color: tab === v ? DQ.gold : DQ.dim,
                        fontWeight: 700, fontSize: 14, cursor: "pointer",
                        fontFamily: "'DotGothic16', monospace",
                        textShadow: tab === v ? "0 0 6px rgba(255,215,0,0.3)" : "none",
                    }}>
                        {l}
                    </button>
                ))}
            </div>

            {/* タスク管理タブ */}
            {tab === "tasks" && (
                <>
                    <Section>
                        <STitle>✏️ タスクをついか</STitle>
                        <input className="dq-input" value={name} onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && addTask()}
                            placeholder="タスクめい（れい：はみがき）" />
                        <select value={tod} onChange={e => setTod(e.target.value)}
                            className="dq-input" style={{ appearance: "auto" }}>
                            <option value="morning">🌅 あさ</option>
                            <option value="noon">☀️ ひる</option>
                            <option value="night">🌙 よる</option>
                        </select>
                        <button className="dq-btn bounce" onClick={addTask}
                            style={{ width: "100%", fontSize: 16, fontWeight: 700, textAlign: "center", paddingLeft: 16 }}>
                            ➕ ついか！
                        </button>
                    </Section>

                    {["morning", "noon", "night"].map(t => {
                        const tt = tasks.filter(x => x.time_of_day === t);
                        if (!tt.length) return null;
                        return (
                            <Section key={t}>
                                <STitle><TimeChip time={t} /> のタスク</STitle>
                                {tt.map(task => (
                                    <div key={task.id} style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "12px 14px", borderRadius: 8,
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid #222",
                                        marginBottom: 8,
                                    }}>
                                        <span style={{ fontSize: 14, color: DQ.white }}>{task.name}</span>
                                        <button onClick={() => delTask(task.id)} style={{
                                            padding: "6px 12px", borderRadius: 6,
                                            border: `1px solid ${DQ.danger}`,
                                            background: "rgba(255,68,68,0.1)",
                                            color: DQ.danger, cursor: "pointer", fontSize: 12,
                                            fontFamily: "'DotGothic16', monospace",
                                        }}>
                                            🗑️ けす
                                        </button>
                                    </div>
                                ))}
                            </Section>
                        );
                    })}
                </>
            )}

            {/* しんちょくタブ */}
            {tab === "progress" && (
                <>
                    <Section>
                        <STitle>📊 きょうのぜんたい</STitle>
                        {["morning", "noon", "night"].map(t => {
                            const p = prog(t);
                            const pct = p.total ? (p.done / p.total) * 100 : 0;
                            return (
                                <div key={t} style={{ marginBottom: 18 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: TIMES[t].txt }}>
                                            {TIMES[t].icon} {TIMES[t].jp}
                                        </span>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: DQ.gold }}>
                                            {p.done} / {p.total}
                                        </span>
                                    </div>
                                    <div className="dq-progress">
                                        <div className="dq-progress-fill" style={{
                                            width: `${pct}%`,
                                            background: pct >= 100
                                                ? `linear-gradient(90deg, ${DQ.success}, #8BC34A)`
                                                : TIMES[t].grad,
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </Section>

                    {["morning", "noon", "night"].map(t => {
                        const tt = tasks.filter(x => x.time_of_day === t);
                        if (!tt.length) return null;
                        return (
                            <Section key={t}>
                                <STitle>{TIMES[t].icon} {TIMES[t].jp} のタスク</STitle>
                                {tt.map(task => {
                                    const done = isDone(task.id);
                                    return (
                                        <div key={task.id} style={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            padding: "12px 14px", borderRadius: 8,
                                            background: done ? "rgba(76,175,80,0.1)" : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${done ? DQ.success : "#222"}`,
                                            marginBottom: 8,
                                        }}>
                                            <span style={{ fontSize: 14, color: done ? DQ.success : DQ.white }}>{task.name}</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: done ? DQ.success : DQ.dim }}>
                                                {done ? "✅ クリア！" : "まだ"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </Section>
                        );
                    })}

                    <button className="dq-btn bounce" onClick={reset}
                        style={{
                            width: "100%", fontSize: 16, fontWeight: 700,
                            textAlign: "center", paddingLeft: 16,
                            borderColor: DQ.accent,
                        }}>
                        🔄 きょうの きろくを リセット
                    </button>
                </>
            )}

            {/* 過去の記録タブ */}
            {tab === "history" && (
                <Section>
                    <STitle>📜 さいきんの ぼうけん</STitle>
                    {history.map((h) => (
                        <div key={h.date} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "14px 16px", borderRadius: 8,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid #334466",
                            marginBottom: 8,
                        }}>
                            <span style={{ fontSize: 14, color: DQ.gold, fontFamily: "'DotGothic16', monospace" }}>
                                {h.date}
                            </span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: h.count > 0 ? DQ.success : DQ.dim }}>
                                {h.count > 0 ? "🎊 " + h.count + "コ たおした" : "おやすみ"}
                            </span>
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
}
