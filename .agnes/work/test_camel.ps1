$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok3.txt' -Raw).Trim()
$d = 'D:\Monica\M-ChamCong\.agnes\work'
# camelCase - exactly what the React app sends
Set-Content "$d\ac.json" '[{"assetType":"PC","assetCode":"TS-PC-001","condition":"Tốt","note":""}]' -NoNewline -Encoding UTF8
Set-Content "$d\pc.json" '[{"projectCode":"DA-001","projectName":"Site","partner":"X","progress":50,"documents":[],"handoverFiles":[]}]' -NoNewline -Encoding UTF8
Set-Content "$d\mc.json" '[]' -NoNewline -Encoding UTF8
Write-Host "=== camelCase /EmployeeHandover/request ==="
curl.exe -s -w "`nHTTP %{http_code}`n" -X POST 'https://localhost:7038/api/EmployeeHandover/request' -k `
    -H "Authorization: Bearer $tok" `
    -F "LastWorkingDate=2026-10-15" `
    -F "Reason=Camel binding test" `
    -F "AssetsJson=<$($d)\ac.json" `
    -F "ProjectsJson=<$($d)\pc.json" `
    -F "AttachmentMetadataJson=<$($d)\mc.json"
Write-Host ""
Write-Host "=== resulting row (should show a new Pending handover) ==="
sqlcmd -S "(localdb)\MSSQLLocalDB" -d Monica_001 -W -Q "SELECT TOP 2 Id, EmployeeId, Status, SUBSTRING(AssetsJson,1,60) ajson, SUBSTRING(ProjectsJson,1,80) pjson FROM EmployeeHandovers ORDER BY CreatedTime DESC"
