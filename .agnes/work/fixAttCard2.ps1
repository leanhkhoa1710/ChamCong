$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\attendance\components\AttendanceCard.jsx"
$lines = [IO.File]::ReadAllLines($f, [Text.UTF8Encoding]::new($false))
# Find line "photoUrl = up.data.data;"
$idx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'photoUrl = up\.data\.data;') { $idx = $i; break }
}
if ($idx -lt 0) { Write-Host "NOT FOUND"; exit 1 }

# Replace the single line with the safer version (null check + throw)
$ind = $lines[$idx].Substring(0, $lines[$idx].IndexOf('photoUrl'))
$news = @(
    "$indphotoUrl = up.data?.data;",
    "$indif (!photoUrl) {",
    "$ind    // Upload thiet bai -> bao loi, khong cham cong im lang voi anh rong.",
    "$ind    throw new Error(up.data?.message || `\"Không tải được ảnh chụp.`\");",
    "$ind}"
)
$before = $lines[0..($idx-1)]
$after  = $lines[($idx+1)..($lines.Count-1)]
$result = $before + $news + $after
$blob = [string]::Join("`r`n", $result) + "`r`n"
[IO.File]::WriteAllText($f, $blob, [Text.UTF8Encoding]::new($false))
Write-Host "replaced at line $($idx+1)"
# verify
$check = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))
Write-Host ("photoUrl data?.data: " + ([regex]::Matches($check,'photoUrl = up\.data\?\.data;')).Count)
Write-Host ("throw new Error: " + ([regex]::Matches($check,'throw new Error')).Count)
