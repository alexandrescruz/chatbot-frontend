import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { styles } from './styles.js';

/** onSend({ message, messages, signal }) deve retornar uma Promise<string>. */
export default function Chatbot({
  title = 'Como podemos ajudar?',
  subtitle = 'Converse com nosso assistente',
  welcomeMessage = 'Olá! 👋 Em que posso ajudar você hoje?',
  primaryColor = '#6246ea',
  position = 'right',
  endpoint,
  onSend,
  suggestions = ['Como funciona?', 'Quero saber mais'],
  timeoutMs = 30000,
}) {
  const [root, setRoot] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: welcomeMessage }]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);
  const launcher = useRef(null);
  const bottom = useRef(null);
  const activeRequest = useRef(null);
  const id = useId();
  const demo = !endpoint && !onSend;

  useEffect(() => {
    const host = document.createElement('div');
    host.setAttribute('data-react-chatbot', '');
    // Portal no body evita cortes por overflow e transform dos ancestrais.
    document.body.appendChild(host);
    setRoot(host.attachShadow({ mode: 'open' }));
    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
      host.remove();
    };
  }, []);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { bottom.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy, open]);

  function close() { setOpen(false); launcher.current?.focus(); }

  async function send(text) {
    const message = text.trim();
    if (!message || activeRequest.current) return;
    const history = [...messages, { role: 'user', content: message }];
    const controller = new AbortController();
    activeRequest.current = controller;
    setMessages(history);
    setDraft('');
    setError('');
    setBusy(true);
    let timer;
    try {
      // O timeout também funciona se onSend não respeitar AbortSignal.
      const aborted = new Promise((_, reject) => {
        controller.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      });
      timer = setTimeout(() => controller.abort(), timeoutMs);
      const operation = async () => {
        if (onSend) return onSend({ message, messages: history, signal: controller.signal });
        if (endpoint) {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, messages: history }),
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return (await response.json()).reply;
        }
        return 'Este é o modo demonstração. Conecte a propriedade endpoint ou onSend para receber respostas do seu atendimento ou IA.';
      };
      const reply = await Promise.race([operation(), aborted]);
      if (typeof reply !== 'string' || !reply.trim()) throw new Error('Resposta inválida');
      if (activeRequest.current === controller) setMessages([...history, { role: 'assistant', content: reply }]);
    } catch {
      if (activeRequest.current === controller) {
        setMessages(history.slice(0, -1));
        setDraft(message);
        setError(controller.signal.aborted ? 'O atendimento demorou para responder. Tente novamente.' : 'Não foi possível enviar. Sua mensagem foi preservada para tentar novamente.');
      }
    } finally {
      clearTimeout(timer);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setBusy(false);
        input.current?.focus();
      }
    }
  }

  if (!root) return null;
  return createPortal(<>
    <style>{styles}</style>
    <div className={`widget ${position === 'left' ? 'left' : ''}`} style={{ '--accent': primaryColor }}>
      {open && <section className="panel" role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} id={`${id}-panel`}
        onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
        <header>
          <div className="avatar" aria-hidden="true">✦</div>
          <div className="heading"><h2 id={`${id}-title`}>{title}</h2><p><span className="dot" />{subtitle}</p></div>
          <button className="close" type="button" onClick={close} aria-label="Fechar conversa">×</button>
        </header>
        <div className="messages" role="log" aria-label="Mensagens da conversa" aria-live="polite" aria-relevant="additions text">
          <div className="intro">{demo ? 'DEMONSTRAÇÃO' : 'INÍCIO DA CONVERSA'}</div>
          {messages.map((m, i) => <div key={i} className={`message ${m.role}`}>
            <span className="sr-only">{m.role === 'user' ? 'Você: ' : 'Assistente: '}</span>{m.content}
          </div>)}
          {busy && <div className="message assistant loading" role="status">Aguardando resposta<span aria-hidden="true">…</span></div>}
          <div ref={bottom} />
        </div>
        {messages.length === 1 && <div className="suggestions">{suggestions.map((s, i) => <button type="button" key={i} onClick={() => send(s)} disabled={busy}>{s} <span aria-hidden="true">↗</span></button>)}</div>}
        {error && <p className="error" role="alert">{error}</p>}
        <form onSubmit={event => { event.preventDefault(); send(draft); }}>
          <label className="sr-only" htmlFor={`${id}-input`}>Sua mensagem</label>
          <textarea id={`${id}-input`} ref={input} value={draft} rows={1} maxLength={4000} disabled={busy}
            placeholder="Escreva sua mensagem…" onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(draft); } }} />
          <button className="send" type="submit" disabled={busy || !draft.trim()} aria-label="Enviar mensagem">↑</button>
        </form>
        <footer>{demo ? 'Modo demonstração • conecte sua API' : 'Enter para enviar • Shift + Enter para nova linha'}</footer>
      </section>}
      <button ref={launcher} type="button" className="launcher" aria-label={open ? 'Fechar chat' : 'Abrir chat'} aria-expanded={open} aria-controls={open ? `${id}-panel` : undefined} onClick={() => open ? close() : setOpen(true)}>
        {open ? <span aria-hidden="true">⌄</span> : <><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 1.5-6A8.5 8.5 0 1 1 21 11.5Z" /></svg><span>Vamos conversar</span></>}
      </button>
    </div>
  </>, root);
}
