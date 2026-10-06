# MontaPC — arquitetura fullstack

Repositório individual planejado: `HelioConde/montapc`.

## Produto

Montador de PC por orçamento com recomendação automática, troca manual de peças e explicações de compatibilidade.

## Backend compartilhado

Supabase `pizzaria-db`.

Tabelas:
- `montapc_components`: catálogo público de peças.
- `montapc_builds`: builds privadas do usuário.
- `montapc_build_items`: componentes ligados à build.
- `product_subscriptions`.

O catálogo é leitura pública; builds e itens pertencem ao usuário e são protegidos por RLS.

## Implementado

- catálogo inicial com 23 peças;
- preços internos marcados como `reference_estimate`, nunca como preço ao vivo;
- CPUs AM4, AM5 e LGA1700;
- placas-mãe DDR4/DDR5;
- GPUs para faixas 1080p/1440p;
- RAM, SSD, fontes, gabinetes e cooler;
- geração automática por orçamento;
- perfis Jogos, Produtividade e Uso misto;
- alvos 1080p, 1440p e 4K;
- estratégias Equilíbrio, FPS, Upgrade e Economia;
- verificação explicada de socket;
- verificação DDR4/DDR5;
- verificação formato placa-mãe/gabinete;
- verificação de comprimento de GPU de referência;
- verificação altura do cooler;
- detecção de CPU que precisa de cooler separado;
- cálculo de potência mínima recomendada para a fonte;
- ajuste manual de qualquer componente;
- salvamento local sem conta;
- Supabase Auth;
- salvamento de build e itens na nuvem;
- abertura e exclusão de builds;
- importação local → conta;
- migração dos rascunhos do protótipo antigo;
- UI própria responsiva;
- CI dedicado.

## Regra de preço

Os valores atuais do catálogo são referências internas datadas e servem para validar o produto. O frontend mostra explicitamente que:

- não são preços de loja em tempo real;
- medidas físicas devem ser confirmadas para o SKU exato;
- nenhuma URL afiliada é apresentada atualmente.

Quando houver integração comercial, o preço ao vivo deve ficar separado do preço de referência, com fonte e data de atualização.

## Próximas entregas

- integração permitida com preços reais por loja;
- histórico de preço por componente;
- catálogo maior com SKU exato e dimensões por fabricante;
- placa-mãe ATX e Mini-ITX;
- mais coolers e gabinetes;
- regras de conectores PCIe/12VHPWR;
- número de slots M.2/SATA;
- clearance de radiador;
- estimativa de desempenho por jogo;
- alternativas equivalentes quando uma peça sair de estoque;
- links afiliados claramente identificados.

## Monetização

Afiliados, posições patrocinadas claramente rotuladas e recursos premium de comparação/histórico.

## QA obrigatório

- socket incompatível;
- DDR4 em placa DDR5 e vice-versa;
- fonte abaixo da recomendação;
- GPU maior que o gabinete;
- cooler obrigatório ausente;
- orçamento abaixo do mínimo;
- orçamento muito alto;
- preço ausente;
- componente inativo;
- exclusão e reabertura de build;
- isolamento RLS entre usuários;
- mobile;
- transparência de preço estimado e afiliados.
