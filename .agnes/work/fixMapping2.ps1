$f = "D:\Monica\M-ChamCong\M.Services\Mapping\AttendanceMapping.cs"
$lines = [IO.File]::ReadAllLines($f)
$fixed = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*\(.*IsNullOrWhiteSpace\(model\.CheckInPhoto\)\)\s*$') {
        $lines[$i] = "            if (!string.IsNullOrWhiteSpace(model.CheckInPhoto))"
        $fixed++
    }
    elseif ($lines[$i] -match '^\s*\(.*IsNullOrWhiteSpace\(model\.CheckOutPhoto\)\)\s*$') {
        $lines[$i] = "            if (!string.IsNullOrWhiteSpace(model.CheckOutPhoto))"
        $fixed++
    }
}
$blob = [string]::Join("`n", $lines) + "`n"
[IO.File]::WriteAllText($f, $blob, [Text.UTF8Encoding]::new($false))
Write-Host "repaired lines: $fixed"
$check = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))
Write-Host ("if CheckIn guard: " + ([regex]::Matches($check, 'if \(!string\.IsNullOrWhiteSpace\(model\.CheckInPhoto\)\)').Count))
Write-Host ("if CheckOut guard: " + ([regex]::Matches($check, 'if \(!string\.IsNullOrWhiteSpace\(model\.CheckOutPhoto\)\)').Count))
