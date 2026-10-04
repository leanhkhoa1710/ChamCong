# Kiểm tra trước khi patch
cd "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src"
Write-Host "=== files dung HrKpiCards ==="
Get-ChildItem -Recurse -Include *.jsx,*.js | Select-String -Pattern "HrKpiCards" -List | ForEach-Object { $_.Path }
Write-Host "=== HrFilterBar lines 1-24 (props) ==="
$lines = Get-Content "modules\admin\hr\components\HrFilterBar.jsx" -Encoding UTF8
$lines | Select-Object -First 24
Write-Host "=== HrFilterBar chip block (lines quanh 'kpiLabel') ==="
$idx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "kpiLabel") { $idx = $i; break }
}
if ($idx -ge 0) {
    $start = [Math]::Max($idx-1, 0); $end = [Math]::Min($idx+12, $lines.Count-1)
    $lines | Select-Object -Skip $start -First ($end - $start + 1)
} else { Write-Host "khi khong co kpiLabel" }
Write-Host "=== hr.css: .hr-tab.active block ==="
$c = Get-Content "modules\admin\hr\hr.css" -Encoding UTF8
$j = -1
for ($i = 0; $i -lt $c.Count; $i++) {
    if ($c[$i] -match "^\.hr-tab\.active") { $j = $i; break }
}
if ($j -ge 0) {
    $c | Select-Object -Skip $j -First 5
}
