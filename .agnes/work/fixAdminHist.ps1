$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\admin\attendance\pages\AdminAttendanceHistoryPage.jsx"
$lines = [IO.File]::ReadAllLines($f, [Text.UTF8Encoding]::new($false))

# ---- locate anchors (0-based) ----
$thStart = -1   # thead "<th>Nhân viên</th>"
$tdIdx   = -1   # tbody actualHours cell
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($thStart -lt 0 -and $lines[$i] -match '<th>Nhân viên</th>') { $thStart = $i }
    if ($lines[$i] -match 'row\.actualHours') { $tdIdx = $i; break }
}
if ($thStart -lt 0 -or $tdIdx -lt 0) { Write-Host ("anchors NOT ok thStart=$thStart tdIdx=$tdIdx"); exit 1 }

# thead insertion point = after "<th>Giờ thực</th>" (thStart+4)
$insTh = $thStart + 4
$thIndent = $lines[$insTh].Substring(0, $lines[$insTh].IndexOf('<'))
$newTh1 = "$thIndent<th>Ảnh vào ca</th>"
$newTh2 = "$thIndent<th>Ảnh ra ca</th>"

# tbody insertion point = after the actualHours <td> (tdIdx)
$tdIndent = $lines[$tdIdx].Substring(0, $lines[$tdIdx].IndexOf('<'))
$newTd1 = "$tdIndent<td><PhotoCell src={row.checkInPhoto} alt=`"Vào ca`" /></td>"
$newTd2 = "$tdIndent<td><PhotoCell src={row.checkOutPhoto} alt=`"Ra ca`" /></td>"

# ---- build result as a growable list of strings (safe cast) ----
$result = [System.Collections.Generic.List[string]]::new()
for ($i = 0; $i -le $insTh; $i++) { $result.Add($lines[$i]) }
$result.Add($newTh1); $result.Add($newTh2)
for ($i = $insTh + 1; $i -le $tdIdx; $i++) { $result.Add($lines[$i]) }
$result.Add($newTd1); $result.Add($newTd2)
for ($i = $tdIdx + 1; $i -lt $lines.Count; $i++) { $result.Add($lines[$i]) }

# colSpan 7 -> 9 (now 9 columns)
for ($i = 0; $i -lt $result.Count; $i++) {
    if ($result[$i] -match 'colSpan=\{7\}') { $result[$i] = $result[$i] -replace 'colSpan=\{7\}', 'colSpan={9}' }
}

$blob = [string]::Join("`r`n", $result) + "`r`n"
[IO.File]::WriteAllText($f, $blob, [Text.UTF8Encoding]::new($false))
Write-Host ("written. lines=" + $result.Count)
$check = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))
Write-Host ("photoTh=" + ([regex]::Matches($check,'Ảnh vào ca')).Count)
Write-Host ("photoTdIn=" + ([regex]::Matches($check,'row.checkInPhoto')).Count)
Write-Host ("photoTdOut=" + ([regex]::Matches($check,'row.checkOutPhoto')).Count)
Write-Host ("colSpan9=" + ([regex]::Matches($check,'colSpan=\{9\}')).Count)
