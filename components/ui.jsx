import { DQ, TIMES } from "../constants";

/**
 * ドラクエ風ウィンドウコンポーネント（ログインカード用）
 */
export function LoginCard({ children }) {
    return (
        <div className="dq-window" style={{
            maxWidth: 400, width: "100%", margin: "0 auto",
            padding: "32px 24px",
            animation: "pop .4s ease",
        }}>
            {children}
        </div>
    );
}

/**
 * ドラクエ風セクションウィンドウ
 */
export function Section({ children }) {
    return <div className="dq-window">{children}</div>;
}

/**
 * セクションタイトル — ドラクエ風金色テキスト
 */
export function STitle({ children }) {
    return (
        <div style={{
            fontSize: 15, fontWeight: 700, color: DQ.gold,
            marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
            textShadow: "0 0 6px rgba(255,215,0,0.3)",
        }}>
            {children}
        </div>
    );
}

/**
 * 時間帯チップ — ドラクエ風バッジ
 */
export function TimeChip({ time }) {
    return (
        <span style={{
            fontSize: 13, fontWeight: 700,
            padding: "4px 12px", borderRadius: 6,
            background: TIMES[time].light,
            color: TIMES[time].txt,
            border: `1px solid ${TIMES[time].border}`,
        }}>
            {TIMES[time].icon} {TIMES[time].jp}
        </span>
    );
}

/**
 * ローディング — ドラクエ風
 */
export function Loader() {
    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20, color: DQ.gold,
            fontFamily: "'DotGothic16', monospace",
            background: DQ.bg,
        }}>
            <span style={{ animation: "blink 1.5s infinite" }}>⏳ よみこみちゅう...</span>
        </div>
    );
}
