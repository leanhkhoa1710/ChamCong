$file = 'ChamCong\src\modules\employees\employee.css'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$css = @'
.att-form-modal {
    max-height: calc(100vh - 96px);
    overflow: auto;
}

.att-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.att-form-row label {
    min-width: 0;
}
'@
$existing = [System.IO.File]::ReadAllText($file, $utf8)
if ($existing -notmatch 'att-form-row') {
    if (-not $existing.EndsWith("`n")) { $existing += "`n" }
    $existing += "`n" + $css + "`n"
    [System.IO.File]::WriteAllText($file, $existing, $utf8)
    Write-Output 'css appended'
} else {
    Write-Output 'css already present'
}
