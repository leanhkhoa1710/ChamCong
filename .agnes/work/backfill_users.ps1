$server = "DESKTOP-DVT"
$db     = "Monica_001"

Add-Type -AssemblyName System.Data

$cn = New-Object System.Data.SqlClient.SqlConnection("Server=$server;Database=$db;Integrated Security=True;TrustServerCertificate=True")
$cn.Open()

function Run-Sql($sql) {
    $cmd = $cn.CreateCommand()
    $cmd.CommandText = $sql
    $n = $cmd.ExecuteNonQuery()
    return $n
}

# 1) Backfill EmployeeId
$n1 = Run-Sql "UPDATE u SET u.EmployeeId = e.Id FROM AspNetUsers u JOIN Employees e ON e.UserId = u.Id WHERE u.EmployeeId IS NULL OR u.EmployeeId <> e.Id"

# 2) Backfill PhoneNumber
$n2 = Run-Sql "UPDATE u SET u.PhoneNumber = e.PhoneNumber FROM AspNetUsers u JOIN Employees e ON e.UserId = u.Id WHERE (u.PhoneNumber IS NULL OR u.PhoneNumber = N'') AND e.PhoneNumber IS NOT NULL AND e.PhoneNumber <> N''"

Write-Host "EmployeeId updated rows: $n1"
Write-Host "PhoneNumber updated rows: $n2"

# 3) Verify
$cmd = $cn.CreateCommand()
$cmd.CommandText = "SELECT Id, EmployeeId, UserName, PhoneNumber FROM AspNetUsers WHERE DeletedTime IS NULL ORDER BY Id"
$ad = New-Object System.Data.SqlClient.SqlDataAdapter($cmd)
$dt = New-Object System.Data.DataTable
[void]$ad.Fill($dt)
$dt | Format-Table -AutoSize
$cn.Close()
