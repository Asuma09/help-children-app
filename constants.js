/**
 * 今日の日付を "YYYY-MM-DD" 形式の文字列で返す
 * @returns {string} 例: "2026-03-23"
 */
export const todayStr = () => new Date().toISOString().split("T")[0];

/**
 * 時間帯（あさ・ひる・よる）ごとの表示設定 — ドラクエ風
 */
export const TIMES = {
  morning: { jp: "あさ", icon: "🌅", grad: "linear-gradient(135deg,#C68B3E,#8B5E2B)", light: "#3A2A1A", txt: "#FFD700", border: "#C68B3E" },
  noon: { jp: "ひる", icon: "☀️", grad: "linear-gradient(135deg,#4A6FA5,#2A3F6F)", light: "#1A2A4A", txt: "#7EC8E3", border: "#4A6FA5" },
  night: { jp: "よる", icon: "🌙", grad: "linear-gradient(135deg,#6B3FA0,#3D1F6D)", light: "#2A1A4A", txt: "#C9A0FF", border: "#6B3FA0" },
};

/**
 * ドラクエ風カラーパレット
 */
export const DQ = {
  bg: "#0A0A1A",       // ダンジョン背景（深い闇）
  windowBg: "#0D1B2A",       // ウィンドウ背景（濃紺）
  windowBorder: "#4A8FD4",     // ウィンドウ枠（青）
  gold: "#FFD700",       // 金色テキスト
  white: "#E8E8E8",       // 白テキスト
  dim: "#6688AA",       // 薄いテキスト
  accent: "#FF9800",       // アクセント（オレンジ）
  danger: "#FF4444",       // 危険色
  success: "#4CAF50",       // 成功色
  hp: "#44BB44",       // HP緑
  mp: "#4488FF",       // MP青
  cursorGold: "#FFD700",       // カーソル金
};

/**
 * グローバルCSSスタイル — ドラクエ風
 */
export const css = `
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'DotGothic16', 'M PLUS Rounded 1c', monospace;
    background: ${DQ.bg};
    color: ${DQ.white};
  }
  @keyframes pop { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes slide-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-160px) rotate(720deg);opacity:0} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes torch { 0%,100%{text-shadow:0 0 8px #FF9800,0 0 16px #FF6B00} 50%{text-shadow:0 0 12px #FFB300,0 0 24px #FF8F00} }
  @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .bounce:active{transform:scale(0.94)!important;transition:transform 0.1s!important}
  .dq-window {
    background: ${DQ.windowBg};
    border: 3px solid ${DQ.windowBorder};
    border-radius: 12px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(74,143,212,0.2);
    padding: 20px 18px;
    margin-bottom: 16px;
  }
  .dq-btn {
    font-family: 'DotGothic16', monospace;
    border: 2px solid ${DQ.windowBorder};
    border-radius: 8px;
    background: ${DQ.windowBg};
    color: ${DQ.white};
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    text-align: left;
    padding: 14px 16px 14px 32px;
  }
  .dq-btn:hover {
    background: #1A2F4A;
    border-color: ${DQ.gold};
    color: ${DQ.gold};
  }
  .dq-btn::before {
    content: "▶";
    position: absolute;
    left: 10px;
    color: ${DQ.gold};
    font-size: 12px;
    animation: cursor-blink 1s infinite;
  }
  .dq-btn:hover::before {
    animation: none;
    opacity: 1;
  }
  .dq-input {
    width: 100%;
    padding: 12px 16px;
    font-family: 'DotGothic16', monospace;
    font-size: 16px;
    background: #050510;
    color: ${DQ.white};
    border: 2px solid #334466;
    border-radius: 8px;
    outline: none;
    margin-bottom: 10px;
  }
  .dq-input:focus {
    border-color: ${DQ.gold};
    box-shadow: 0 0 8px rgba(255,215,0,0.3);
  }
  .dq-input::placeholder {
    color: #446688;
  }
  .dq-progress {
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    height: 16px;
    overflow: hidden;
  }
  .dq-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;
  }
`;
