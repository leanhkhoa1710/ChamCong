$f = "D:\Monica\M-ChamCong\ChamCong\src\modules\attendance\components\AttendanceCard.jsx"
$text = [IO.File]::ReadAllText($f, [Text.UTF8Encoding]::new($false))
$needle = "relatedApi.uploadPhoto(pendingPhoto)"
$replace = "relatedApi.uploadPhoto(pendingPhoto, type === 1 ? `"checkin`" : `"checkout`")"
if ($text.Contains($needle)) {
    $text = $text.Replace($needle, $replace)
    [IO.File]::WriteAllText($f, $text, [Text.UTF8Encoding]::new($false))
    Write-Host "OK"
} else {
    Write-Host "NOT FOUND"
}
