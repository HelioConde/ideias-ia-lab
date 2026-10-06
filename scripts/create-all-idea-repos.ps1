param(
  [switch]$Force,
  [switch]$Private
)

$ErrorActionPreference = "Stop"

$Owner = "HelioConde"
$Hub = "$Owner/ideias-ia-lab"
$VisibilityFlag = if ($Private) { "--private" } else { "--public" }

$Projects = @(
  @{ Rank=1;  Name="AgendaLeve"; Repo="agendaleve"; Area="SaaS"; Priority="P0"; Mode="existing"; Description="Agendamento para pequenos negócios com reservas e painel." },
  @{ Rank=2;  Name="DocPronto"; Repo="docpronto"; Area="SaaS"; Priority="P0"; Mode="existing"; Description="Propostas e orçamentos para prestadores de serviço." },
  @{ Rank=3;  Name="Riot Legacy"; Repo="riot-legacy"; Area="LoL + TFT"; Priority="P0"; Mode="idea"; Description="Experiência visual e nostálgica da trajetória do jogador em LoL e TFT." },
  @{ Rank=4;  Name="VagaCerta"; Repo="vagacerta"; Area="Carreira"; Priority="P0"; Mode="split"; Branch="split/vagacerta"; Description="Organizador de candidaturas com funil, métricas e sincronização." },
  @{ Rank=5;  Name="LoL Match Story"; Repo="lol-match-story"; Area="LoL"; Priority="P0"; Mode="idea"; Description="Transforma partidas de League of Legends em histórias visuais compartilháveis." },
  @{ Rank=6;  Name="TFT Wrapped"; Repo="tft-personal-wrapped"; Area="TFT"; Priority="P0"; Mode="idea"; Description="Retrospectiva pessoal de TFT por semana, mês ou set." },
  @{ Rank=7;  Name="PostPilot"; Repo="postpilot"; Area="Criadores"; Priority="P1"; Mode="existing"; Description="Estúdio de conteúdo para criadores." },
  @{ Rank=8;  Name="MontaPC"; Repo="montapc"; Area="Hardware"; Priority="P1"; Mode="split"; Branch="split/montapc"; Description="Montador de PCs por orçamento com verificações de compatibilidade." },
  @{ Rank=9;  Name="LoL Champion Journey"; Repo="lol-champion-journey"; Area="LoL"; Priority="P1"; Mode="idea"; Description="História visual da evolução do jogador com seus campeões e maestrias." },
  @{ Rank=10; Name="TFT Board Museum"; Repo="tft-board-museum"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Galeria visual das melhores boards e composições do jogador." },
  @{ Rank=11; Name="Revisa"; Repo="revisa"; Area="Educação"; Priority="P1"; Mode="split"; Branch="split/revisa"; Description="Plano de estudos com sessões diárias, progresso e questões." },
  @{ Rank=12; Name="LoL Session Insights"; Repo="lol-session-insights"; Area="LoL"; Priority="P1"; Mode="idea"; Description="Analisa padrões de comportamento ao longo de uma sessão de LoL." },
  @{ Rank=13; Name="TFT Augment Memory"; Repo="tft-augment-memory"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Histórico pessoal de augments, combinações e resultados no TFT." },
  @{ Rank=14; Name="OW VOD Timeline"; Repo="ow-vod-timeline"; Area="Overwatch"; Priority="P1"; Mode="idea"; Description="Linha do tempo visual para revisão de VODs de Overwatch." },
  @{ Rank=15; Name="GameRadar"; Repo="gameradar"; Area="Games"; Priority="P1"; Mode="split"; Branch="split/gameradar"; Description="Wishlist e alertas de preço para jogos." },
  @{ Rank=16; Name="LoL Champion Pool"; Repo="lol-champion-pool"; Area="LoL"; Priority="P1"; Mode="idea"; Description="Constrói um pool de campeões baseado no histórico do jogador." },
  @{ Rank=17; Name="TFT Item Lab"; Repo="tft-item-lab"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Laboratório de itemização baseado no histórico pessoal de TFT." },
  @{ Rank=18; Name="OW Map Master"; Repo="ow-map-master"; Area="Overwatch"; Priority="P1"; Mode="idea"; Description="Guia visual e interativo de mapas de Overwatch." },
  @{ Rank=19; Name="FalaPro"; Repo="falapro"; Area="Carreira"; Priority="P2"; Mode="split"; Branch="split/falapro"; Description="Treino guiado de entrevistas em inglês com feedback e histórico." },
  @{ Rank=20; Name="TFT Placement DNA"; Repo="tft-placement-dna"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Perfil de jogo de TFT por faixa de colocação." },
  @{ Rank=21; Name="LoL Loss Explorer"; Repo="lol-loss-explorer"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Agrupa derrotas de LoL e destaca padrões recorrentes." },
  @{ Rank=22; Name="TFT Comp Evolution"; Repo="tft-comp-evolution"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Mostra a evolução pessoal de comps entre partidas e patches." },
  @{ Rank=23; Name="OW Scrim Manager"; Repo="ow-scrim-manager"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Organizador de scrims, times, resultados e preparação." },
  @{ Rank=24; Name="LoL Role Mastery"; Repo="lol-role-mastery"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Árvore visual de evolução e domínio por função em LoL." },
  @{ Rank=25; Name="TFT Meta Journal"; Repo="tft-meta-journal"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Diário pessoal de comps, notas, patches e resultados de TFT." },
  @{ Rank=26; Name="OW Improvement Roadmap"; Repo="ow-improvement-roadmap"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Plano estruturado de melhoria no Overwatch por objetivo." },
  @{ Rank=27; Name="LoL Challenge Hub"; Repo="lol-challenge-hub"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Reorganiza Challenges de LoL em metas, coleções e progresso." },
  @{ Rank=28; Name="OW Hero Pool Builder"; Repo="ow-hero-pool-builder"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Monta um pool complementar de heróis por função, mapa e preferência." },
  @{ Rank=29; Name="TFT Unit Journey"; Repo="tft-unit-journey"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Jornada pessoal e histórico do jogador com cada unidade de TFT." },
  @{ Rank=30; Name="LoL Comeback Index"; Repo="lol-comeback-index"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Identifica padrões das partidas que o jogador consegue virar." },
  @{ Rank=31; Name="OW Hero Journal"; Repo="ow-hero-journal"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Diário de evolução e aprendizado por herói no Overwatch." },
  @{ Rank=32; Name="TFT Economy Review"; Repo="tft-economy-review"; Area="TFT"; Priority="P3"; Mode="idea"; Description="Revisão de decisões de economia e ritmo em partidas de TFT." },
  @{ Rank=33; Name="OW Replay Notes"; Repo="ow-replay-notes"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Notas estruturadas e revisão manual de replays de Overwatch." },
  @{ Rank=34; Name="LoL Lane Lab"; Repo="lol-lane-lab"; Area="LoL"; Priority="P3"; Mode="idea"; Description="Laboratório de aprendizado e revisão de fase de rotas em LoL." },
  @{ Rank=35; Name="OW Ultimate Lab"; Repo="ow-ultimate-lab"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Laboratório educacional sobre ultimates, combinações e timing." },
  @{ Rank=36; Name="LoL Death Map"; Repo="lol-death-map"; Area="LoL"; Priority="P3"; Mode="idea"; Description="Mapa visual de mortes e padrões de risco do jogador em LoL." },
  @{ Rank=37; Name="TFT Match Timeline"; Repo="tft-match-timeline"; Area="TFT"; Priority="P3"; Mode="idea"; Description="Linha do tempo visual da evolução de uma partida de TFT." },
  @{ Rank=38; Name="OW Teamfight Review"; Repo="ow-teamfight-review"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Revisão estruturada de teamfights de Overwatch." },
  @{ Rank=39; Name="OW Crosshair Lab"; Repo="ow-crosshair-lab"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Laboratório de miras, configurações e comparação por herói." },
  @{ Rank=40; Name="PratoPronto"; Repo="pratopronto"; Area="Consumo"; Priority="P3"; Mode="split"; Branch="split/pratopronto"; Description="Planejador semanal de refeições, orçamento e lista de compras." },
  @{ Rank=41; Name="Perto"; Repo="perto"; Area="Marketplace"; Priority="P3"; Mode="split"; Branch="split/perto"; Description="Marketplace local moderado de profissionais e pedidos privados." }
)

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Comando '$Name' não encontrado. Instale-o antes de continuar."
  }
}

function Test-RepoExists {
  param([string]$FullRepo)
  & gh repo view $FullRepo --json name 2>$null | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Set-IdeaReadme {
  param($Project, [string]$FullRepo)

  $Readme = @"
# $($Project.Name)

**Área:** $($Project.Area)  
**Prioridade:** $($Project.Priority)  
**Posição na fila:** #$($Project.Rank)

$($Project.Description)

## Status

Ideia registrada no portfólio **Ideias IA Lab**. Este repositório é o espaço independente para pesquisa, protótipo e desenvolvimento do produto.

## Objetivo da primeira versão

Criar o menor MVP realmente utilizável que valide a proposta central antes de ampliar escopo.

## Critérios mínimos antes de avançar

- MVP navegável;
- fluxo principal funcional;
- mobile utilizável;
- autenticação/dados quando necessários;
- QA dos fluxos críticos;
- README atualizado;
- deploy funcional;
- backlog explícito para V2.

## Organização

A prioridade e decisões de portfólio continuam centralizadas em:

https://github.com/HelioConde/ideias-ia-lab

O código deste produto deve permanecer neste repositório, não no Lab.
"@

  $ReadmeInfo = & gh api "repos/$FullRepo/contents/README.md" | ConvertFrom-Json
  if ($LASTEXITCODE -ne 0) {
    throw "Não foi possível ler README de $FullRepo."
  }

  $Encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Readme))
  $Payload = @{
    message = "docs: initialize product repository"
    content = $Encoded
    sha = $ReadmeInfo.sha
    branch = "main"
  } | ConvertTo-Json -Compress

  $Payload | & gh api --method PUT "repos/$FullRepo/contents/README.md" --input - | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Não foi possível inicializar README de $FullRepo."
  }
}

Assert-Command "gh"
Assert-Command "git"

Write-Host "Verificando autenticação do GitHub CLI..." -ForegroundColor Cyan
& gh auth status
if ($LASTEXITCODE -ne 0) {
  throw "GitHub CLI não está autenticado. Execute: gh auth login"
}

& gh auth setup-git | Out-Null

$TempRoot = Join-Path $env:TEMP ("ideias-ia-all-repos-" + [Guid]::NewGuid().ToString("N"))
$Created = 0
$Initialized = 0
$Preserved = 0

try {
  Write-Host "Clonando o hub..." -ForegroundColor Cyan
  & git clone --quiet "https://github.com/$Hub.git" $TempRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao clonar $Hub."
  }

  & git -C $TempRoot fetch --quiet origin "+refs/heads/split/*:refs/remotes/origin/split/*"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao buscar as branches split/*."
  }

  foreach ($Project in ($Projects | Sort-Object Rank)) {
    $FullRepo = "$Owner/$($Project.Repo)"
    Write-Host ""
    Write-Host ("[{0:00}/41] {1} -> {2}" -f $Project.Rank, $Project.Name, $FullRepo) -ForegroundColor Green

    if ($Project.Mode -eq "existing") {
      if (Test-RepoExists $FullRepo) {
        Write-Host "Repositório ativo preservado."
        $Preserved++
        continue
      }
      else {
        Write-Warning "Repositório marcado como existente não foi encontrado: $FullRepo. Será criado como ideia inicial."
        $Project.Mode = "idea"
      }
    }

    if ($Project.Mode -eq "split") {
      $RemoteRef = "refs/remotes/origin/$($Project.Branch)"
      $RefSpec = $RemoteRef + ":refs/heads/main"

      & git -C $TempRoot show-ref --verify --quiet $RemoteRef
      if ($LASTEXITCODE -ne 0) {
        throw "Branch standalone ausente: $($Project.Branch)"
      }

      $Exists = Test-RepoExists $FullRepo
      if (-not $Exists) {
        & gh repo create $FullRepo $VisibilityFlag --description $Project.Description --disable-wiki
        if ($LASTEXITCODE -ne 0) {
          throw "Falha ao criar $FullRepo."
        }
        $Created++
      }
      else {
        & gh api "repos/$FullRepo/branches/main" 2>$null | Out-Null
        $MainExists = ($LASTEXITCODE -eq 0)
        if ($MainExists -and -not $Force) {
          Write-Warning "main já existe; preservado. Use -Force somente se quiser substituir."
          $Preserved++
          continue
        }
      }

      $PushArgs = @("-C", $TempRoot, "push", "https://github.com/$FullRepo.git", $RefSpec)
      if ($Force) { $PushArgs += "--force" }

      & git @PushArgs
      if ($LASTEXITCODE -ne 0) {
        throw "Falha ao enviar $($Project.Branch) para $FullRepo."
      }

      & gh api --method PATCH "repos/$FullRepo" -f "default_branch=main" | Out-Null
      & gh repo edit $FullRepo --description $Project.Description --homepage "https://$($Owner.ToLower()).github.io/$($Project.Repo)/" | Out-Null

      $PagesPayload = @{
        source = @{ branch = "main"; path = "/" }
      } | ConvertTo-Json -Compress

      & gh api "repos/$FullRepo/pages" 2>$null | Out-Null
      if ($LASTEXITCODE -eq 0) {
        $PagesPayload | & gh api --method PUT "repos/$FullRepo/pages" --input - | Out-Null
      }
      else {
        $PagesPayload | & gh api --method POST "repos/$FullRepo/pages" --input - | Out-Null
      }

      $Initialized++
      Write-Host "Código standalone enviado."
      continue
    }

    if ($Project.Mode -eq "idea") {
      if (Test-RepoExists $FullRepo) {
        Write-Host "Repositório já existe; conteúdo atual preservado."
        $Preserved++
        continue
      }

      & gh repo create $FullRepo $VisibilityFlag --description $Project.Description --disable-wiki --add-readme
      if ($LASTEXITCODE -ne 0) {
        throw "Falha ao criar $FullRepo."
      }

      $Created++
      Set-IdeaReadme -Project $Project -FullRepo $FullRepo
      $Initialized++
      Write-Host "Repositório criado com README inicial."
    }
  }

  Write-Host ""
  Write-Host "Concluído." -ForegroundColor Green
  Write-Host "Criados: $Created"
  Write-Host "Inicializados/atualizados: $Initialized"
  Write-Host "Preservados: $Preserved"
}
finally {
  if (Test-Path $TempRoot) {
    Remove-Item -Recurse -Force $TempRoot
  }
}
