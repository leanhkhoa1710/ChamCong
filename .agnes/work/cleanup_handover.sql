DELETE FROM dbo.EmployeeHandovers WHERE Id = 'DA436DB5-6B34-4FDE-A191-4C6F920D91F8';
GO
PRINT 'remaining rows:';
SELECT COUNT(*) FROM dbo.EmployeeHandovers;
