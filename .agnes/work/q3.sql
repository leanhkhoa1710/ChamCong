SELECT TOP 8 Id, AttendanceId, CONVERT(varchar(16), LogTime, 120) AS t, Type, Method, PhotoUrl, Note
FROM AttendanceLogs ORDER BY LogTime DESC;
GO
SELECT TOP 4 Id, CONVERT(varchar(10), AttendanceDate, 103) d, CheckInPhoto, CheckOutPhoto, ApprovalStatus, CONVERT(varchar(16),LastUpdatedTime,120) upd
FROM Attendances ORDER BY LastUpdatedTime DESC;
GO
