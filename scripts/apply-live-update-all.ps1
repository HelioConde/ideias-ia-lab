param(
  [int]$DelaySeconds = 5
)

$ErrorActionPreference = "Stop"

$Owner = "HelioConde"
$Hub = "$Owner/ideias-ia-lab"

$Repos = @(
  "agendaleve","docpronto","riot-legacy","vagacerta","lol-match-story",
  "tft-personal-wrapped","postpilot","montapc","lol-champion-journey",
  "tft-board-museum","revisa","lol-session-insights","tft-augment-memory",
  "ow-vod-timeline","gameradar","lol-champion-pool","tft-item-lab",
  "ow-map-master","falapro","tft-placement-dna","lol-loss-explorer",
  "tft-comp-evolution","ow-scrim-manager","lol-role-mastery",
  "tft-meta-journal","ow-improvement-roadmap","lol-challenge-hub",
  "ow-hero-pool-builder","tft-unit-journey","lol-comeback-index",
  "ow-hero-journal","tft-economy-review","ow-replay-notes",
  "lol-lane-lab","ow-ultimate-lab","lol-death-map","tft-match-timeline",
  "ow-teamfight-review","ow-crosshair-lab","pratopronto","perto"
)

function Assert-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Command '$Name' not found."
  }
}

function Test-RepoExists {
  param([string]$FullRepo)
  $old = $ErrorActionPreference
  try {
    $ErrorActionPreference = "SilentlyContinue"
    & gh api "repos/$FullRepo" *> $null
    return ($LASTEXITCODE -eq 0)
  }
  catch {
    return $false
  }
  finally {
    $ErrorActionPreference = $old
  }
}

Assert-Command "gh"
Assert-Command "git"

& gh auth status
if ($LASTEXITCODE -ne 0) {
  throw "Run: gh auth login"
}
& gh auth setup-git | Out-Null

$Root = Join-Path $env:TEMP ("ideias-live-update-" + [Guid]::NewGuid().ToString("N"))
$HubDir = Join-Path $Root "hub"

try {
  New-Item -ItemType Directory -Path $Root -Force | Out-Null

  Write-Host "Downloading live-update templates..." -ForegroundColor Cyan
  & git clone --quiet --depth 1 "https://github.com/$Hub.git" $HubDir
  if ($LASTEXITCODE -ne 0) {
    throw "Could not clone $Hub."
  }

  $LiveRuntime = Get-Content (Join-Path $HubDir "templates/live-update.js") -Raw
  $LiveVersion = Get-Content (Join-Path $HubDir "templates/live-version.yml") -Raw
  $LiveQa = Get-Content (Join-Path $HubDir "templates/live-update-qa.yml") -Raw

  foreach ($RepoName in $Repos) {
    $FullRepo = "$Owner/$RepoName"

    Write-Host ""
    Write-Host "==> $FullRepo" -ForegroundColor Green

    if (-not (Test-RepoExists $FullRepo)) {
      Write-Host "Repository does not exist yet. Skipped."
      continue
    }

    $RepoDir = Join-Path $Root $RepoName
    & git clone --quiet --depth 1 "https://github.com/$FullRepo.git" $RepoDir
    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Could not clone $FullRepo. Skipped."
      continue
    }

    $HtmlFiles = Get-ChildItem -Path $RepoDir -Filter "*.html" -File -Recurse |
      Where-Object { $_.FullName -notmatch "[\\/]\.git[\\/]" }

    if ($HtmlFiles.Count -eq 0) {
      Write-Host "No HTML pages yet. Rule will apply when pages are created."
      Remove-Item -Recurse -Force $RepoDir
      continue
    }

    [IO.File]::WriteAllText(
      (Join-Path $RepoDir "live-update.js"),
      $LiveRuntime,
      (New-Object Text.UTF8Encoding($false))
    )

    $WorkflowDir = Join-Path $RepoDir ".github/workflows"
    New-Item -ItemType Directory -Path $WorkflowDir -Force | Out-Null

    [IO.File]::WriteAllText(
      (Join-Path $WorkflowDir "live-version.yml"),
      $LiveVersion,
      (New-Object Text.UTF8Encoding($false))
    )

    [IO.File]::WriteAllText(
      (Join-Path $WorkflowDir "live-update-qa.yml"),
      $LiveQa,
      (New-Object Text.UTF8Encoding($false))
    )

    $HeadSha = (& git -C $RepoDir rev-parse HEAD).Trim()
    $VersionJson = '{"sha":"' + $HeadSha + '","publishedAt":"' + (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ") + '"}'
    [IO.File]::WriteAllText(
      (Join-Path $RepoDir "version.json"),
      $VersionJson + [Environment]::NewLine,
      (New-Object Text.UTF8Encoding($false))
    )

    foreach ($Html in $HtmlFiles) {
      $Content = Get-Content $Html.FullName -Raw
      if ($Content -notmatch 'live-update\.js') {
        if ($Content -match '</body>') {
          $Content = $Content -replace '</body>', '  <script src="live-update.js" defer></script>' + [Environment]::NewLine + '</body>'
        }
        else {
          $Content += [Environment]::NewLine + '<script src="live-update.js" defer></script>' + [Environment]::NewLine
        }

        [IO.File]::WriteAllText(
          $Html.FullName,
          $Content,
          (New-Object Text.UTF8Encoding($false))
        )
      }
    }

    & git -C $RepoDir add .
    & git -C $RepoDir diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
      Write-Host "Already compliant."
      Remove-Item -Recurse -Force $RepoDir
      continue
    }

    & git -C $RepoDir config user.name "HelioConde"
    & git -C $RepoDir config user.email "actions@users.noreply.github.com"
    & git -C $RepoDir commit -m "feat: enable automatic live version updates" | Out-Null
    & git -C $RepoDir push origin main

    if ($LASTEXITCODE -ne 0) {
      Write-Warning "Push failed for $FullRepo. Existing files were not removed remotely."
    }
    else {
      Write-Host "Live update applied."
      Start-Sleep -Seconds $DelaySeconds
    }

    Remove-Item -Recurse -Force $RepoDir
  }

  Write-Host ""
  Write-Host "Rollout finished." -ForegroundColor Green
}
finally {
  if (Test-Path $Root) {
    Remove-Item -Recurse -Force $Root -ErrorAction SilentlyContinue
  }
}
