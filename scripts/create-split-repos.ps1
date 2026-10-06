param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$Owner = "HelioConde"
$Hub = "$Owner/ideias-ia-lab"

$Projects = @(
  @{ Repo = "vagacerta";   Branch = "split/vagacerta";   Description = "Organizador de candidaturas com funil, métricas e sincronização." },
  @{ Repo = "falapro";     Branch = "split/falapro";     Description = "Treino guiado de entrevistas em inglês com feedback e histórico." },
  @{ Repo = "montapc";     Branch = "split/montapc";     Description = "Montador de PCs por orçamento com verificações de compatibilidade." },
  @{ Repo = "gameradar";   Branch = "split/gameradar";   Description = "Wishlist e alertas de preço para jogos." },
  @{ Repo = "perto";       Branch = "split/perto";       Description = "Marketplace local moderado de profissionais e pedidos privados." },
  @{ Repo = "pratopronto"; Branch = "split/pratopronto"; Description = "Planejador semanal de refeições, orçamento e lista de compras." },
  @{ Repo = "revisa";      Branch = "split/revisa";      Description = "Plano de estudos com sessões diárias, progresso e questões." }
)

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Comando '$Name' não encontrado. Instale-o antes de continuar."
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
if ($LASTEXITCODE -ne 0) {
  throw "Não foi possível configurar o Git para usar a autenticação do GitHub CLI."
}

$TempRoot = Join-Path $env:TEMP ("ideias-ia-split-" + [Guid]::NewGuid().ToString("N"))

try {
  Write-Host "Clonando o hub em $TempRoot..." -ForegroundColor Cyan
  & git clone --quiet "https://github.com/$Hub.git" $TempRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao clonar $Hub."
  }

  & git -C $TempRoot fetch --quiet origin "+refs/heads/split/*:refs/remotes/origin/split/*"
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao buscar as branches split/*."
  }

  foreach ($Project in $Projects) {
    $RepoName = $Project.Repo
    $Branch = $Project.Branch
    $FullRepo = "$Owner/$RepoName"
    $RemoteRef = "refs/remotes/origin/$Branch"
    $RefSpec = $RemoteRef + ":refs/heads/main"
    $PageUrl = "https://$($Owner.ToLower()).github.io/$RepoName/"

    Write-Host ""
    Write-Host "==> $FullRepo" -ForegroundColor Green

    & git -C $TempRoot show-ref --verify --quiet $RemoteRef
    if ($LASTEXITCODE -ne 0) {
      throw "Branch '$Branch' não encontrada no hub."
    }

    & gh repo view $FullRepo --json name 2>$null | Out-Null
    $RepoExists = ($LASTEXITCODE -eq 0)

    if (-not $RepoExists) {
      Write-Host "Criando repositório público..."
      & gh repo create $FullRepo --public --description $Project.Description --disable-wiki
      if ($LASTEXITCODE -ne 0) {
        throw "Falha ao criar $FullRepo."
      }
    }
    else {
      Write-Host "Repositório já existe."

      & gh api "repos/$FullRepo/branches/main" 2>$null | Out-Null
      $MainExists = ($LASTEXITCODE -eq 0)

      if ($MainExists -and -not $Force) {
        Write-Warning "$FullRepo já possui branch main. Para substituir explicitamente, execute o script com -Force."
        continue
      }
    }

    $PushArgs = @("-C", $TempRoot, "push", "https://github.com/$FullRepo.git", $RefSpec)
    if ($Force) {
      $PushArgs += "--force"
    }

    Write-Host "Enviando $Branch como main..."
    & git @PushArgs
    if ($LASTEXITCODE -ne 0) {
      throw "Falha ao enviar a branch para $FullRepo."
    }

    & gh api --method PATCH "repos/$FullRepo" -f "default_branch=main" | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Não foi possível confirmar main como branch padrão em $FullRepo."
    }

    & gh repo edit $FullRepo --description $Project.Description --homepage $PageUrl | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Não foi possível atualizar descrição/homepage de $FullRepo."
    }

    $PagesPayload = @{
      source = @{
        branch = "main"
        path = "/"
      }
    } | ConvertTo-Json -Compress

    & gh api "repos/$FullRepo/pages" 2>$null | Out-Null
    $PagesExists = ($LASTEXITCODE -eq 0)

    if ($PagesExists) {
      $PagesPayload | & gh api --method PUT "repos/$FullRepo/pages" --input - | Out-Null
    }
    else {
      $PagesPayload | & gh api --method POST "repos/$FullRepo/pages" --input - | Out-Null
    }

    if ($LASTEXITCODE -eq 0) {
      Write-Host "Pages configurado: $PageUrl" -ForegroundColor Cyan
    }
    else {
      Write-Warning "O repositório foi criado e enviado, mas o Pages precisa ser habilitado manualmente."
    }
  }

  Write-Host ""
  Write-Host "Migração concluída." -ForegroundColor Green
  Write-Host "Depois, valide os Actions e o Pages de cada repositório."
}
finally {
  if (Test-Path $TempRoot) {
    Remove-Item -Recurse -Force $TempRoot
  }
}
