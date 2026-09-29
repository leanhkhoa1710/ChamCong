/*
  Sample data for SQL Server. Run after the EF Core schema migrations have been applied.
  Running this script again resets only the deterministic demo users/employees
  (B000...001-010 and C000...001-020) and their related rows.

  Login name: phone number. Password for all 10 demo accounts: Hovaten123@
  PasswordHash uses ASP.NET Core Identity V3 (PBKDF2-SHA256, 100,000 iterations).
  Development/test data only; do not use these credentials in production.
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @missingTables nvarchar(2048) = N'';
SELECT @missingTables = @missingTables
    + CASE WHEN @missingTables = N'' THEN N'' ELSE N', ' END
    + v.TableName
FROM (VALUES
    (N'ActivationCodes'),(N'AspNetRoles'),(N'AspNetUserClaims'),(N'AspNetUserLogins'),
    (N'AspNetUserRoles'),(N'AspNetUsers'),(N'AspNetUserTokens'),(N'AttendanceLogs'),
    (N'Attendances'),(N'Banks'),(N'Departments'),(N'EmployeeBankAccounts'),
    (N'EmployeeContracts'),(N'EmployeeDependents'),(N'EmployeeInsurances'),(N'Employees'),
    (N'EmployeeSalaries'),(N'EmployeeShifts'),(N'LeaveRequests'),(N'LeaveTypes'),
    (N'Payrolls'),(N'Positions'),(N'Shifts')
) v(TableName)
WHERE OBJECT_ID(N'dbo.' + v.TableName, N'U') IS NULL;

IF @missingTables <> N''
BEGIN
    DECLARE @schemaError nvarchar(2048) =
        N'Missing required dbo tables: ' + @missingTables
        + N'. Apply EF Core migrations to Monica_001 before running SampleData.sql.';
    THROW 51000, @schemaError, 1;
END;

BEGIN TRANSACTION;

DECLARE @now datetimeoffset = SYSDATETIMEOFFSET();
DECLARE @today date = CONVERT(date, GETDATE());
DECLARE @passwordHash nvarchar(max) = N'AQAAAAEAAYagAAAAEPRKUNrjqLaRkB4jKF2dOulTwaOc/7ksVVn++05ItTYObdf18SxZ17cGsNFXrDm20Q==';

DECLARE @staff TABLE
(
    Seq int PRIMARY KEY,
    EmployeeId uniqueidentifier NOT NULL,
    EmployeeCode nvarchar(50) NOT NULL,
    GivenName nvarchar(100) NOT NULL,
    FamilyName nvarchar(100) NOT NULL,
    PhoneNumber nvarchar(20) NOT NULL,
    Email nvarchar(256) NOT NULL,
    UserId uniqueidentifier NULL,
    RoleName nvarchar(256) NULL,
    DeptCode nvarchar(50) NOT NULL,
    PositionCode nvarchar(50) NOT NULL
);

INSERT INTO @staff VALUES
(1,'C0000000-0000-0000-0000-000000000001',N'AD-001',N'Nguyễn Hoàng',N'Nam',N'0900000001',N'sample.admin1@marixa.local','B0000000-0000-0000-0000-000000000001',N'Admin',N'OPS',N'ADMIN'),
(2,'C0000000-0000-0000-0000-000000000002',N'AD-002',N'Trần Thị',N'Mai',N'0900000002',N'sample.admin2@marixa.local','B0000000-0000-0000-0000-000000000002',N'Admin',N'FIN',N'ADMIN'),
(3,'C0000000-0000-0000-0000-000000000003',N'QL-001',N'Phùng Vĩnh',N'Luân',N'0900000003',N'sample.luan@marixa.local','B0000000-0000-0000-0000-000000000003',N'Manager',N'ENG',N'MANAGER'),
(4,'C0000000-0000-0000-0000-000000000004',N'QL-002',N'Nguyễn Phước',N'Long',N'0900000004',N'sample.manager2@marixa.local','B0000000-0000-0000-0000-000000000004',N'Manager',N'OPS',N'MANAGER'),
(5,'C0000000-0000-0000-0000-000000000005',N'HR-001',N'Lê Anh',N'Khoa',N'0900000005',N'sample.khoa@marixa.local','B0000000-0000-0000-0000-000000000005',N'HR',N'HR',N'HR'),
(6,'C0000000-0000-0000-0000-000000000006',N'HR-002',N'Lâm Ngọc',N'Bích',N'0900000006',N'sample.hr2@marixa.local','B0000000-0000-0000-0000-000000000006',N'HR',N'HR',N'HR'),
(7,'C0000000-0000-0000-0000-000000000007',N'KT-001',N'Trần Phụng',N'Tuyền',N'0900000007',N'sample.tuyen@marixa.local','B0000000-0000-0000-0000-000000000007',N'Accountant',N'FIN',N'ACCOUNTANT'),
(8,'C0000000-0000-0000-0000-000000000008',N'KT-002',N'Võ Minh',N'Tuấn',N'0900000008',N'sample.accountant2@marixa.local','B0000000-0000-0000-0000-000000000008',N'Accountant',N'FIN',N'ACCOUNTANT'),
(9,'C0000000-0000-0000-0000-000000000009',N'NV-001',N'Đinh Văn',N'Tài',N'0900000009',N'sample.tai@marixa.local','B0000000-0000-0000-0000-000000000009',N'Employee',N'ENG',N'STAFF'),
(10,'C0000000-0000-0000-0000-000000000010',N'NV-002',N'Huỳnh Hoàng',N'Đăng',N'0900000010',N'sample.dang@marixa.local','B0000000-0000-0000-0000-000000000010',N'Employee',N'OPS',N'STAFF'),
(11,'C0000000-0000-0000-0000-000000000011',N'NV-003',N'Bùi Minh',N'Anh',N'0910000011',N'minhanh11@marixa.local',NULL,NULL,N'MKT',N'STAFF'),
(12,'C0000000-0000-0000-0000-000000000012',N'NV-004',N'Phạm Quốc',N'Huy',N'0910000012',N'quochuy12@marixa.local',NULL,NULL,N'ENG',N'STAFF'),
(13,'C0000000-0000-0000-0000-000000000013',N'NV-005',N'Hoàng Thị',N'Lan',N'0910000013',N'thilan13@marixa.local',NULL,NULL,N'OPS',N'STAFF'),
(14,'C0000000-0000-0000-0000-000000000014',N'NV-006',N'Đặng Gia',N'Bảo',N'0910000014',N'giabao14@marixa.local',NULL,NULL,N'MKT',N'STAFF'),
(15,'C0000000-0000-0000-0000-000000000015',N'NV-007',N'Vũ Ngọc',N'Hà',N'0910000015',N'ngocha15@marixa.local',NULL,NULL,N'HR',N'STAFF'),
(16,'C0000000-0000-0000-0000-000000000016',N'NV-008',N'Trương Đức',N'Anh',N'0910000016',N'ducanh16@marixa.local',NULL,NULL,N'ENG',N'STAFF'),
(17,'C0000000-0000-0000-0000-000000000017',N'NV-009',N'Nguyễn Thu',N'Trang',N'0910000017',N'thutrang17@marixa.local',NULL,NULL,N'FIN',N'STAFF'),
(18,'C0000000-0000-0000-0000-000000000018',N'NV-010',N'Đỗ Quang',N'Minh',N'0910000018',N'quangminh18@marixa.local',NULL,NULL,N'OPS',N'STAFF'),
(19,'C0000000-0000-0000-0000-000000000019',N'NV-011',N'Lê Thị',N'Hương',N'0910000019',N'thihuong19@marixa.local',NULL,NULL,N'MKT',N'STAFF'),
(20,'C0000000-0000-0000-0000-000000000020',N'NV-012',N'Mai Quốc',N'Khánh',N'0910000020',N'quockhanh20@marixa.local',NULL,NULL,N'ENG',N'STAFF');

DECLARE @sampleEmployeeIds TABLE (Id uniqueidentifier PRIMARY KEY);
DECLARE @sampleUserIds TABLE (Id uniqueidentifier PRIMARY KEY);
INSERT INTO @sampleEmployeeIds SELECT EmployeeId FROM @staff;
INSERT INTO @sampleUserIds SELECT UserId FROM @staff WHERE UserId IS NOT NULL;

/* Remove only rows linked to the deterministic demo IDs, so re-running refreshes the sample. */
DELETE l
FROM dbo.AttendanceLogs l
JOIN dbo.Attendances a ON a.Id = l.AttendanceId
WHERE a.EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);

