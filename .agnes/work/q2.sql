SELECT TOP 10 Id, AttendanceId, CONVERT(varchar(16), LogTime, 120) AS t, Type, Method, PhotoUrl, Note
FROM AttendanceLogs ORDER BY LogTime DESC;
GO
