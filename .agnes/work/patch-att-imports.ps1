$ErrorActionPreference = "Stop"
$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\admin\attendance\pages\AdminAttendanceHistoryPage.jsx"
$lines = Get-Content -LiteralPath $f
$out = New-Object System.Collections.Generic.List[string]
$nl = if ((Get-Content -LiteralPath $f -Raw).Contains("`r`n")) { "`r`n" } else { "`n" }
$seen = $false
foreach ($l in $lines) {
    $out.Add($l)
    if (-not $seen -and $l -match 'import \{ statusLabel') {
        # nothing
    }
    if (-not $seen -and $l -match 'from "\.\./\.\./\.\./\.\./utils/vnTime"') {
        $out.Add('import { toCsv, downloadCsv } from "../../hr/hrUtils";')
        $out.Add('import { getAuth } from "../../../../services/auth/auth";')
        $seen = $true
    }
}
[System.IO.File]::WriteAllText($f, ($out -join $nl))
Write-Output "OK-imports"
