$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\attendance\components\AttendanceCard.jsx"
$lines = [IO.File]::ReadAllLines($f)
$idx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'photoUrl = up\.data\.data;') { $idx = $i; break }
}
if ($idx -lt 0) { Write-Host "line not found"; exit 1 }
$ind = $lines[$idx].Substring(0, $lines[$idx].TrimStart().Length)
$repl = @("photoUrl = up.data?.data;",
         "if (!photoUrl) {",
         "    // upload that bai -> bao loi, khong cham cong im lang voi anh rong",
         "    throw new Error(up.data?.message || 'Khong tai duoc anh.');",
         "}")
# keep CRLF; preserve the same indentation for the block
$block = $repl -join [Environment]::NewLine
$block = ($block -replace "\n","`r`n")
$before = $lines[0..($idx-1)]
$after  = $lines[($idx+1)..($lines.Count-1)]
$result = @($before) + @($block) + @($after)
# write CRLF
$out = [string]::Join("`r`n", $result) + "`r`n"
[IO.File]::WriteAllText($f, $out, [Text.UTF8Encoding]::new($false))
Write-Host "patched line $($idx+1)"
$check = [IO.File]::ReadAllText($f)
Write-Host ("guard present: " + ($check -match 'photoUrl = up\.data\?\.data;'))
Write-Host ("throw present: " + ($check -match 'throw new Error\(up\.data'))
