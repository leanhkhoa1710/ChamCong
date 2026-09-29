$f = "D:\Monica\M-ChamCong\M.Services\Mapping\AttendanceMapping.cs"
$lines = [IO.File]::ReadAllLines($f)
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'entity\.CheckInPhoto = model\.CheckInPhoto;') {
        $ind = $lines[$i].Substring(0, $lines[$i].IndexOf('entity'))
        # Guard: keep existing photos unless a new one is supplied (admin
        # edit without a photo must not wipe the photo already on record).
        $newLines = @(
            "$ind// keep existing photo unless a new one is supplied",
            "$indif (!string.IsNullOrWhiteSpace(model.CheckInPhoto))",
            "$ind    entity.CheckInPhoto = model.CheckInPhoto;",
            "$indif (!string.IsNullOrWhiteSpace(model.CheckOutPhoto))",
            "$ind    entity.CheckOutPhoto = model.CheckOutPhoto;"
        )
        $before = $lines[0..($i-1)]
        $after  = $lines[($i+2)..($lines.Count-1)]   # skip old CheckIn(i)+CheckOut(i+1)
        $result = $before + $newLines + $after
        $blob = [string]::Join("`n", $result) + "`n"
        [IO.File]::WriteAllText($f, $blob, [Text.UTF8Encoding]::new($false))
        Write-Host "replaced at index $i; new lines=" + $result.Count
        break
    }
}
