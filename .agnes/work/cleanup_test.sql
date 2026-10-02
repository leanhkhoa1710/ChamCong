-- Xóa các yêu cầu bàn giao dùng làm test (tạo bởi sample.tai trong phiên verify)
DELETE FROM dbo.EmployeeHandovers
WHERE EmployeeId = 'C0000000-0000-0000-0000-000000000009'
  AND Reason IN ('Test binding','Camel binding test','Verify camel binding','Case test');
GO
PRINT 'remaining test rows: ';
SELECT COUNT(*) FROM dbo.EmployeeHandovers WHERE EmployeeId='C0000000-0000-0000-0000-000000000009';