DELETE FROM dbo.Attendances
WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);

DELETE FROM dbo.LeaveRequests
WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
UPDATE dbo.LeaveRequests SET ApprovedBy = NULL
WHERE ApprovedBy IN (SELECT Id FROM @sampleEmployeeIds)
  AND EmployeeId NOT IN (SELECT Id FROM @sampleEmployeeIds);

DELETE FROM dbo.ActivationCodes
WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds)
   OR UserId IN (SELECT Id FROM @sampleUserIds);
DELETE FROM dbo.EmployeeShifts WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.EmployeeContracts WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.EmployeeSalaries WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.EmployeeInsurances WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.EmployeeBankAccounts WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.EmployeeDependents WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.Payrolls WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);

UPDATE dbo.Attendances SET ApprovedBy = NULL
WHERE ApprovedBy IN (SELECT Id FROM @sampleEmployeeIds)
  AND EmployeeId NOT IN (SELECT Id FROM @sampleEmployeeIds);
UPDATE dbo.Departments SET ManagerId = NULL
WHERE ManagerId IN (SELECT Id FROM @sampleEmployeeIds);
UPDATE dbo.Employees SET ManagerId = NULL
WHERE ManagerId IN (SELECT Id FROM @sampleEmployeeIds);
UPDATE dbo.Employees SET UserId = NULL
WHERE UserId IN (SELECT Id FROM @sampleUserIds);
UPDATE dbo.AspNetUsers SET EmployeeId = NULL
WHERE EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);

