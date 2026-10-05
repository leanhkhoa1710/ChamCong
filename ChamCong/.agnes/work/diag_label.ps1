$ErrorActionPreference = "Stop"
$utf8 = [System.Text.Encoding]::UTF8

# Correct "Nhân viên" = N h â n (space) v i ê n
# â = U+00E2 = C3 A2 ; ê = U+00EA = C3 AA
$correct = $utf8.GetString([byte[]](0x4E,0x68,0xC3,0xA2,0x6E,0x20,0x76,0x69,0xC3,0xAA,0x6E))
Write-Output ("Correct label = [" + $correct + "] bytes=" + ([BitConverter]::ToString([byte[]](0x4E,0x68,0xC3,0xA2,0x6E,0x20,0x76,0x69,0xC3,0xAA,0x6E)) -replace '-',' '))
Write-Output ""

$files = @{
    "employees (HrEmployeeTable)"  = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\hr\components\HrEmployeeTable.jsx"
    "statistics"                    = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\attendance\pages\EmployeeStatisticsPage.jsx"
    "contracts (AdminContractPage)" = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\contracts\pages\AdminContractPage.jsx"
    "accounts"                      = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\accounts\pages\AccountIssuancePage.jsx"
}

foreach ($name in ($files.Keys | Sort-Object)) {
    $path = $files[$name]
    $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    # Find any <th>...</th> that is the employee header (contains 'N' + 'viên'-like, or 'NV')
    $lines = $text -split "`r?`n"
    Write-Output ("=== " + $name + " ===")
    for ($i=0; $i -lt $lines.Count; $i++) {
        $ln = $lines[$i]
        if ($ln -match '<th>' -and $ln -match 'N') {
            # only header lines that look like the employee column
            if ($ln -match '<th>[^<]{1,20}</th>' -and $ln.Trim() -match '<th>\s*\S.*\s*</th>') {
                $b = $utf8.GetBytes($ln.Trim())
                Write-Output ("L" + ($i+1) + ": " + $ln.Trim())
                Write-Output ("    bytes=" + ([BitConverter]::ToString($b) -replace '-',' '))
            }
        }
    }
    Write-Output ""
}
