# Revisa — arquitetura fullstack

Repositório individual planejado: `HelioConde/revisa`.

## Produto
Treinador para provas e concursos com metas, questões adaptativas e progresso.

## Backend compartilhado
Supabase `pizzaria-db`.

Tabelas:
- `revisa_goals`
- `revisa_questions`
- `revisa_attempts`
- `product_subscriptions`

Metas/tentativas são privadas; questões ativas podem ser públicas para leitura.

## Estado atual
O usuário autenticado já persiste metas com prova, data e minutos de estudo por dia.

## Próximas entregas
- banco de questões por prova/matéria;
- simulados;
- dificuldade adaptativa;
- revisão espaçada;
- progresso por tópico;
- “continuar estudando” como CTA principal.

## Monetização
Assinatura ou pacotes por prova.

## QA obrigatório
Datas passadas, meta sem data, tentativa duplicada, correção de questão, progresso, mobile, teclado e isolamento RLS.