DELETE FROM dbo.Employees WHERE Id IN (SELECT Id FROM @sampleEmployeeIds);
DELETE FROM dbo.AspNetUserRoles WHERE UserId IN (SELECT Id FROM @sampleUserIds);
DELETE FROM dbo.AspNetUserClaims WHERE UserId IN (SELECT Id FROM @sampleUserIds);
DELETE FROM dbo.AspNetUserLogins WHERE UserId IN (SELECT Id FROM @sampleUserIds);
DELETE FROM dbo.AspNetUserTokens WHERE UserId IN (SELECT Id FROM @sampleUserIds);
DELETE FROM dbo.AspNetUsers WHERE Id IN (SELECT Id FROM @sampleUserIds);

DECLARE @roles TABLE (RoleName nvarchar(256), Description nvarchar(max));
INSERT INTO @roles VALUES
(N'Admin',N'Quản trị hệ thống'),
(N'Manager',N'Quản lý'),
(N'HR',N'Nhân sự'),
(N'Accountant',N'Kế toán'),
(N'Employee',N'Nhân viên');

INSERT INTO dbo.AspNetRoles (Id,CreatedTime,LastUpdatedTime,Description,Name,NormalizedName,ConcurrencyStamp)
SELECT NEWID(),@now,@now,r.Description,r.RoleName,UPPER(r.RoleName),CONVERT(nvarchar(36),NEWID())
FROM @roles r
WHERE NOT EXISTS (SELECT 1 FROM dbo.AspNetRoles x WHERE x.NormalizedName=UPPER(r.RoleName));

INSERT INTO dbo.Departments (Id,Code,Name,Description,ManagerId,IsActive,CreatedTime,LastUpdatedTime)
SELECT NEWID(),v.Code,v.Name,v.Description,NULL,1,@now,@now
FROM (VALUES
    (N'ENG',N'Kỹ thuật',N'Phát triển sản phẩm'),
    (N'OPS',N'Vận hành',N'Vận hành nội bộ'),
    (N'HR',N'Nhân sự',N'Quản lý nhân sự'),
    (N'FIN',N'Tài chính kế toán',N'Kế toán và tiền lương'),
    (N'MKT',N'Tiếp thị',N'Truyền thông và tiếp thị')
) v(Code,Name,Description)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Departments d WHERE d.Code=v.Code);

INSERT INTO dbo.Positions (Id,Code,Name,Description,IsActive,CreatedTime,LastUpdatedTime)
SELECT NEWID(),v.Code,v.Name,v.Description,1,@now,@now
FROM (VALUES
    (N'STAFF',N'Nhân viên',N'Nhân viên'),
    (N'MANAGER',N'Quản lý',N'Quản lý nhóm'),
    (N'HR',N'Chuyên viên nhân sự',N'Nhân sự'),
    (N'ACCOUNTANT',N'Kế toán',N'Kế toán'),
    (N'ADMIN',N'Quản trị viên',N'Quản trị hệ thống')
) v(Code,Name,Description)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Positions p WHERE p.Code=v.Code);

