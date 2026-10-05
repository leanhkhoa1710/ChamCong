$ErrorActionPreference = "Stop"
$utf8 = [System.Text.Encoding]::UTF8

# Correct "Nhân viên" = N h â n (space) v i ê n
#   â = U+00E2 = C3 A2 ;  ê = U+00EA = C3 AA
$correct = [byte[]](0x4E,0x68,0xC3,0xA2,0x6E,0x20,0x76,0x69,0xC3,0xAA,0x6E)

function ReplaceBytes($path, [byte[]]$find, [byte[]]$repl) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $text  = [System.Text.Encoding]::UTF8.GetString($bytes)
    $fStr  = [System.Text.Encoding]::UTF8.GetString($find)
    $rStr  = [System.Text.Encoding]::UTF8.GetString($repl)
    $count = [regex]::Matches($text, [regex]::Escape($fStr)).Count
    if ($count -eq 0) { Write-Output ("  NOT FOUND in " + (Split-Path $path -Leaf)); return }
    $text = $text.Replace($fStr, $rStr)
    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($text))
    Write-Output ("  Fixed " + (Split-Path $path -Leaf) + " (" + $count + " occurrence) -> " + $rStr)
}

# 1) HrEmployeeTable: broken label = N h ậ n (space) v ê n   (4E 68 E1BEAD 6E 20 76 C3AA 6E)
$hr = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\hr\components\HrEmployeeTable.jsx"
$hrBad = [byte[]](0x4E,0x68,0xE1,0xBE,0xAD,0x6E,0x20,0x76,0xC3,0xAA,0x6E)
ReplaceBytes $hr $hrBad $correct

# 2) accounts: broken label = N h ậ n (space) v i ê n  (4E 68 E1BEAD 6E 20 76 69 C3AA 6E)
$ac = "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\accounts\pages\AccountIssuancePage.jsx"
$acBad = [byte[]](0x4E,0x68,0xE1,0xBE,0xAD,0x6E,0x20,0x76,0x69,0xC3,0xAA,0x6E)
ReplaceBytes $ac $acBad $correct
