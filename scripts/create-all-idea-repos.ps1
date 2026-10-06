param(
  [switch]$Force,
  [switch]$Private
)

$ErrorActionPreference = "Stop"

$Owner = "HelioConde"
$Hub = "$Owner/ideias-ia-lab"
$VisibilityFlag = if ($Private) { "--private" } else { "--public" }

$Projects = @(
  @{ Rank=1;  Name="AgendaLeve"; Repo="agendaleve"; Area="SaaS"; Priority="P0"; Mode="existing"; Description="Agendamento para pequenos negocios com reservas e painel." },
  @{ Rank=2;  Name="DocPronto"; Repo="docpronto"; Area="SaaS"; Priority="P0"; Mode="existing"; Description="Propostas e orcamentos para prestadores de servico." },
  @{ Rank=3;  Name="Riot Legacy"; Repo="riot-legacy"; Area="LoL + TFT"; Priority="P0"; Mode="idea"; Description="Experiencia visual e nostalgica da trajetoria do jogador em LoL e TFT." },
  @{ Rank=4;  Name="VagaCerta"; Repo="vagacerta"; Area="Carreira"; Priority="P0"; Mode="split"; Branch="split/vagacerta"; Description="Organizador de candidaturas com funil, metricas e sincronizacao." },
  @{ Rank=5;  Name="LoL Match Story"; Repo="lol-match-story"; Area="LoL"; Priority="P0"; Mode="idea"; Description="Transforma partidas de League of Legends em historias visuais compartilhavéis." },
  @{ Rank=6;  Name="TFT Wrapped"; Repo="tft-personal-wrapped"; Area="TFT"; Priority="P0"; Mode="idea"; Description="Retrospectiva pessoal de TFT por semana, mes ou set." },
  @{ Rank=7;  Name="PostPilot"; Repo="postpilot"; Area="Criadores"; Priority="P1"; Mode="existing"; Description="Estudio de conteudo para criadores." },
  @{ Rank=8;  Name="MontaPC"; Repo="montapc"; Area="Hardware"; Priority="P1"; Mode="split"; Branch="split/montapc"; Description="Montador de PCs por orcamento com verificacoes de compatibilidade." },
  @{ Rank=9;  Name="LoL Champion Journey"; Repo="lol-champion-journey"; Area="LoL"; Priority="P1"; Mode="idea"; Description="Historia visual da evolucao do jogador com seus campeoes e maestrias." },
  @{ Rank=10; Name="TFT Board Museum"; Repo="tft-board-museum"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Galeria visual das melhores boards e composicoes do jogador." },
  @{ Rank=11; Name="Revisa"; Repo="revisa"; Area="Educacao"; Priority="P1"; Mode="split"; Branch="split/revisa"; Description="Plano de estudos com sessoes diarias, progresso e questoes." },
  @{ Rank=12; Name="LoL Session Insights"; Repo="lol-session-insights"; Area="LoL"; Priority="P1"; Mode="idea"; Description="Analisa padroes de comportamento ao longo de uma sessao de LoL." },
  @{ Rank=13; Name="TFT Augment Memory"; Repo="tft-augment-memory"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Historico pessoal de augments, combinacoes e resultados no TFT." },
  @{ Rank=14; Name="OW VOD Timeline"; Repo="ow-vod-timeline"; Area="Overwatch"; Priority="P1"; Mode="idea"; Description="Linha do tempo visual para revisao de VODs de Overwatch." },
  @{ Rank=15; Name="GameRadar"; Repo="gameradar"; Area="Games"; Priority="P1"; Mode="split"; Branch="split/gameradar"; Description="Wishlist e alertas de preco para jogos." },
  @{ Rank=16; Name="LoL Champion Pool"; Repo="lol-champion-pool"; Area="LoL"; Priority="P1"; Mode="idea"; Description="Constroi um pool de campeoes baseado no historico do jogador." },
  @{ Rank=17; Name="TFT Item Lab"; Repo="tft-item-lab"; Area="TFT"; Priority="P1"; Mode="idea"; Description="Laboratorio de itemizacao baseado no historico pessoal de TFT." },
  @{ Rank=18; Name="OW Map Master"; Repo="ow-map-master"; Area="Overwatch"; Priority="P1"; Mode="idea"; Description="Guia visual e interativo de mapas de Overwatch." },
  @{ Rank=19; Name="FalaPro"; Repo="falapro"; Area="Carreira"; Priority="P2"; Mode="split"; Branch="split/falapro"; Description="Treino guiado de entrevistas em ingles com feedback e historico." },
  @{ Rank=20; Name="TFT Placement DNA"; Repo="tft-placement-dna"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Perfil de jogo de TFT por faixa de colocacao." },
  @{ Rank=21; Name="LoL Loss Explorer"; Repo="lol-loss-explorer"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Agrupa derrotas de LoL e destaca padroes recorrentes." },
  @{ Rank=22; Name="TFT Comp Evolution"; Repo="tft-comp-evolution"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Mostra a evolucao pessoal de comps entre partidas e patches." },
  @{ Rank=23; Name="OW Scrim Manager"; Repo="ow-scrim-manager"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Organizador de scrims, times, resultados e preparacao." },
  @{ Rank=24; Name="LoL Role Mastery"; Repo="lol-role-mastery"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Arvore visual de evolucao e dominio por funcao em LoL." },
  @{ Rank=25; Name="TFT Meta Journal"; Repo="tft-meta-journal"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Diario pessoal de comps, notas, patches e resultados de TFT." },
  @{ Rank=26; Name="OW Improvement Roadmap"; Repo="ow-improvement-roadmap"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Plano estruturado de melhoria no Overwatch por objetivo." },
  @{ Rank=27; Name="LoL Challenge Hub"; Repo="lol-challenge-hub"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Reorganiza Challenges de LoL em metas, colecoes e progresso." },
  @{ Rank=28; Name="OW Hero Pool Builder"; Repo="ow-hero-pool-builder"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Monta um pool complementar de herois por funcao, mapa e preferencia." },
  @{ Rank=29; Name="TFT Unit Journey"; Repo="tft-unit-journey"; Area="TFT"; Priority="P2"; Mode="idea"; Description="Jornada pessoal e historico do jogador com cada unidade de TFT." },
  @{ Rank=30; Name="LoL Comeback Index"; Repo="lol-comeback-index"; Area="LoL"; Priority="P2"; Mode="idea"; Description="Identifica padroes das partidas que o jogador consegue virar." },
  @{ Rank=31; Name="OW Hero Journal"; Repo="ow-hero-journal"; Area="Overwatch"; Priority="P2"; Mode="idea"; Description="Diario de evolucao e aprendizado por heroi no Overwatch." },
  @{ Rank=32; Name="TFT Economy Review"; Repo="tft-economy-review"; Area="TFT"; Priority="P3"; Mode="idea"; Description="Revisao de decisoes de economia e ritmo em partidas de TFT." },
  @{ Rank=33; Name="OW Replay Notes"; Repo="ow-replay-notes"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Notas estruturadas e revisao manual de replays de Overwatch." },
  @{ Rank=34; Name="LoL Lane Lab"; Repo="lol-lane-lab"; Area="LoL"; Priority="P3"; Mode="idea"; Description="Laboratorio de aprendizado e revisao de fase de rotas em LoL." },
  @{ Rank=35; Name="OW Ultimate Lab"; Repo="ow-ultimate-lab"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Laboratorio educacional sobre ultimates, combinacoes e timing." },
  @{ Rank=36; Name="LoL Death Map"; Repo="lol-death-map"; Area="LoL"; Priority="P3"; Mode="idea"; Description="Mapa visual de mortes e padroes de risco do jogador em LoL." },
  @{ Rank=37; Name="TFT Match Timeline"; Repo="tft-match-timeline"; Area="TFT"; Priority="P3"; Mode="idea"; Description="Linha do tempo visual da evolucao de uma partida de TFT." },
  @{ Rank=38; Name="OW Teamfight Review"; Repo="ow-teamfight-review"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Revisao estruturada de teamfights de Overwatch." },
  @{ Rank=39; Name="OW Crosshair Lab"; Repo="ow-crosshair-lab"; Area="Overwatch"; Priority="P3"; Mode="idea"; Description="Laboratorio de miras, configuracoes e comparacao por heroi." },
  @{ Rank=40; Name="PratoPronto"; Repo="pratopronto"; Area="Consumo"; Priority="P3"; Mode="split"; Branch="split/pratopronto"; Description="Planejador semanal de refeicoes, orcamento e lista de compras." },
  @{ Rank=41; Name="Perto"; Repo="perto"; Area="Marketplace"; Priority="P3"; Mode="split"; Branch="split/perto"; Description="Marketplace local moderado de profissionais e pedidos privados." }
)

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Command '$Name' not found. Install it before continuing."
  }
}

function Test-GhSuccess {
  param([string[]]$GhArgs)

  $Previous = $ErrorActionPreference
  try {
    $ErrorActionPreference = "SilentlyContinue"
    & gh @GhArgs *> $null
    $Code = $LASTEXITCODE
  }
  catch {
    $Code = 1
  }
  finally {
    $ErrorActionPreference = $Previous
  }

  return ($Code -eq 0)
}

function Test-RepoExists {
  param([string]$FullRepo)
  return (Test-GhSuccess -GhArgs @("api", "repos/$FullRepo"))
}

function Test-MainBranchExists {
  param([string]$FullRepo)
  return (Test-GhSuccess -GhArgs @("api", "repos/$FullRepo/branches/main"))
}

function Test-PagesExists {
  param([string]$FullRepo)
  return (Test-GhSuccess -GhArgs @("api", "repos/$FullRepo/pages"))
}

function Get-ReadmeInfo {
  param([string]$FullRepo)

  for ($Attempt = 1; $Attempt -le 8; $Attempt++) {
    $Previous = $ErrorActionPreference
    try {
      $ErrorActionPreference = "SilentlyContinue"
      $Raw = & gh api "repos/$FullRepo/contents/README.md" 2>$null
      $Code = $LASTEXITCODE
    }
    catch {
      $Raw = $null
      $Code = 1
    }
    finally {
      $ErrorActionPreference = $Previous
    }

    if ($Code -eq 0 -and $Raw) {
      return ($Raw | ConvertFrom-Json)
    }

    Start-Sleep -Seconds 2
  }

  throw "README was not available for $FullRepo after repository creation."
}

function Set-IdeaReadme {
  param($Project, [string]$FullRepo)

  $Readme = @"
# $($Project.Name)

**Area:** $($Project.Area)
**Priority:** $($Project.Priority)
**Queue position:** #$($Project.Rank)

$($Project.Description)

## Status

Idea registered in the **Ideias IA Lab** portfolio. This repository is the independent workspace for research, prototype and product development.

## First-version goal

Build the smallest usable MVP that validates the central product idea before increasing scope.

## Minimum criteria before expanding

- usable MVP;
- main flow working;
- usable on mobile;
- authentication/data when needed;
- QA for critical flows;
- updated README;
- working deploy;
- explicit V2 backlog.

## Organization

Portfolio priority and decisions remain centralized at:

https://github.com/HelioConde/ideias-ia-lab

Product code must stay in this repository, not in the Lab.
"@

  $ReadmeInfo = Get-ReadmeInfo -FullRepo $FullRepo
  $Encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Readme))
  $Payload = @{
    message = "docs: initialize product repository"
    content = $Encoded
    sha = $ReadmeInfo.sha
    branch = "main"
  } | ConvertTo-Json -Compress

  $Payload | & gh api --method PUT "repos/$FullRepo/contents/README.md" --input - | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Could not initialize README for $FullRepo."
  }
}

Assert-Command "gh"
Assert-Command "git"

Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Cyan
& gh auth status
if ($LASTEXITCODE -ne 0) {
  throw "GitHub CLI is not authenticated. Run: gh auth login"
}

& gh auth setup-git | Out-Null

$TempRoot = Join-Path $env:TEMP ("ideias-ia-all-repos-" + [Guid]::NewGuid().ToString("N"))
$Created = 0
$Initialized = 0
$Preserved = 0

try {
  Write-Host "Cloning hub..." -ForegroundColor Cyan
  & git clone --quiet "https://github.com/$Hub.git" $TempRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Could not clone $Hub."
  }

  & git -C $TempRoot fetch --quiet origin "+refs/heads/split/*:refs/remotes/origin/split/*"
  if ($LASTEXITCODE -ne 0) {
    throw "Could not fetch split/* branches."
  }

  foreach ($Project in ($Projects | Sort-Object Rank)) {
    $FullRepo = "$Owner/$($Project.Repo)"
    Write-Host ""
    Write-Host ("[{0:00}/41] {1} -> {2}" -f $Project.Rank, $Project.Name, $FullRepo) -ForegroundColor Green

    if ($Project.Mode -eq "existing") {
      if (Test-RepoExists $FullRepo) {
        Write-Host "Existing repository preserved."
        $Preserved++
        continue
      }

      Write-Warning "Repository marked as existing was not found: $FullRepo. It will be created as an idea repository."
      $Project.Mode = "idea"
    }

    if ($Project.Mode -eq "split") {
      $RemoteRef = "refs/remotes/origin/$($Project.Branch)"
      $RefSpec = $RemoteRef + ":refs/heads/main"

      & git -C $TempRoot show-ref --verify --quiet $RemoteRef
      if ($LASTEXITCODE -ne 0) {
        throw "Standalone branch not found: $($Project.Branch)"
      }

      $Exists = Test-RepoExists $FullRepo
      if (-not $Exists) {
        & gh repo create $FullRepo $VisibilityFlag --description $Project.Description --disable-wiki
        if ($LASTEXITCODE -ne 0) {
          throw "Could not create $FullRepo."
        }
        $Created++
      }
      elseif ((Test-MainBranchExists $FullRepo) -and -not $Force) {
        Write-Warning "main already exists and was preserved. Use -Force only if you intentionally want to replace it."
        $Preserved++
        continue
      }

      $PushArgs = @("-C", $TempRoot, "push", "https://github.com/$FullRepo.git", $RefSpec)
      if ($Force) {
        $PushArgs += "--force"
      }

      & git @PushArgs
      if ($LASTEXITCODE -ne 0) {
        throw "Could not push $($Project.Branch) to $FullRepo."
      }

      & gh api --method PATCH "repos/$FullRepo" -f "default_branch=main" | Out-Null
      if ($LASTEXITCODE -ne 0) {
        Write-Warning "Could not set main as default branch for $FullRepo."
      }

      & gh repo edit $FullRepo --description $Project.Description --homepage "https://$($Owner.ToLower()).github.io/$($Project.Repo)/" | Out-Null
      if ($LASTEXITCODE -ne 0) {
        Write-Warning "Could not update description/homepage for $FullRepo."
      }

      $PagesPayload = @{
        source = @{
          branch = "main"
          path = "/"
        }
      } | ConvertTo-Json -Compress

      if (Test-PagesExists $FullRepo) {
        $PagesPayload | & gh api --method PUT "repos/$FullRepo/pages" --input - | Out-Null
      }
      else {
        $PagesPayload | & gh api --method POST "repos/$FullRepo/pages" --input - | Out-Null
      }

      if ($LASTEXITCODE -ne 0) {
        Write-Warning "Repository was created, but GitHub Pages may need manual activation: $FullRepo."
      }

      $Initialized++
      Write-Host "Standalone code pushed."
      continue
    }

    if ($Project.Mode -eq "idea") {
      if (Test-RepoExists $FullRepo) {
        Write-Host "Repository already exists; current contents preserved."
        $Preserved++
        continue
      }

      & gh repo create $FullRepo $VisibilityFlag --description $Project.Description --disable-wiki --add-readme
      if ($LASTEXITCODE -ne 0) {
        throw "Could not create $FullRepo."
      }

      $Created++
      Set-IdeaReadme -Project $Project -FullRepo $FullRepo
      $Initialized++
      Write-Host "Repository created with initial README."
    }
  }

  Write-Host ""
  Write-Host "Done." -ForegroundColor Green
  Write-Host "Created: $Created"
  Write-Host "Initialized/updated: $Initialized"
  Write-Host "Preserved: $Preserved"
}
finally {
  if (Test-Path $TempRoot) {
    Remove-Item -Recurse -Force $TempRoot
  }
}