INSERT INTO dbo.Shifts (Id,Code,Name,Description,StartTime,EndTime,StandardHours,BreakMinutes,IsNight,WorkDays,IsActive,CreatedTime,LastUpdatedTime)
SELECT NEWID(),v.Code,v.Name,v.Description,v.StartTime,v.EndTime,v.StandardHours,v.BreakMinutes,v.IsNight,v.WorkDays,1,@now,@now
FROM (VALUES
    (N'HC',N'Ca hành chính',N'Thứ 2 đến thứ 6',CAST('08:00' AS time),CAST('17:00' AS time),8,60,0,31),
    (N'MORN',N'Ca sáng',N'Ca sáng',CAST('06:00' AS time),CAST('14:00' AS time),7,60,0,127),
    (N'EVE',N'Ca chiều',N'Ca chiều',CAST('14:00' AS time),CAST('22:00' AS time),7,60,0,127),
    (N'NIGHT',N'Ca đêm',N'Ca đêm',CAST('22:00' AS time),CAST('06:00' AS time),7,60,1,127),
    (N'PART',N'Ca bán thời gian',N'Ca linh hoạt',CAST('09:00' AS time),CAST('13:00' AS time),4,0,0,31)
) v(Code,Name,Description,StartTime,EndTime,StandardHours,BreakMinutes,IsNight,WorkDays)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Shifts s WHERE s.Code=v.Code);

INSERT INTO dbo.Banks (Id,Code,Name,ShortName,IsActive,CreatedTime,LastUpdatedTime)
SELECT NEWID(),v.Code,v.Name,v.ShortName,1,@now,@now
FROM (VALUES
    (N'VCB',N'Ngân hàng TMCP Ngoại thương Việt Nam',N'Vietcombank'),
    (N'TCB',N'Ngân hàng TMCP Kỹ thương Việt Nam',N'Techcombank'),
    (N'MB',N'Ngân hàng TMCP Quân đội',N'MB Bank'),
    (N'ACB',N'Ngân hàng TMCP Á Châu',N'ACB'),
    (N'BIDV',N'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',N'BIDV')
) v(Code,Name,ShortName)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Banks b WHERE b.Code=v.Code);

INSERT INTO dbo.LeaveTypes (Id,Code,Name,MaxDays,IsPaid,IsActive,CreatedTime,LastUpdatedTime)
SELECT NEWID(),v.Code,v.Name,v.MaxDays,v.IsPaid,1,@now,@now
FROM (VALUES
    (N'ANNUAL',N'Nghỉ phép năm',12,1),
    (N'SICK',N'Nghỉ ốm',30,1),
    (N'UNPAID',N'Nghỉ không lương',CAST(NULL AS int),0),
    (N'MATERNITY',N'Nghỉ thai sản',180,1),
    (N'PERSONAL',N'Nghỉ việc riêng',3,1)
) v(Code,Name,MaxDays,IsPaid)
WHERE NOT EXISTS (SELECT 1 FROM dbo.LeaveTypes t WHERE t.Code=v.Code);

INSERT INTO dbo.AspNetUsers
    (Id,CreatedTime,LastUpdatedTime,UserName,NormalizedUserName,Email,NormalizedEmail,EmailConfirmed,
     PasswordHash,SecurityStamp,ConcurrencyStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEnabled,AccessFailedCount)
SELECT s.UserId,@now,@now,s.PhoneNumber,UPPER(s.PhoneNumber),s.Email,UPPER(s.Email),1,
       @passwordHash,CONVERT(nvarchar(36),NEWID()),CONVERT(nvarchar(36),NEWID()),s.PhoneNumber,1,0,0,0
FROM @staff s
WHERE s.UserId IS NOT NULL;

INSERT INTO dbo.AspNetUserRoles (UserId,RoleId,CreatedTime,LastUpdatedTime)
SELECT s.UserId,r.Id,@now,@now
FROM @staff s
JOIN dbo.AspNetRoles r ON r.NormalizedName=UPPER(s.RoleName)
WHERE s.UserId IS NOT NULL;

