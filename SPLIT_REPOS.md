# Separação dos sete repositórios restantes

A conexão GitHub atual não oferece uma operação de criação de repositório. Quando os repositórios existirem, esta é a divisão oficial.

| Repositório | Fonte atual | Backend principal |
|---|---|---|
| `HelioConde/vagacerta` | `02-vaga-certa/` | `vagacerta_applications`, `vagacerta_documents` |
| `HelioConde/falapro` | `03-entrevista-fluente/` | `falapro_sessions`, `falapro_answers` |
| `HelioConde/montapc` | `04-monta-pc/` | `montapc_components`, `montapc_builds`, `montapc_build_items` |
| `HelioConde/gameradar` | `05-caça-game/` | `gameradar_games`, `gameradar_offers`, `gameradar_custom_alerts` |
| `HelioConde/perto` | `07-perto-de-mim/` | `perto_professionals`, `perto_requests` |
| `HelioConde/pratopronto` | `08-prato-pronto/` | `pratopronto_plans`, `pratopronto_meals`, `pratopronto_shopping_items` |
| `HelioConde/revisa` | `09-revisa-ai/` | `revisa_goals`, `revisa_questions`, `revisa_attempts` |

## Arquivos compartilhados que precisam ser individualizados

Hoje os sete usam:
- `assets/app.js`
- `assets/style.css`
- `data.js`
- `supabase-config.js`

Ao separar, cada repositório deve receber somente o código do próprio produto. A camada de Supabase deve manter a mesma URL/publishable key, mas jamais copiar chaves secretas.

## Checklist de migração por repositório

1. mover o HTML da pasta do produto para `index.html`;
2. extrair apenas o adapter e UI daquele produto do `assets/app.js`;
3. copiar/limpar apenas o CSS utilizado;
4. manter `supabase-config.js`;
5. adicionar `README.md`, `FULLSTACK.md` e `.github/workflows/static-qa.yml`;
6. ajustar canonical/OG para a nova URL do GitHub Pages;
7. publicar Pages;
8. validar login, persistência, RLS, mobile e estados vazios/erro;
9. só depois remover a versão correspondente do laboratório.

Nenhum dado precisa ser migrado no Supabase: os novos repositórios continuarão usando as mesmas tabelas já criadas.
