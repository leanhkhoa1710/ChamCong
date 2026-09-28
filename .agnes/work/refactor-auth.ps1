$ErrorActionPreference = "Stop"
$f = "D:\Monica\M-ChamCong\M.Services\Services\Account\AuthService.cs"
$c = [System.IO.File]::ReadAllText($f)
$nl = "`r`n"

# 1) add using
$u = "using Microsoft.IdentityModel.Tokens;"
if (-not $c.Contains("using M.Services.Security;")) {
    $c = $c.Replace($u, "using M.Services.Security;" + $nl + $u, 1)
}

# 2) field
$f1 = "        private readonly DatabaseContext _dbContext;"
if (-not $c.Contains("_jwtGenerator")) {
    $c = $c.Replace($f1, $f1 + $nl + "        private readonly JwtGenerator _jwtGenerator;", 1)
}

# 3) constructor
$cold = "            DatabaseContext dbContext)"
$cnew = "            DatabaseContext dbContext," + $nl + "            JwtGenerator jwtGenerator)"
$cold2 = "            _dbContext = dbContext;"
$cnew2 = "            _dbContext = dbContext;" + $nl + "            _jwtGenerator = jwtGenerator;"
if ($c.Contains($cold)) {
    $c = $c.Replace($cold, $cnew, 1)
    $c = $c.Replace($cold2, $cnew2, 1)
}

# 4) JWT generation block -> JwtGenerator
$jwt = "            int expireMinutes = int.Parse(" + $nl
$jwt2 = "                _configuration[\"" + "Jwtsettings:ExpirationMinutes\"" + "]!);"
$oldBlock = $jwt + $jwt2 + $nl + $nl + "            DateTime expires = DateTime.UtcNow.AddMinutes(expireMinutes);" + $nl + $nl + "            string token = GenerateJwtToken(" + $nl + "                await GenerateClaims(user, employee)," + $nl + "                expires);"
$newBlock = "            DateTime expires = DateTime.UtcNow.AddMinutes(int.Parse(" + $nl + "                _configuration[\"" + "Jwtsettings:ExpirationMinutes\"" + "]!));" + $nl + $nl + "            string token = await _jwtGenerator.GenerateAsync(user, employee);"
if ($c.Contains($oldBlock)) {
    $c = $c.Replace($oldBlock, $newBlock, 1)
} else {
    Write-Output "WARN: jwt block not matched verbatim"
}

# 5) delete GenerateClaims method
$gc = [regex]::Match($c, "(?s)\s*private async Task<List<Claim>> GenerateClaims\(\s*ApplicationUser user,\s*Employee\? employee\)\s*\{.*?\n\s*\}")
if ($gc.Success) { $c = $c.Remove($gc.Index, $gc.Length) }

# 6) delete GenerateJwtToken method
$gt = [regex]::Match($c, "(?s)\s*private string GenerateJwtToken\(\s*IEnumerable<Claim> claims,\s*DateTime expires\)\s*\{.*?\n\s*\}")
if ($gt.Success) { $c = $c.Remove($gt.Index, $gt.Length) }

# 7) remove now-unused usings (Jwt + Claims)
$c = $c.Replace("using System.Security.Claims;" + $nl, "", 1)
$c = $c.Replace("using System.IdentityModel.Tokens.Jwt;" + $nl, "", 1)

[System.IO.File]::WriteAllText($f, $c)
$lines = ($c -split "`n").Count
Write-Output ("OK AuthService lines=" + $lines)
Write-Output ("GenerateClaims still present: " + $c.Contains("GenerateClaims"))
Write-Output ("GenerateJwtToken still present: " + $c.Contains("GenerateJwtToken"))