INSERT INTO dbo.Employees
    (Id,EmployeeCode,GivenName,FamilyName,Gender,PhoneNumber,Email,UserId,DepartmentId,PositionId,ManagerId,
     StartDate,LaborType,Status,UsePhoneAttendance,CreatedTime,LastUpdatedTime)
SELECT s.EmployeeId,s.EmployeeCode,s.GivenName,s.FamilyName,
       CASE WHEN s.Seq IN (7,9,11,13,15,17,19) THEN 2 ELSE 1 END,
       s.PhoneNumber,s.Email,s.UserId,d.Id,p.Id,
       CASE WHEN s.Seq IN (3,4) THEN NULL ELSE 'C0000000-0000-0000-0000-000000000003' END,
       DATEADD(day,-(s.Seq*30),@today),1,2,1,@now,@now
FROM @staff s
JOIN dbo.Departments d ON d.Code=s.DeptCode
JOIN dbo.Positions p ON p.Code=s.PositionCode;

UPDATE u SET EmployeeId=e.Id
FROM dbo.AspNetUsers u
JOIN dbo.Employees e ON e.UserId=u.Id
WHERE u.Id IN (SELECT Id FROM @sampleUserIds);

UPDATE d SET ManagerId='C0000000-0000-0000-0000-000000000003'
FROM dbo.Departments d WHERE d.Code IN (N'ENG',N'MKT');
UPDATE d SET ManagerId='C0000000-0000-0000-0000-000000000004'
FROM dbo.Departments d WHERE d.Code=N'OPS';
UPDATE d SET ManagerId='C0000000-0000-0000-0000-000000000004'
FROM dbo.Departments d WHERE d.Code IN (N'HR',N'FIN');

