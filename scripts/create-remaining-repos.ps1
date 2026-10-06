param(
  [switch]$Private,
  [int]$DelaySeconds = 10
)

$ErrorActionPreference = "Stop"

$Owner = "HelioConde"
$Hub = "$Owner/ideias-ia-lab"

$Remaining = @(
  @{ Rank=38; Name="OW Teamfight Review"; Repo="ow-teamfight-review"; Mode="idea"; Description="Revisao estruturada de teamfights de Overwatch." },
  @{ Rank=39; Name="OW Crosshair Lab"; Repo="ow-crosshair-lab"; Mode="idea"; Description="Laboratorio de miras, configuracoes e comparacao por heroi." },
  @{ Rank=40; Name="PratoPronto"; Repo="pratopronto"; Mode="split"; Branch="split/pratopronto"; Description="Planejador semanal de refeicoes, orcamento e lista de compras." },
  @{ Rank=41; Name="Perto"; Repo="perto"; Mode="split"; Branch="split/perto"; Description="Marketplace local moderado de profissionais e pedidos privados." }
)

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Command '$Name' not found."
  }
}

function Invoke-GhApi {
  param(
    [string]$Method,
    [string]$Endpoint,
    [hashtable]$Body = $null
  )

  $OutFile = [IO.Path]::GetTempFileName()
  $ErrFile = [IO.Path]::GetTempFileName()
  $InFile = $null

  try {
    $Args = @("api", "--method", $Method, $Endpoint)

    if ($Body -ne $null) {
      $InFile = [IO.Path]::GetTempFileName()
      $Json = $Body | ConvertTo-Json -Depth 10 -Compress
      [IO.File]::WriteAllText($InFile, $Json, (New-Object Text.UTF8Encoding($false)))
      $Args += @("--input", $InFile)
    }

    $Process = Start-Process -FilePath "gh.exe" -ArgumentList $Args -Wait -PassThru -NoNewWindow -RedirectStandardOutput $OutFile -RedirectStandardError $ErrFile

    $StdOut = if (Test-Path $OutFile) { Get-Content $OutFile -Raw -ErrorAction SilentlyContinue } else { "" }
    $StdErr = if (Test-Path $ErrFile) { Get-Content $ErrFile -Raw -ErrorAction SilentlyContinue } else { "" }
    $Combined = (($StdOut + [Environment]::NewLine + $StdErr).Trim())

    return [pscustomobject]@{
      Success = ($Process.ExitCode -eq 0)
      ExitCode = $Process.ExitCode
      Output = $Combined
      RateLimited = ($Combined -match "secondary rate limit|temporarily blocked from content creation|HTTP 403|HTTP 429|retry-after")
    }
  }
  finally {
    foreach ($File in @($OutFile, $ErrFile, $InFile)) {
      if ($File -and (Test-Path $File)) {
        Remove-Item -Force $File -ErrorAction SilentlyContinue
      }
    }
  }
}

function Test-RepoExists {
  param([string]$FullRepo)
  $Result = Invoke-GhApi -Method "GET" -Endpoint "repos/$FullRepo"
  return $Result.Success
}

function Create-Repo {
  param($Project)

  $Body = @{
    name = $Project.Repo
    description = $Project.Description
    private = [bool]$Private
    has_wiki = $false
    auto_init = ($Project.Mode -eq "idea")
  }

  return (Invoke-GhApi -Method "POST" -Endpoint "user/repos" -Body $Body)
}

Assert-Command "gh"
Assert-Command "git"

Write-Host "Checking GitHub authentication..." -ForegroundColor Cyan
& gh auth status
if ($LASTEXITCODE -ne 0) {
  throw "Run: gh auth login"
}

$TempRoot = Join-Path $env:TEMP ("ideias-ia-final-four-" + [Guid]::NewGuid().ToString("N"))

try {
  Write-Host "Cloning hub..." -ForegroundColor Cyan
  & git clone --quiet "https://github.com/$Hub.git" $TempRoot
  if ($LASTEXITCODE -ne 0) {
    throw "Could not clone $Hub."
  }

  & git -C $TempRoot fetch --quiet origin "+refs/heads/split/*:refs/remotes/origin/split/*"
  if ($LASTEXITCODE -ne 0) {
    throw "Could not fetch split branches."
  }

  foreach ($Project in $Remaining) {
    $FullRepo = "$Owner/$($Project.Repo)"

    Write-Host ""
    Write-Host ("[{0}/41] {1} -> {2}" -f $Project.Rank, $Project.Name, $FullRepo) -ForegroundColor Green

    if (Test-RepoExists $FullRepo) {
      Write-Host "Repository already exists. Preserved."
      continue
    }

    Write-Host "Creating repository..."
    $Create = Create-Repo -Project $Project

    if (-not $Create.Success) {
      if ($Create.RateLimited) {
        Write-Warning "GitHub is still blocking content creation with a secondary rate limit."
        if ($Create.Output) {
          Write-Host $Create.Output
        }
        Write-Warning "Progress was preserved. Stop here and run this same script again after the block is lifted."
        exit 0
      }

      throw "Could not create $FullRepo. GitHub response: $($Create.Output)"
    }

    Write-Host "Repository created."
    Start-Sleep -Seconds $DelaySeconds

    if ($Project.Mode -eq "split") {
      $RemoteRef = "refs/remotes/origin/$($Project.Branch)"
      $RefSpec = $RemoteRef + ":refs/heads/main"

      & git -C $TempRoot show-ref --verify --quiet $RemoteRef
      if ($LASTEXITCODE -ne 0) {
        throw "Standalone branch not found: $($Project.Branch)"
      }

      Write-Host "Pushing standalone code..."
      & git -C $TempRoot push "https://github.com/$FullRepo.git" $RefSpec
      if ($LASTEXITCODE -ne 0) {
        throw "Repository exists, but code push failed for $FullRepo. Re-running this script is safe."
      }

      Write-Host "Standalone code pushed."
      Start-Sleep -Seconds $DelaySeconds
    }
  }

  Write-Host ""
  Write-Host "All four remaining repositories are created." -ForegroundColor Green
  Write-Host "Pages can be configured later in a separate pass."
}
finally {
  if (Test-Path $TempRoot) {
    Remove-Item -Recurse -Force $TempRoot -ErrorAction SilentlyContinue
  }
}
