$ErrorActionPreference = "Continue"
$exe = "D:\My Project\M-BE\Marixa-ChamCong\M.API\bin\Debug\net8.0\M.API.exe"
$wd  = "D:\My Project\M-BE\Marixa-ChamCong\M.API"
$out = "D:\My Project\M-BE\Marixa-ChamCong\.agnes\work\api-out.log"
$err = "D:\My Project\M-BE\Marixa-ChamCong\.agnes\work\api-err.log"

# 1) Tắt TẤT CẢ process M.API còn sống
Get-Process -Name "M.API" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host ("Killing M.API pid={0}" -f $_.Id)
    Stop-Process -Id $_.Id -Force
}
Start-Sleep -Seconds 3

# 2) Chờ cho port 5000 + 7038 rảnh
foreach ($port in 5000, 7038) {
    $tries = 0
    while ((Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) -and $tries -lt 10) {
        Get-Process | Where-Object { $_.ProcessName -eq "M.API" } | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        $tries++
    }
}

# 3) Khởi động bản build mới
Start-Process -FilePath $exe -WorkingDirectory $wd -WindowStyle Hidden `
    -RedirectStandardOutput $out -RedirectStandardError $err

for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 2
    $conn = Get-NetTCPConnection -LocalPort 7038 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $proc = Get-Process -Id $conn[0].OwningProcess -ErrorAction SilentlyContinue
        Write-Host ("7038 LISTENING pid={0} ({1})" -f $conn[0].OwningProcess, $proc.ProcessName)
        exit 0
    }
}
Write-Host "NOT LISTENING after 40s. Last logs:"
Get-Content $out -Tail 15 -ErrorAction SilentlyContinue
Get-Content $err -Tail 15 -ErrorAction SilentlyContinue
