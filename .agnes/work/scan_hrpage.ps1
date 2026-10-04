$l = Get-Content "D:\My Project\M-BE\Marixa-ChamCong\ChamCong\src\modules\admin\hr\pages\HrPage.jsx" -Encoding UTF8
$patterns = @('tab','hr-tab','active =','resigned =','const list','hr-note','clearQuickChip','setStatus','STATUS_LABELS')
for ($i = 0; $i -lt $l.Count; $i++) {
    if ($l[$i] -match 'tab|hr-tab|resigned|const list|hr-note') {
        Write-Host (($i+1) -as [string]).PadRight(4) + ' | ' + $l[$i].Trim()
    }
}
