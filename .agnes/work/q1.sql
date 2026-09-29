SELECT TOP 12 Id, CONVERT(varchar(10), AttendanceDate, 103) AS d, CheckInPhoto, CheckOutPhoto, ApprovalStatus
FROM Attendances ORDER BY AttendanceDate DESC;
GO
SELECT COUNT(*) AS total, SUM(CASE WHEN CheckInPhoto IS NOT NULL THEN 1 ELSE 0 END) AS with_photo FROM Attendances;
GO
