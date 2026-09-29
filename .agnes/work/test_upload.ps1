$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok.txt' -Raw).Trim()
$jpg = 'D:\Monica\M-ChamCong\.agnes\work\test-shot.jpg'
# Minimal valid JPEG bytes (SOI + JFIF + EOI)
$bytes = [byte[]](0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,0xFF,0xD9)
[IO.File]::WriteAllBytes($jpg, $bytes)

$hdr = @{ Authorization = 'Bearer ' + $tok }
$resp = Invoke-WebRequest -Uri 'https://localhost:7038/api/Upload/photo?type=checkin' -Method POST -Headers $hdr -Form @{ file = Get-Item $jpg } -UseBasicParsing -TimeoutSec 20
Write-Host ('HTTP ' + $resp.StatusCode)
Write-Host $resp.Content
