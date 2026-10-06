# Painel de execução — Ideias IA Lab

Atualizado em 2026-10-06.

Este arquivo transforma a fila de prioridades em uma sequência prática de execução.

## Em desenvolvimento / foco imediato

| Ordem | Projeto | Estado | Próxima ação |
|---:|---|---|---|
| 1 | **AgendaLeve** | MVP publicado / validação avançada | contato, filtros, status, cancelamento e reagendamento seguro concluídos; faltam antiabuso externo e QA real |
| 2 | **DocPronto** | Homologação automatizada | fluxo comercial, aceite público, clientes reutilizáveis e QA Node concluídos; Browser E2E adicionado, faltam autenticação real em duas contas e revisão visual final |
| 3 | **Riot Legacy** | Ideia priorizada | criar repositório próprio e protótipo visual |
| 4 | **VagaCerta** | branch standalone pronta | criar repositório físico e publicar |
| 5 | **LoL Match Story** | Ideia priorizada | criar MVP visual usando dados reais quando disponíveis |
| 6 | **TFT Wrapped** | Ideia priorizada | criar retrospectiva mínima compartilhável |

## Definição de estados

- **Ideia** — conceito registrado, ainda sem estrutura própria.
- **Priorizada** — entrou na fila oficial.
- **Preparada** — estrutura standalone/escopo já definidos.
- **Em desenvolvimento** — implementação ativa.
- **MVP** — fluxo principal funcional.
- **Em QA** — testes de usabilidade, responsividade, erros e dados.
- **Publicado** — versão utilizável acessível ao público-alvo.
- **Validando** — coletando uso real antes de ampliar o escopo.
- **Pausado** — não é prioridade atual, mas continua no portfólio.

## Gate para passar ao próximo projeto

Um projeto pode deixar de ser foco principal quando cumprir:

- [ ] proposta de valor entendida rapidamente;
- [ ] fluxo principal funcional;
- [ ] interface utilizável no desktop e mobile;
- [ ] estados de loading, vazio, erro e sucesso;
- [ ] dados persistentes quando necessários;
- [ ] QA dos fluxos críticos;
- [ ] README do produto atualizado;
- [ ] deploy funcional;
- [ ] backlog V2 documentado;
- [ ] nenhum bloqueador crítico conhecido.

## Regra de WIP

Para evitar dezenas de produtos incompletos:

- máximo recomendado de **2 produtos principais em implementação pesada**;
- até **1 protótipo exploratório** em paralelo;
- ideias restantes permanecem documentadas, sem expansão desnecessária;
- uma nova ideia pode ser registrada a qualquer momento, mas só entra em execução se subir na fila oficial.

## Próximos blocos

### Bloco A — lançar
1. AgendaLeve — MVP publicado em validação avançada
2. DocPronto — homologação automatizada em andamento

### Bloco B — provar diferencial gamer
> Os três projetos prioritários abaixo ainda não possuem repositório físico. Outros repositórios gamer já criados podem avançar como protótipos exploratórios sem substituir esta prioridade.

3. Riot Legacy
4. LoL Match Story
5. TFT Wrapped

### Bloco C — monetização/uso recorrente
6. VagaCerta
7. PostPilot — multiplataforma, exportação e fluxo de publicação concluídos
8. MontaPC

### Bloco D — expansão gamer
9. **TFT Comp Evolution — MVP funcional; comparação, tabuleiro 4x7, import JSON e Static QA concluídos**
10. **OW Hero Pool Builder — MVP funcional; recomendação complementar, pools locais e Static QA concluídos**
11. LoL Champion Journey
12. TFT Board Museum
13. LoL Session Insights
14. TFT Augment Memory
15. OW VOD Timeline

## Regra de revisão

A ordem deve ser revisada quando algum projeto:

- conseguir usuários reais;
- gerar receita;
- tiver uma limitação técnica importante;
- puder ser lançado muito antes do esperado;
- ganhar vantagem clara por reaproveitar infraestrutura existente.
