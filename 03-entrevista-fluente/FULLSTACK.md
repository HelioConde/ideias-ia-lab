# FalaPro — arquitetura fullstack

Repositório individual planejado: `HelioConde/falapro`.

## Produto

Treino de inglês para entrevistas por profissão, com sessões guiadas, respostas e feedback.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `falapro_sessions`
- `falapro_answers`
- `product_subscriptions`

Tudo que pertence ao usuário é protegido por RLS.

## Implementado

- modo local sem conta;
- Supabase Auth;
- sessões com cargo e nível;
- cinco perguntas por sessão;
- bancos de perguntas para Front-End, QA, Suporte/TI e entrevista geral;
- uma pergunta por tela;
- contador de palavras;
- feedback por regras explícitas, sem fingir IA;
- pontuação baseada em contexto, verbos de ação, resultados, conectores e vocabulário do cargo;
- média da sessão;
- histórico de sessões;
- encerramento antecipado mantendo respostas;
- sincronização de sessões e respostas;
- importação local → conta;
- migração dos rascunhos do protótipo antigo;
- UI própria responsiva;
- CI dedicado.

## Regra de feedback

O avaliador atual é heurístico. Ele não afirma corrigir gramática completa nem pronúncia. O frontend informa claramente que:

- não substitui professor;
- não usa IA nesta etapa;
- a pontuação avalia estrutura e sinais objetivos da resposta;
- áudio/transcrição ainda não estão conectados.

## Próximas entregas

- gravação de áudio;
- transcrição;
- feedback de pronúncia;
- IA no backend para gramática/clareza;
- banco maior de perguntas por profissão;
- simulação cronometrada;
- exemplos de respostas fortes;
- evolução por competência.

## Monetização

Assinatura mensal ou pacotes de simulações.

## QA obrigatório

- sessão interrompida;
- resposta vazia/curta/longa;
- pontuação;
- conclusão após 5 perguntas;
- encerramento antecipado;
- histórico;
- importação;
- isolamento RLS;
- mobile e teclado.
