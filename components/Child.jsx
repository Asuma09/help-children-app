import { useState, useEffect, useCallback } from "react";
import { TIMES, todayStr, DQ } from "../constants";
import { store } from "../store";
import { Loader } from "./ui.jsx";

/**
 * こども画面コンポーネント — ドラクエ風ダンジョン
 */
export default function Child({ session, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [confirmTask, setConfirmTask] = useState(null);
    const [stars, setStars] = useState([]);
    const [whoosh, setWhoosh] = useState(false);

    const load = useCallback(async () => {
        const [t, c] = await Promise.all([
            store.getTasks(session.familyId),
            store.getCompletions(session.familyId, todayStr()),
        ]);
        setTasks(t); setCompletions(c); setLoading(false);
    }, [session.familyId]);

    useEffect(() => { load(); }, [load]);

    const isDone = (tid) => completions.includes(tid);
    const timeTasks = (t) => tasks.filter(x => x.time_of_day === t);
    const prog = (t) => {
        const tt = timeTasks(t);
        return { total: tt.length, done: tt.filter(x => isDone(x.id)).length };
    };

    const doComplete = async () => {
        if (!confirmTask) return;
        await store.addCompletion(session.familyId, confirmTask.id, todayStr());
        await load();
        setConfirmTask(null);
        setWhoosh(true);
        setStars(Array.from({ length: 14 }, (_, i) => ({
            id: i, x: 10 + Math.random() * 80, delay: Math.random() * 0.4,
            size: 18 + Math.random() * 16,
            emoji: ["⭐", "🌟", "✨", "🎉", "💫", "🗡️", "🛡️", "💎"][Math.floor(Math.random() * 8)],
        })));
        setTimeout(() => { setWhoosh(false); setStars([]); }, 2200);
    };

    if (loading) return <Loader />;

    const total = tasks.length;
    const done = completions.length;
    const allDone = total > 0 && done >= total;

    // レベル計算
    const level = Math.floor(done / 3) + 1;
    const expCurrent = done % 3;
    const expMax = 3;

    return (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px", minHeight: "100vh", background: DQ.bg }}>
            {/* 紙吹雪アニメーション */}
            {whoosh && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
                    {stars.map(s => (
                        <span key={s.id} style={{
                            position: "absolute", left: `${s.x}%`, bottom: "20%",
                            fontSize: s.size, opacity: 0,
                            animation: `confetti 1.8s ease forwards`,
                            animationDelay: `${s.delay}s`,
                        }}>{s.emoji}</span>
                    ))}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{
                            fontSize: 28, fontWeight: 700, color: DQ.gold,
                            animation: "pop 0.4s ease",
                            textShadow: "0 0 16px rgba(255,215,0,0.6)",
                            fontFamily: "'DotGothic16', monospace",
                        }}>
                            ⚔️ タスクを たおした！🎉
                        </div>
                    </div>
                </div>
            )}

            {/* ステータスウィンドウ */}
            <div className="dq-window" style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{
                    fontSize: allDone ? 56 : 44,
                    animation: allDone ? "float 2s ease-in-out infinite" : "torch 3s infinite",
                }}>
                    {allDone ? "🏆" : "⚔️"}
                </div>
                <h1 style={{
                    fontSize: 22, fontWeight: 700, color: DQ.gold,
                    marginTop: 8, textShadow: "0 0 10px rgba(255,215,0,0.4)",
                }}>
                    きょうの ぼうけん
                </h1>

                {/* レベル & EXP */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 16,
                    marginTop: 14, padding: "10px 20px",
                    border: `2px solid ${DQ.windowBorder}`,
                    borderRadius: 8, background: "rgba(0,0,0,0.3)",
                }}>
                    <div>
                        <div style={{ fontSize: 11, color: DQ.dim }}>レベル</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: DQ.gold }}>{level}</div>
                    </div>
                    <div style={{ width: 1, height: 36, background: "#334466" }} />
                    <div>
                        <div style={{ fontSize: 11, color: DQ.dim }}>EXP</div>
                        <div className="dq-progress" style={{ width: 80, height: 12 }}>
                            <div className="dq-progress-fill" style={{
                                width: `${(expCurrent / expMax) * 100}%`,
                                background: `linear-gradient(90deg, ${DQ.mp}, #66BBFF)`,
                            }} />
                        </div>
                    </div>
                    <div style={{ width: 1, height: 36, background: "#334466" }} />
                    <div>
                        <div style={{ fontSize: 11, color: DQ.dim }}>クリア</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: allDone ? DQ.success : DQ.white }}>
                            {done}/{total}
                        </div>
                    </div>
                </div>

                {allDone && (
                    <div style={{
                        marginTop: 12, fontSize: 14, color: DQ.success,
                        animation: "blink 2s infinite",
                    }}>
                        🌟 すべてのタスクを たおした！すごい！
                    </div>
                )}
            </div>

            {/* 時間帯ダンジョンボタン */}
            {["morning", "noon", "night"].map(t => {
                const p = prog(t);
                const allTimeD = p.total > 0 && p.done === p.total;
                return (
                    <button key={t} className="bounce" onClick={() => p.total > 0 && setModal(t)}
                        disabled={p.total === 0}
                        style={{
                            width: "100%", marginBottom: 14,
                            border: `2px solid ${allTimeD ? DQ.success : TIMES[t].border}`,
                            borderRadius: 10,
                            background: allTimeD
                                ? "rgba(76,175,80,0.15)"
                                : TIMES[t].light,
                            padding: "18px 20px",
                            cursor: p.total > 0 ? "pointer" : "default",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            boxShadow: allTimeD
                                ? "0 0 12px rgba(76,175,80,0.3)"
                                : `0 0 10px rgba(0,0,0,0.3)`,
                            opacity: p.total === 0 ? 0.4 : 1,
                            fontFamily: "'DotGothic16', monospace",
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 36 }}>{allTimeD ? "✅" : TIMES[t].icon}</span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: TIMES[t].txt }}>{TIMES[t].jp}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: DQ.gold }}>{p.done} / {p.total}</div>
                            <div style={{ fontSize: 11, color: DQ.dim }}>
                                {p.total === 0 ? "タスクなし" : allTimeD ? "ぜんぶ たおした！" : "▶ たたかう"}
                            </div>
                        </div>
                    </button>
                );
            })}

            <div style={{ textAlign: "center", marginTop: 12 }}>
                <button onClick={onLogout} style={{
                    background: "none", border: "none", color: DQ.dim,
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "'DotGothic16', monospace",
                }}>
                    ← もどる
                </button>
            </div>

            {/* タスク一覧モーダル（ダンジョンウィンドウ） */}
            {modal && (
                <div onClick={() => setModal(null)} style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.75)", zIndex: 100,
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: DQ.windowBg,
                        border: `3px solid ${DQ.windowBorder}`,
                        borderRadius: "16px 16px 0 0",
                        padding: "24px 18px 28px",
                        width: "100%", maxWidth: 480, maxHeight: "72vh", overflowY: "auto",
                        animation: "slide-up 0.3s ease",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(74,143,212,0.3)",
                    }}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <span style={{ fontSize: 32 }}>{TIMES[modal].icon}</span>
                            <div style={{
                                fontSize: 20, fontWeight: 700, color: DQ.gold,
                                marginTop: 4, textShadow: "0 0 8px rgba(255,215,0,0.3)",
                            }}>
                                {TIMES[modal].jp} のダンジョン
                            </div>
                            <div style={{ fontSize: 13, color: DQ.dim, marginTop: 4 }}>
                                {prog(modal).done} / {prog(modal).total} たおした
                            </div>
                        </div>
                        {timeTasks(modal).map(task => {
                            const d = isDone(task.id);
                            return (
                                <button key={task.id} className="bounce"
                                    onClick={() => !d && setConfirmTask(task)} disabled={d}
                                    style={{
                                        width: "100%", display: "flex",
                                        justifyContent: "space-between", alignItems: "center",
                                        padding: "14px 16px", borderRadius: 8,
                                        border: `2px solid ${d ? DQ.success : "#334466"}`,
                                        background: d ? "rgba(76,175,80,0.1)" : "rgba(255,255,255,0.03)",
                                        marginBottom: 8,
                                        cursor: d ? "default" : "pointer",
                                        fontFamily: "'DotGothic16', monospace",
                                    }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: d ? DQ.success : DQ.white }}>
                                        {d ? "✅ " : "🐉 "}{task.name}
                                    </span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: d ? DQ.success : DQ.gold }}>
                                        {d ? "たおした！" : "▶ たたかう"}
                                    </span>
                                </button>
                            );
                        })}
                        <button onClick={() => setModal(null)} style={{
                            width: "100%", padding: 14, borderRadius: 8,
                            border: `1px solid #334466`, background: DQ.windowBg,
                            color: DQ.dim, fontWeight: 700, fontSize: 15,
                            cursor: "pointer", marginTop: 8,
                            fontFamily: "'DotGothic16', monospace",
                        }}>
                            とじる
                        </button>
                    </div>
                </div>
            )}

            {/* タスク完了確認ダイアログ */}
            {confirmTask && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.8)", zIndex: 200,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
                }}>
                    <div className="dq-window" style={{
                        maxWidth: 360, width: "100%", textAlign: "center",
                        animation: "pop 0.35s ease", padding: "32px 24px",
                    }}>
                        <div style={{ fontSize: 48, animation: "float 2s ease-in-out infinite" }}>🐉</div>
                        <div style={{
                            fontSize: 18, fontWeight: 700, color: DQ.gold,
                            margin: "12px 0 6px",
                            textShadow: "0 0 8px rgba(255,215,0,0.3)",
                        }}>
                            「{confirmTask.name}」
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: DQ.white, marginBottom: 24 }}>
                            を たおしましたか？
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button className="dq-btn bounce" onClick={() => setConfirmTask(null)}
                                style={{ flex: 1, fontSize: 16, fontWeight: 700, textAlign: "center", paddingLeft: 16 }}>
                                まだ
                            </button>
                            <button className="dq-btn bounce" onClick={doComplete}
                                style={{
                                    flex: 1, fontSize: 16, fontWeight: 700, textAlign: "center", paddingLeft: 16,
                                    borderColor: DQ.gold, color: DQ.gold,
                                }}>
                                ⚔️ たおした！
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
