$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok3.txt' -Raw).Trim()
$d = 'D:\Monica\M-ChamCong\.agnes\work'
$assets = '[{"assetType":"PC","assetCode":"TS-PC-001","condition":"Tot","note":""}]'
$projects = '[{"projectCode":"DA-001","projectName":"Site","partner":"X","progress":50,"documents":[],"handoverFiles":[]}]'
$meta = '[]'
Set-Content -Path "$d\assets.json" -Value $assets -NoNewline -Encoding ascii
Set-Content -Path "$d\projects.json" -Value $projects -NoNewline -Encoding ascii
Set-Content -Path "$d\meta.json" -Value $meta -NoNewline -Encoding ascii

Write-Host "=== TEST /EmployeeHandover/request (multipart via files, clean binding) ==="
curl.exe -s -X POST "https://localhost:7038/api/EmployeeHandover/request" -k `
  -H "Authorization: Bearer $tok" `
  -F "LastWorkingDate=2026-10-15" `
  -F "Reason=Test binding" `
  -F "AssetsJson=<$d\assets.json" `
  -F "ProjectsJson=<$d\projects.json" `
  -F "AttachmentMetadataJson=<$d\meta.json"
Write-Host ""
