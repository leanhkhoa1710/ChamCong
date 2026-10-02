$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok3.txt' -Raw).Trim()
$d = 'D:\Monica\M-ChamCong\.agnes\work'
Set-Content "$d\ac.json" '[{"assetType":"PC","assetCode":"TS-PC-001","condition":"Tt","note":""}]' -NoNewline -Encoding ascii
Set-Content "$d\pc.json" '[{"projectCode":"DA-1","projectName":"Site","partner":"X","progress":50,"documents":[],"handoverFiles":[]}]' -NoNewline -Encoding ascii
Set-Content "$d\mc.json" '[]' -NoNewline -Encoding ascii
Write-Host "=== camelCase /request against running API (pid 11644) ==="
curl.exe -s -w "`nHTTP %{http_code}`n" -X POST 'https://localhost:7038/api/EmployeeHandover/request' -k `
    -H "Authorization: Bearer $tok" `
    -F "LastWorkingDate=2026-10-20" `
    -F "Reason=Verify camel binding" `
    -F "AssetsJson=<$($d)\ac.json" `
    -F "ProjectsJson=<$($d)\pc.json" `
    -F "AttachmentMetadataJson=<$($d)\mc.json"
Write-Host ""
Write-Host "=== which M.API binary is pid 11644? ==="
Get-CimInstance Win32_Process -Filter "ProcessId=11644" | Select-Object -ExpandProperty CommandLine
