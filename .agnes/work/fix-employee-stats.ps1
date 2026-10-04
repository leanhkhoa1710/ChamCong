$f = 'ChamCong\src\modules\employees\attendance\pages\EmployeeStatisticsPage.jsx'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$t = [System.IO.File]::ReadAllText($f)
$t = [regex]::Replace($t, 'const attendanceHistoryPath = hrMode\r?\n        \? "/employees/attendance-history"\r?\n        : "/admin/attendance-history";', 'const attendanceHistoryPath = "/employees/attendance-history";')
$t = $t.Replace('title={hrMode ? "Thống kê công" : "Thống kê công · Quản trị"}', 'title="Thống kê công"')
[System.IO.File]::WriteAllText($f, $t, $utf8)
Write-Output 'EmployeeStatisticsPage cleaned'
