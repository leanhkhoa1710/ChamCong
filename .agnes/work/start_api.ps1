$ErrorActionPreference = "Continue"
$exe = "D:\My Project\M-BE\Marixa-ChamCong\M.API\bin\Debug\net8.0\M.API.exe"
$wd  = "D:\My Project\M-BE\Marixa-ChamCong\M.API"
$out = "D:\My Project\M-BE\Marixa-ChamCong\.agnes\work\api-out.log"
$err = "D:\My Project\M-BE\Marixa-ChamCong\.agnes\work\api-err.log"

# Dừng instance cũ nếu còn
Get-NetTCPConnection -LocalPort 7038 -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) { Stop-Process -Id $proc.Id -Force; Write-Host "Killed old pid " + $proc.Id }
    }

Start-Process -FilePath $exe -WorkingDirectory $wd -WindowStyle Hidden `
    -RedirectStandardOutput $out -RedirectStandardError $err

for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 2
    $conn = Get-NetTCPConnection -LocalPort 7038 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $proc = Get-Process -Id $conn[0].OwningProcess -ErrorAction SilentlyContinue
        Write-Host ("LISTENING after {0}s pid={1} ({2})" -f (($i+1)*2), $conn[0].OwningProcess, $proc.ProcessName)
        exit 0
    }
}
Write-Host "NOT LISTENING after 40s. Logs:"
Get-Content $out -Tail 30 -ErrorAction SilentlyContinue
Get-Content $err -Tail 30 -ErrorAction SilentlyContinue
