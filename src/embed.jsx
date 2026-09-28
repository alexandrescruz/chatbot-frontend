import React from 'react';
import { createRoot } from 'react-dom/client';
import Chatbot from './Chatbot.jsx';

export function mount(options = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<Chatbot {...options} />);
  let destroyed = false;
  return { destroy() { if (!destroyed) { destroyed = true; root.unmount(); container.remove(); } } };
}
