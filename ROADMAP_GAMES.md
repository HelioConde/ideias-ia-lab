# Roadmap gamer — LoL, TFT e Overwatch

Atualizado em 2026-10-06.

Este documento organiza apenas os projetos gamer do portfólio. A ordem global continua em [PRIORIDADES_DESENVOLVIMENTO.md](./PRIORIDADES_DESENVOLVIMENTO.md).

## Transição atual

AgendaLeve e DocPronto concluíram a fase de implementação pesada. O WIP liberado passa para **Riot Legacy**, que deixa de ser apenas exploratório e entra como próximo projeto gamer a ser materializado e desenvolvido.

Primeiro objetivo do Riot Legacy:

1. [ ] repositório físico próprio;
2. [x] landing/perfil navegável em PT-BR e EN;
3. [x] entrada por Riot ID;
4. [x] primeira experiência visual de trajetória LoL + TFT;
5. [x] cards compartilháveis;
6. [x] espaços de anúncios planejados sem interromper a experiência;
7. [x] fallback demonstrativo claramente identificado;
8. [x] backend seguro reutilizando Supabase gamer ZeroTwo.gg;
9. [x] hidratação LoL + TFT por Edge Functions públicas;
10. [x] card exportável como PNG;
11. [ ] validar Riot IDs reais de LoL/TFT;
12. [ ] criar snapshots históricos reais;
13. [ ] repositório físico e GitHub Pages final.

## Produto transversal

### Riot Legacy — prioridade gamer #1
**Status atual:** desenvolvimento pesado ativo; LoL + TFT reais conectados pelo backend gamer, fallback resiliente, card PNG e Static QA + Browser E2E verdes.  
**Jogos:** League of Legends + TFT  
**Objetivo:** transformar o Riot ID em uma experiência visual, emocional e nostálgica.

Pilares:
- identidade;
- trajetória;
- maestria;
- favoritos;
- evolução;
- retrospectiva;
- compartilhamento.

O produto deve parecer um **museu pessoal da conta**, não um dashboard técnico.

---

## League of Legends

| Ordem LoL | Projeto | Prioridade global | Foco |
|---:|---|---:|---|
| 1 | **LoL Match Story** | 5 | contar visualmente uma partida |
| 2 | **LoL Champion Journey** | 9 | evolução com campeões e maestria |
| 3 | **LoL Session Insights** | 12 | comportamento ao longo de uma sessão |
| 4 | **LoL Champion Pool** | 16 | montar o melhor pool pessoal |
| 5 | **LoL Loss Explorer** | 21 | descobrir padrões de derrota |
| 6 | **LoL Role Mastery** | 24 | evolução por função |
| 7 | **LoL Challenge Hub** | 27 | challenges como metas/coleções |
| 8 | **LoL Comeback Index** | 30 | padrões de virada |
| 9 | **LoL Lane Lab** | 34 | análise dos primeiros minutos |
| 10 | **LoL Death Map** | 36 | visualização de padrões de morte |

### Direção visual LoL
Evitar aparência de tracker genérico. Priorizar:
- splash arts;
- hierarquia cinematográfica;
- destaques por campeão;
- timeline;
- cards compartilháveis;
- comparativos visuais;
- narrativa.

---

## Teamfight Tactics

| Ordem TFT | Projeto | Prioridade global | Foco |
|---:|---|---:|---|
| 1 | **TFT Wrapped** | 6 | retrospectiva pessoal |
| 2 | **TFT Board Museum** | 10 | galeria das melhores boards |
| 3 | **TFT Augment Memory** | 13 | histórico de augments |
| 4 | **TFT Item Lab** | 17 | itemização pessoal |
| 5 | **TFT Placement DNA** | 20 | perfil por colocação |
| 6 | **TFT Comp Evolution** | 22 | evolução de comps |
| 7 | **TFT Meta Journal** | 25 | diário pessoal por patch |
| 8 | **TFT Unit Journey** | 29 | história por unidade |
| 9 | **TFT Economy Review** | 32 | padrões de economia |
| 10 | **TFT Match Timeline** | 37 | reconstrução visual pós-partida |

### Direção visual TFT
Priorizar:
- tabuleiro;
- unidades;
- traits;
- augments;
- itens;
- composição final;
- narrativa de evolução da board;
- retrospectivas compartilháveis.

Evitar ferramentas que ditem decisões durante a partida. O foco deve permanecer em histórico, revisão e apresentação pós-jogo.

---

## Overwatch

| Ordem OW | Projeto | Prioridade global | Foco |
|---:|---|---:|---|
| 1 | **OW VOD Timeline** | 14 | revisão visual de vídeo |
| 2 | **OW Map Master** | 18 | mapas, rotas e posições |
| 3 | **OW Scrim Manager** | 23 | organização de times/scrims |
| 4 | **OW Improvement Roadmap** | 26 | plano de melhoria |
| 5 | **OW Hero Pool Builder** | 28 | pool complementar |
| 6 | **OW Hero Journal** | 31 | diário por herói |
| 7 | **OW Replay Notes** | 33 | notas e timestamps |
| 8 | **OW Ultimate Lab** | 35 | estudo de ultimates |
| 9 | **OW Teamfight Review** | 38 | reconstrução de lutas |
| 10 | **OW Crosshair Lab** | 39 | biblioteca/teste de crosshairs |

### Direção técnica Overwatch
Como o ecossistema de dados é mais limitado que o da Riot, priorizar produtos que funcionem bem com:
- input do usuário;
- VOD;
- replay;
- mapas;
- anotações;
- planejamento;
- conteúdo estruturado.

---

## Ordem de validação gamer

1. **Riot Legacy** — validar desejo por identidade/nostalgia.
2. **LoL Match Story** — validar narrativa de partida.
3. **TFT Wrapped** — validar compartilhamento recorrente.
4. **LoL Champion Journey** — aprofundar carreira/maestria.
5. **TFT Board Museum** — aprofundar memória visual.
6. **OW VOD Timeline** — provar o primeiro produto Overwatch.

Se esses seis funcionarem, os demais podem reutilizar componentes, autenticação, perfil, cards, histórico e design system.
