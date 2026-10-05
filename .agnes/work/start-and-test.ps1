Get-Process -Name 'M.API' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 2
Set-Content -Path 'D:\Monica\M-ChamCong\.agnes\work\api-debug.log' -Value ''
$proc = Start-Process -FilePath 'dotnet' -ArgumentList 'run','--project','D:\Monica\M-ChamCong\M.API','--no-build','--profile','http' -WindowStyle Hidden -PassThru -RedirectStandardOutput 'D:\Monica\M-ChamCong\.agnes\work\api-debug.log' -RedirectStandardError 'D:\Monica\M-ChamCong\.agnes\work\api-debug-err.log'
Start-Sleep 14
Write-Output ('API pid: ' + $proc.Id)
$token = Get-Content 'D:\Monica\M-ChamCong\.agnes\work\token.txt' -Raw
try {
  $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5022/api/Attendance/by-employee/c0000000-0000-0000-0000-000000000001' -Headers @{ Authorization = 'Bearer ' + $token } -UseBasicParsing -TimeoutSec 10
  Write-Output ('STATUS: ' + [int]$r.StatusCode)
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    $sr = [System.IO.StreamReader]::new($resp.GetResponseStream())
    Write-Output ('STATUS: ' + [int]$resp.StatusCode + ' BODY: ' + $sr.ReadToEnd())
  } else { Write-Output ('ERR: ' + $_.Exception.Message) }
}
Start-Sleep 2
Write-Output '=== ERR LOG (last 50) ==='
Get-Content 'D:\Monica\M-ChamCong\.agnes\work\api-debug-err.log' -ErrorAction SilentlyContinue | Select-Object -Last 50
Write-Output '=== OUT LOG (error/exception) ==='
Get-Content 'D:\Monica\M-ChamCong\.agnes\work\api-debug.log' -ErrorAction SilentlyContinue | Select-String -Pattern 'error|exception|Exception|at M\.' | Select-Object -Last 40
