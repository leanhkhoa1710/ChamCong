$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok3.txt' -Raw).Trim()
$d = 'D:\Monica\M-ChamCong\.agnes\work'
Set-Content "$d\a.json" '[{"assetType":"PC","assetCode":"TS-PC-001","condition":"Tot","note":""}]' -NoNewline -Encoding ascii
Set-Content "$d\p.json" '[{"projectCode":"DA-001","projectName":"Site","partner":"X","progress":50,"documents":[],"handoverFiles":[]}]' -NoNewline -Encoding ascii
Set-Content "$d\m.json" '[]' -NoNewline -Encoding ascii
Write-Host "files: a=$(Test-Path "$d\a.json") p=$(Test-Path "$d\p.json") m=$(Test-Path "$d\m.json")"
Write-Host "=== POST /EmployeeHandover/request (clean multipart) ==="
curl.exe -s -w "`nHTTP %{http_code}`n" -X POST 'https://localhost:7038/api/EmployeeHandover/request' -k `
    -H "Authorization: Bearer $tok" `
    -F "LastWorkingDate=2026-10-15" `
    -F "Reason=Test binding ok" `
    -F "AssetsJson=<$($d)\a.json" `
    -F "ProjectsJson=<$($d)\p.json" `
    -F "AttachmentMetadataJson=<$($d)\m.json"
Write-Host ""
Write-Host "=== verify created row in DB ==="
sqlcmd -S "(localdb)\MSSQLLocalDB" -d Monica_001 -W -Q "SELECT TOP 3 Id, EmployeeId, Status, LEN(AssetsJson) ajson, LEN(ProjectsJson) pjson FROM EmployeeHandovers ORDER BY CreatedTime DESC"
