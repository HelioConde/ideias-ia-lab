# FalaPro — arquitetura fullstack

Repositório individual planejado: `HelioConde/falapro`.

## Produto
Treino de inglês para entrevistas por profissão, com sessões, respostas e feedback.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `falapro_sessions`
- `falapro_answers`
- `product_subscriptions`

Tudo que pertence ao usuário é protegido por RLS.

## Estado atual
Com login, uma sessão é criada e cada resposta é persistida. Sem conta, o protótipo continua local.

## Próximas entregas
- uma pergunta por tela;
- banco de perguntas por profissão;
- avaliação de clareza, gramática e estrutura;
- histórico de evolução;
- áudio/transcrição opcional;
- feedback por IA executado no backend.

## Monetização
Assinatura ou pacotes de simulações.

## QA obrigatório
Sessão interrompida, resposta longa, histórico, isolamento entre contas, acessibilidade, mobile e falhas de transcrição/IA.
