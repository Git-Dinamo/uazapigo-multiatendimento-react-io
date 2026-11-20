# Aprendizados: Bubble (original) × Draftbit (Dinamo Chat) × esta versão

Foco em funcionalidade, não em aparência.

## 1. De onde vêm as conversas
- **Bubble (funcionava):** não tinha banco próprio de mensagens. Lia direto o que a UAZAPI já guarda (`/chat/find`, `/message/find`).
- **Draftbit (travou aqui):** tentou montar uma caixa de entrada própria na API Dinamo, alimentada por webhooks. Enquanto essa etapa não existia ou falhava, o inbox ficava vazio, contatos sem nome/foto e mensagens do celular (`fromMe`) caíam na conversa errada.
- **Lição:** o provedor já é o banco de dados das conversas. Só construa um armazenamento próprio se houver um motivo claro (ex.: provedor sem histórico), e mesmo assim como cache, não como fonte única.

## 2. Tempo real
- **Bubble:** uma conexão SSE direta na UAZAPI (`/sse`) com eventos de chats, mensagens, status e "digitando".
- **Draftbit:** polling (lista a cada 30 s, conversa a cada 10 s) contra uma API que estourava limite de CPU, gerando 503.
- **Lição:** use o canal de eventos que o provedor já oferece; polling só como reserva (esta versão faz isso: SSE e, se cair, atualiza a cada 15 s).

## 3. "Assumir" e o robô
- **Bubble:** gravava atendimento nos campos do próprio chat na UAZAPI (`lead_assignedAttendant_id`, `lead_isTicketOpen`, `lead_disableChatBotUntil`) via `/chat/editLead`. O robô da UAZAPI lê esses campos, então pausava de verdade.
- **Draftbit:** "Assumir" gravava no banco Dinamo, que o robô externo (n8n) não lia. Resultado: a IA continuava respondendo.
- **Lição:** o estado que controla o robô tem que ficar onde o robô olha. Esta versão, ao atribuir, também abre o atendimento e pausa o robô por um tempo configurável.

## 4. Anexos e áudio
- **Bubble:** enviava direto para `/send/media` (base64 ou URL) e gravava áudio já em MP3.
- **Draftbit:** o upload parava no armazenamento da API ("stored_pending") e não chegava ao WhatsApp; áudio WebM precisou ser convertido depois.
- **Lição:** enviar mídia é responsabilidade do provedor; converta o áudio para MP3/Ogg antes de enviar.

## 5. Etiquetas, notas e dados do contato
- **Bubble:** etiquetas do WhatsApp Business (`/labels`, `/chat/labels`) e dados do lead (nome, e-mail, CPF, notas, tags) na própria conversa.
- **Draftbit:** catálogo próprio de etiquetas com mapeamento por número, conflitos de versão ao gravar contato.
- **Lição:** comece pelo que o provedor já tem; mapeamentos próprios só quando houver mais de um provedor de fato.

## 6. Complexidade
- **Bubble:** 1 tela, 2 credenciais (URL + token).
- **Draftbit:** Clerk, organizações, 10 workers, Neon + Durable Objects, briefings de backend antes de a primeira mensagem aparecer.
- **Lição:** primeiro faça a conversa funcionar ponta a ponta com o provedor principal; login, multiempresa e outros provedores vêm depois.

## 7. O que o Bubble fazia de pior (e vale corrigir)
- O token da instância fica no navegador de cada atendente. Para uso com equipe, o ideal é um intermediário fino na sua API que só repassa chamadas e eventos para a UAZAPI (sem armazenar mensagens), guardando o token no servidor.
- Sem login de atendente: "quem sou eu" é só um nome digitado.

## 8. A tela não deve saber de qual provedor vem a conversa
- **Esta versão:** a tela fala com uma camada de "provedor". A UAZAPI real e um provedor de demonstração (`?demo` no endereço) respondem às mesmas chamadas, então tudo pôde ser testado sem instância.
- **Draftbit:** dados de demonstração misturados com dados reais dentro do mesmo estado da tela.
- **Lição:** a API Dinamo multi-provedor entra como mais um adaptador, sem mudar as telas.

## 9. Tempo real incremental
- **Bubble:** mantém as conversas em memória e, a cada evento SSE, atualiza só a conversa que mudou; se chega uma conversa desconhecida, espera 1 s e busca só ela (`/chat/find` com o id).
- **Lição:** nada de recarregar a lista inteira a cada aviso; isso é bem mais leve que polling.

## 10. "Assumir" como uma ação só
- No Bubble, atribuir, abrir atendimento e pausar o robô são ações separadas. Aqui um clique grava as três na conversa da UAZAPI. Foi uma escolha desta versão para resolver a IA que continuava respondendo no Draftbit.

## 11. O Bubble também tem defeitos
- O console do original mostra erro de um plugin de terceiros na caixa de mensagem (`Chat Input PRO`: `instance.data.reset is not a function`). Dependências de plugins pagos ficam fora do seu controle; aqui a caixa de mensagem é própria.

## 12. O maior risco agora: o que foi deduzido e não testado
- Formatos inferidos do código do plugin, ainda a confirmar com uma instância real:
  - se o servidor aceita chamadas direto do navegador (o Bubble faz isso, então provavelmente sim);
  - o identificador usado no `/chat/editLead` (id interno da conversa ou `wa_chatid`);
  - a unidade de `lead_disableChatBotUntil` (aqui enviada em segundos);
  - a resposta de `/message/download` e dos eventos SSE de status.
- Teste com leitura primeiro (status, conversas, mensagens, etiquetas); envio e mudanças de atribuição/etiqueta aparecem para os contatos, então só numa conversa de teste.

## 13. Segurança do token
- O token da instância dá controle total do número. Não deve ficar em arquivos do projeto, no Git nem em conversas. Se ele já foi colado em algum lugar compartilhado, gere um token novo na UAZAPI.

## Caminho recomendado para a sua API multi-provedor
1. Manter a tela falando com um "provedor" genérico (já é assim aqui: a UAZAPI é um adaptador).
2. Na API Dinamo, expor por provedor as mesmas operações (listar chats, mensagens, enviar, editar lead, eventos), **repassando** ao provedor em vez de copiar os dados.
3. Só para provedores sem histórico (ex.: Telegram), guardar mensagens localmente.
