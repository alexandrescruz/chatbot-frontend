# Chatbot React incorporável

Chat flutuante responsivo em português. Estilos isolados com Shadow DOM, sem Tailwind ou biblioteca de ícones. O histórico fica somente na memória e desaparece ao recarregar. Sem API configurada, funciona como demonstração explícita, sem IA.

## Rodar a demonstração

Requer Node.js 22.12+.

```bash
npm install
npm run dev
```

Abra a URL indicada no terminal. O projeto inclui package-lock.json; use `npm ci` para instalações reproduzíveis.

## Usar em um projeto React

Copie `src/Chatbot.jsx` e `src/styles.js` para a mesma pasta no seu projeto. Requer React e React DOM 18+.

```jsx
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <>
      <main>Seu site</main>
      <Chatbot
        title="Atendimento"
        subtitle="Tire suas dúvidas por aqui"
        primaryColor="#6246ea"
        position="right"
        welcomeMessage="Olá! Como posso ajudar?"
        endpoint="/api/chat"
        suggestions={['Conhecer serviços', 'Falar com a equipe']}
      />
    </>
  );
}
```

Next.js App Router: acrescente `'use client';` no início de Chatbot.jsx ou importe-o por um componente cliente.

## Incorporar em sites sem React

O arquivo `dist/chatbot.js` contém React, React DOM e o widget. Hospede-o no seu site e inclua antes de `</body>`:

```html
<script src="/chatbot.js"></script>
<script>
  const chat = SiteChatbot.mount({
    title: 'Atendimento',
    primaryColor: '#6246ea',
    endpoint: '/api/chat'
  });
  // Para remover: chat.destroy();
</script>
```

Para gerar novamente: `npm run build`. O bundle pode ser servido por um CMS, página HTML ou outro framework. O site precisa permitir esses scripts e os estilos internos na sua política CSP. O chat não pode aparecer fora dos limites de um iframe quando executado dentro dele.

## Conectar ao backend

`endpoint` recebe um POST JSON:

```json
{
  "message": "Olá",
  "messages": [
    { "role": "assistant", "content": "Olá! Como posso ajudar?" },
    { "role": "user", "content": "Olá" }
  ]
}
```

Seu servidor deve responder HTTP 200 com:

```json
{ "reply": "Olá! Posso apresentar nossos serviços." }
```

A API e o modelo de IA não estão incluídos. As chaves do provedor devem ficar no backend. O servidor deve validar os dados e não tratar mensagens do navegador como instruções confiáveis. Para endpoint em outro domínio, configure CORS no servidor. Respostas são texto simples e não executam HTML.

### Requisição personalizada

`onSend` tem prioridade sobre `endpoint` e deve retornar uma string ou Promise<string>. Use-o para cookies, headers, adaptação de JSON ou seu próprio serviço:

```jsx
<Chatbot
  onSend={async ({ message, messages, signal }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, messages }),
      signal,
    });
    if (!response.ok) throw new Error('Falha no atendimento');
    const data = await response.json();
    return data.reply;
  }}
/>
```

Se usar autenticação por cookie, siga a proteção CSRF da sua API.

## Propriedades

| Propriedade | Padrão | Finalidade |
|---|---|---|
| title | Como podemos ajudar? | Título |
| subtitle | Converse com nosso assistente | Subtítulo |
| welcomeMessage | Olá! 👋 Em que posso ajudar você hoje? | Mensagem inicial, lida na montagem |
| primaryColor | #6246ea | Cor principal; escolha contraste legível com branco |
| position | right | right ou left |
| endpoint | Não definido | URL da API |
| onSend | Não definido | Callback de envio |
| suggestions | Como funciona? / Quero saber mais | Perguntas iniciais; `[]` oculta |
| timeoutMs | 30000 | Tempo limite de resposta, em milissegundos |

Enter envia; Shift+Enter quebra linha; Escape fecha. Há identificação para leitores de tela e foco no campo ao abrir. É um painel não modal: o restante do site continua acessível pelo teclado. Há limite de 4.000 caracteres no campo, bloqueio de envios simultâneos e devolução do texto ao campo em caso de erro. Não inclui streaming, anexos, persistência ou atendimento humano.
