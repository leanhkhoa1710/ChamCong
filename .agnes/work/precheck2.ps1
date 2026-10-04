$base = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr"
Write-Host "=== chip block in HrFilterBar (can 'kpiLabel &&') ==="
$lines = Get-Content "$base\components\HrFilterBar.jsx" -Encoding UTF8
$found = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "kpiLabel &&") {
        $start = [Math]::Max($i-1, 0); $end = [Math]::Min($i+11, $lines.Count-1)
        $lines | Select-Object -Skip $start -First ($end - $start + 1)
        $found = $true
        break
    }
}
if (-not $found) { Write-Host "KHONG THAY block chip {kpiLabel && (" }

function Test-Crlf {
    param($p)
    $raw = [System.IO.File]::ReadAllBytes($p)
    $hasCrlf = $false; $hasLf = $false
    for ($i = 0; $i -lt $raw.Count - 1; $i++) {
        if ($raw[$i] -eq 10) { $hasLf = $true }
        if ($raw[$i] -eq 13 -and $raw[$i+1] -eq 10) { $hasCrlf = $true }
    }
    Write-Host ("  " + (Split-Path $p -Leaf) + " => CRLF:" + $hasCrlf + " LF-only:" + (-not $hasCrlf))
}
Write-Host "=== line endings ==="
Test-Crlf "$base\pages\HrPage.jsx"
Test-Crlf "$base\components\HrFilterBar.jsx"
Test-Crlf "$base\hr.css"
Test-Crlf "$base\components\HrKpiCards.jsx"
