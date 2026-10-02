$tok = (Get-Content 'D:\Monica\M-ChamCong\.agnes\work\tok3.txt' -Raw).Trim()
$d = 'D:\Monica\M-ChamCong\.agnes\work'
# PascalCase to prove the case-sensitivity theory
Set-Content "$d\p2.json" '[{"ProjectCode":"DA-001","ProjectName":"Site","Partner":"X","Progress":50,"Documents":[],"HandoverFiles":[]}]' -NoNewline -Encoding ascii
Set-Content "$d\a2.json" '[{"AssetType":"PC","AssetCode":"TS-PC-001","Condition":"Tot","Note":""}]' -NoNewline -Encoding ascii
Write-Host "=== PascalCase JSON test ==="
curl.exe -s -w "`nHTTP %{http_code}`n" -X POST 'https://localhost:7038/api/EmployeeHandover/request' -k `
    -H "Authorization: Bearer $tok" `
    -F "LastWorkingDate=2026-10-15" `
    -F "Reason=Case test" `
    -F "AssetsJson=<$($d)\a2.json" `
    -F "ProjectsJson=<$($d)\p2.json" `
    -F "AttachmentMetadataJson=[]"
