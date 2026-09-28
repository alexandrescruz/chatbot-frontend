export const styles = `
:host { all: initial; color-scheme: light; }
*, *::before, *::after { box-sizing: border-box; }
.widget { --accent: #6246ea; position: fixed; bottom: max(20px, env(safe-area-inset-bottom)); right: max(20px, env(safe-area-inset-right)); z-index: 2147483000; font: 14px/1.5 system-ui, -apple-system, sans-serif; color: #24213b; text-align: left; }
.widget.left { right: auto; left: max(20px, env(safe-area-inset-left)); }
button, textarea { font: inherit; }
button { cursor: pointer; }
button:focus-visible, textarea:focus-visible { outline: 3px solid #b6a7ff; outline-offset: 3px; }
button:disabled { cursor: not-allowed; opacity: .5; }
.panel { width: min(380px, calc(100vw - 40px)); height: min(570px, calc(100dvh - 112px)); min-height: 200px; display: flex; flex-direction: column; background: #fff; border: 1px solid #e9e5f5; border-radius: 22px; overflow: hidden; box-shadow: 0 18px 70px #21163d26; margin-bottom: 14px; }
header { display: flex; align-items: center; gap: 12px; padding: 20px 16px; border-bottom: 1px solid #eeeaf6; flex-shrink: 0; }
.avatar { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 14px; background: var(--accent); color: #fff; font-size: 26px; flex-shrink: 0; }
.heading { flex: 1; min-width: 0; }
h2 { margin: 0; font-size: 15px; line-height: 1.3; overflow-wrap: anywhere; }
header p { margin: 5px 0 0; color: #767087; font-size: 11px; }
.dot { display: inline-block; width: 6px; height: 6px; background: #36a779; border-radius: 50%; margin-right: 5px; }
.close { border: 0; background: #f6f4fa; color: #6d667e; width: 32px; height: 32px; border-radius: 50%; font-size: 24px; }
.messages { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 18px; background: #fdfcfe; }
.intro { text-align: center; font-size: 9px; letter-spacing: 1.7px; color: #918a9f; margin: 0 0 22px; }
.message { width: fit-content; max-width: 88%; border-radius: 16px 16px 16px 4px; padding: 12px 14px; background: #f0edf7; margin: 0 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.message.user { margin-left: auto; background: var(--accent); color: #fff; border-radius: 16px 16px 4px 16px; }
.loading { font-size: 12px; color: #6d667e; }
.suggestions { display: flex; flex-wrap: wrap; gap: 7px; padding: 8px 18px 14px; }
.suggestions button { padding: 8px 12px; border: 1px solid #e6e0f3; border-radius: 10px; background: #fff; color: #514370; font-size: 12px; }
form { display: flex; align-items: center; gap: 8px; margin: 0 14px; padding: 9px; background: #f7f5fa; border: 1px solid #eae5f1; border-radius: 14px; }
textarea { flex: 1; width: 0; resize: none; max-height: 96px; padding: 7px 3px; border: 0; background: transparent; color: #24213b; font-size: 16px; }
.send { border: 0; border-radius: 10px; width: 36px; height: 36px; background: var(--accent); color: #fff; font-size: 23px; }
footer { padding: 10px 12px; text-align: center; color: #918a9f; font-size: 9px; }
.error { padding: 8px 16px; margin: 0; font-size: 12px; color: #a52b38; }
.launcher { display: flex; align-items: center; gap: 10px; margin-left: auto; border: 0; border-radius: 40px; padding: 16px 21px; background: var(--accent); color: #fff; box-shadow: 0 8px 24px #39228335; font-weight: 600; min-height: 56px; }
.left .launcher { margin-left: 0; margin-right: auto; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media(max-width: 420px) { .widget { bottom: max(12px, env(safe-area-inset-bottom)); right: 12px; } .widget.left { left: 12px; } .panel { width: calc(100vw - 24px); height: min(570px, calc(100dvh - 98px)); } }
`;
