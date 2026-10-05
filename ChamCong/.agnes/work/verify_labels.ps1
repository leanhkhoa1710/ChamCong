$ErrorActionPreference = "Stop"
$utf8 = [System.Text.Encoding]::UTF8
$correct = $utf8.GetString([byte[]](0x4E,0x68,0xC3,0xA2,0x6E,0x20,0x76,0x69,0xC3,0xAA,0x6E))  # "Nhân viên"
$files = @(
    "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\hr\components\HrEmployeeTable.jsx",
    "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\employees\accounts\pages\AccountIssuancePage.jsx"
)
foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    $ok = $text.Contains($correct)
    Write-Output ("{0} : contains correct '{1}' = {2}" -f (Split-Path $f -Leaf), $correct, $ok)
}