INSERT INTO dbo.EmployeeContracts (Id,EmployeeId,ContractNumber,ContractType,StartDate,EndDate,Note,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,CONCAT(N'HĐ-',s.EmployeeCode),2,DATEADD(day,-180,@today),DATEADD(year,1,@today),N'Dữ liệu demo',@now,@now
FROM @staff s WHERE s.Seq<=10;

INSERT INTO dbo.EmployeeInsurances
    (Id,EmployeeId,SocialInsuranceNumber,HealthInsuranceNumber,PersonalTaxCode,IsSocialInsuranceParticipant,
     ParticipationStartDate,SocialInsuranceSalary,Status,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,CONCAT(N'BHXH',s.EmployeeCode),CONCAT(N'BHYT',s.EmployeeCode),CONCAT(N'MST',s.EmployeeCode),1,
       DATEADD(day,-180,@today),12000000,1,@now,@now
FROM @staff s WHERE s.Seq<=10;

INSERT INTO dbo.EmployeeBankAccounts (Id,EmployeeId,BankId,AccountNumber,AccountHolderName,IsPrimary,Status,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,b.Id,CONCAT(N'001234567',FORMAT(s.Seq,N'00')),CONCAT(s.GivenName,N' ',s.FamilyName),1,1,@now,@now
FROM @staff s
JOIN dbo.Banks b ON b.Code=CASE s.Seq%5 WHEN 1 THEN N'VCB' WHEN 2 THEN N'TCB' WHEN 3 THEN N'MB' WHEN 4 THEN N'ACB' ELSE N'BIDV' END
WHERE s.Seq<=10;

INSERT INTO dbo.EmployeeSalaries
    (Id,EmployeeId,PaymentType,BasicSalary,DailyRate,PositionAllowance,OtherAllowance,Bonus,SocialInsuranceSalary,EffectiveFrom,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,1,15000000,0,500000,500000,0,12000000,DATEADD(day,-180,@today),@now,@now
FROM @staff s WHERE s.Seq<=10;

INSERT INTO dbo.EmployeeShifts (Id,EmployeeId,ShiftId,EffectiveFrom,Note,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,sh.Id,DATEADD(day,-30,@today),N'Ca demo',@now,@now
FROM @staff s CROSS JOIN dbo.Shifts sh
WHERE s.Seq<=10 AND sh.Code=N'HC';

INSERT INTO dbo.Payrolls
    (Id,EmployeeId,PayrollMonth,BasicSalary,Allowance,Bonus,Overtime,Insurance,Tax,Deduction,NetSalary,Status,PayDate,PaymentMethod,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,DATEFROMPARTS(YEAR(@today),MONTH(@today),1),15000000,1000000,500000,0,1200000,300000,0,15000000,
       CASE WHEN s.Seq<=5 THEN 2 ELSE 1 END,NULL,2,@now,@now
FROM @staff s WHERE s.Seq<=10;

INSERT INTO dbo.EmployeeDependents (Id,EmployeeId,GivenName,FamilyName,Relationship,BirthDate,Status,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,N'Mẫu',CONCAT(N'Người phụ thuộc ',s.Seq),N'Con',DATEADD(year,-8,@today),1,@now,@now
FROM @staff s WHERE s.Seq<=10;

INSERT INTO dbo.LeaveRequests
    (Id,EmployeeId,LeaveTypeId,FromDate,ToDate,TotalDays,Reason,Status,ApprovedBy,ApprovedAt,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,t.Id,DATEADD(day,10+s.Seq,@today),DATEADD(day,10+s.Seq,@today),1,
       N'Đơn nghỉ phép mẫu',CASE WHEN s.Seq<=5 THEN 2 ELSE 1 END,
       CASE WHEN s.Seq<=5 THEN 'C0000000-0000-0000-0000-000000000003' ELSE NULL END,
       CASE WHEN s.Seq<=5 THEN DATEADD(day,1,@today) ELSE NULL END,@now,@now
FROM @staff s
JOIN dbo.LeaveTypes t ON t.Code=N'ANNUAL'
WHERE s.Seq<=10;

/* 10 working-day attendance records: 5 approved and 5 awaiting approval. */
;WITH DateRange AS
(
    SELECT CAST(DATEADD(day,-1,@today) AS date) AS WorkDate,1 AS n
    UNION ALL
    SELECT DATEADD(day,-1,WorkDate),n+1 FROM DateRange WHERE n<30
), WorkDays AS
(
    SELECT WorkDate,ROW_NUMBER() OVER (ORDER BY WorkDate DESC) AS DaySeq
    FROM DateRange
    WHERE DATEDIFF(day,CONVERT(date,'19000101'),WorkDate)%7 BETWEEN 0 AND 4
)
INSERT INTO dbo.Attendances
    (Id,EmployeeId,AttendanceDate,Status,PlannedShiftId,PlannedHours,ActualHours,ApprovalStatus,ApprovedBy,ApprovedAt,CreatedTime,LastUpdatedTime)
SELECT NEWID(),s.EmployeeId,w.WorkDate,1,sh.Id,8,8,
       CASE WHEN w.DaySeq<=5 THEN 1 ELSE 0 END,
       CASE WHEN w.DaySeq<=5 THEN 'C0000000-0000-0000-0000-000000000003' ELSE NULL END,
       CASE WHEN w.DaySeq<=5 THEN DATEADD(hour,18,CAST(w.WorkDate AS datetime2)) ELSE NULL END,@now,@now
FROM WorkDays w
JOIN @staff s ON s.Seq=9+((w.DaySeq-1)%2)
CROSS JOIN dbo.Shifts sh
WHERE w.DaySeq<=10 AND sh.Code=N'HC'
OPTION (MAXRECURSION 40);

INSERT INTO dbo.AttendanceLogs
    (Id,AttendanceId,LogTime,[Type],[Method],DeviceId,IsAdjusted,CreatedTime,LastUpdatedTime)
SELECT NEWID(),a.Id,TODATETIMEOFFSET(DATEADD(hour,8,CAST(a.AttendanceDate AS datetime2)),'+07:00'),1,4,N'DEMO-PHONE',0,@now,@now
FROM dbo.Attendances a
WHERE a.EmployeeId IN (SELECT Id FROM @sampleEmployeeIds)
UNION ALL
SELECT NEWID(),a.Id,TODATETIMEOFFSET(DATEADD(hour,17,CAST(a.AttendanceDate AS datetime2)),'+07:00'),2,4,N'DEMO-PHONE',0,@now,@now
FROM dbo.Attendances a
WHERE a.EmployeeId IN (SELECT Id FROM @sampleEmployeeIds);

COMMIT TRANSACTION;

PRINT N'Đã tạo 20 nhân viên, 10 tài khoản (mỗi role Employee/Manager/HR/Accountant/Admin có 2 tài khoản), 10 ngày công (5 duyệt, 5 chờ duyệt) và dữ liệu mẫu HR.';
