/*
  Sample data for the Marixa ChamCong database (SQL Server / EF Core initialCreate schema).
  Run after applying the project's EF migrations. This script is safe to re-run: it skips
  inserting when the sample marker email already exists. Sample passwords are hashed using
  the ASP.NET Core Identity V3 format (PBKDF2-SHA256, 100,000 iterations), never stored plain.

  Login username is the phone number. These are development-only credentials; change them
  before using this database outside local/demo environments.
*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

IF EXISTS (SELECT 1 FROM dbo.AspNetUsers WHERE Email = N'sample.tai@marixa.local')
BEGIN
    PRINT N'Sample data already exists; no rows inserted.';
    RETURN;
END;

BEGIN TRANSACTION;
DECLARE @now datetimeoffset = SYSDATETIMEOFFSET();

DECLARE @roles TABLE (RoleName nvarchar(256), RoleId uniqueidentifier, Description nvarchar(max));
INSERT INTO @roles VALUES
 (N'Employee','A0000000-0000-0000-0000-000000000001',N'Nhân viên'),
 (N'Manager','A0000000-0000-0000-0000-000000000002',N'Quản lý'),
 (N'HR','A0000000-0000-0000-0000-000000000003',N'Nhân sự'),
 (N'Accountant','A0000000-0000-0000-0000-000000000004',N'Kế toán'),
 (N'Admin','A0000000-0000-0000-0000-000000000005',N'Quản trị hệ thống');

INSERT dbo.AspNetRoles (Id, CreatedTime, LastUpdatedTime, Description, Name, NormalizedName, ConcurrencyStamp)
SELECT RoleId, @now, @now, Description, RoleName, UPPER(RoleName), CONVERT(nvarchar(36), NEWID()) FROM @roles
WHERE NOT EXISTS (SELECT 1 FROM dbo.AspNetRoles r WHERE r.NormalizedName = UPPER(RoleName));

DECLARE @users TABLE
 (Seq int, UserId uniqueidentifier, EmployeeId uniqueidentifier, RoleName nvarchar(256), UserName nvarchar(256),
  GivenName nvarchar(100), FamilyName nvarchar(100), Phone nvarchar(20), Email nvarchar(256), PasswordHash nvarchar(max), DeptCode nvarchar(50), PositionCode nvarchar(50));
INSERT INTO @users VALUES
 (1,'B0000000-0000-0000-0000-000000000001','C0000000-0000-0000-0000-000000000001',N'Employee',N'0947733609',N'Đinh Văn',N'Tài',N'0947733609',N'sample.tai@marixa.local',N'AQAAAAEAAYagAAAAEG9ysF5AUkPQz83rDeW6ohTP6lOsxo3WcAdvAYFqo3oeqQA8YzJiFZxe9cCF83XF7A==',N'ENG',N'STAFF'),
 (2,'B0000000-0000-0000-0000-000000000002','C0000000-0000-0000-0000-000000000002',N'Employee',N'0900000002',N'Huỳnh Hoàng',N'Đăng',N'0900000002',N'sample.dang@marixa.local',N'AQAAAAEAAYagAAAAEGJwVqJeSYJk6CRBHpGb7yGSANc59Em+sN6nZqgGmuopd9U0L6pkE8jBRiqAIhkfQQ==',N'OPS',N'STAFF'),
 (3,'B0000000-0000-0000-0000-000000000003','C0000000-0000-0000-0000-000000000003',N'Manager',N'0900000003',N'Phùng Vĩnh',N'Luân',N'0900000003',N'sample.luan@marixa.local',N'AQAAAAEAAYagAAAAEG8EMZBr9GJjcHSpdSaMcK2iDtDFrB06VqQKWanKWKPtJcO9o5eORm3R3j92qqyyyQ==',N'ENG',N'MANAGER'),
 (4,'B0000000-0000-0000-0000-000000000004','C0000000-0000-0000-0000-000000000004',N'HR',N'0900000004',N'Lê Anh',N'Khoa',N'0900000004',N'sample.khoa@marixa.local',N'AQAAAAEAAYagAAAAEMt1KOxCvXlmdtDMS7JEjFmh3doVyXqacQ1acOVV3hgNrTKQ1m1xc9X80+8iGMRnuQ==',N'HR',N'HR'),
 (5,'B0000000-0000-0000-0000-000000000005','C0000000-0000-0000-0000-000000000005',N'Accountant',N'0900000005',N'Trần Phụng',N'Tuyền',N'0900000005',N'sample.tuyen@marixa.local',N'AQAAAAEAAYagAAAAEMYpkT0PeiC+V4KT4RfbCbWcD/ro5p7kxIju8gIRBIa6oXWva1l2u1lBMxW46RUcPg==',N'FIN',N'ACCOUNTANT'),
 (6,'B0000000-0000-0000-0000-000000000006','C0000000-0000-0000-0000-000000000006',N'Employee',N'0900000006',N'Minh',N'Nguyễn An',N'0900000006',N'sample.minh@marixa.local',N'AQAAAAEAAYagAAAAENkwkYWGLvZ128gTJsIsg5+fh6HeFL5cTsy5ePj/Nyq47LCEc8XYr1ARvb0rrMt89g==',N'ENG',N'STAFF'),
 (7,'B0000000-0000-0000-0000-000000000007','C0000000-0000-0000-0000-000000000007',N'Employee',N'0900000007',N'Bình',N'Trần Thanh',N'0900000007',N'sample.binh@marixa.local',N'AQAAAAEAAYagAAAAEHkuGqs62oFgBvNe4G9df/L1jXYPFcir2J2n0Tq3+TLFEqyQQGd1kzXxEZAp9KO7Tg==',N'OPS',N'STAFF'),
 (8,'B0000000-0000-0000-0000-000000000008','C0000000-0000-0000-0000-000000000008',N'Employee',N'0900000008',N'Chi',N'Phạm Quỳnh',N'0900000008',N'sample.chi@marixa.local',N'AQAAAAEAAYagAAAAEFfjbeqvpRtypEbphhK+0TFBIuR9DxvuhsMX6te5uPoPeYKKlz7BN+LvUEn5ObUBIw==',N'HR',N'STAFF'),
 (9,'B0000000-0000-0000-0000-000000000009','C0000000-0000-0000-0000-000000000009',N'Employee',N'0900000009',N'Huy',N'Võ Quang',N'0900000009',N'sample.huy@marixa.local',N'AQAAAAEAAYagAAAAEPiT7BH6u3/Mgbr6GUVFgLLXpgIaTct0BNNRpDisAuHOMzyUFg/7CdHVpp4H6Clm2A==',N'ENG',N'STAFF'),
 (10,'B0000000-0000-0000-0000-000000000010','C0000000-0000-0000-0000-000000000010',N'Employee',N'0900000010',N'Mai',N'Bùi Tuyết',N'0900000010',N'sample.mai@marixa.local',N'AQAAAAEAAYagAAAAENxUfThtzqwFbMyDsPYcPNMGAdwp0qCH4o46ym35FX4PYvt+NnW7S9mLBos1czGbjQ==',N'OPS',N'STAFF');

INSERT dbo.AspNetUsers
 (Id, CreatedTime, LastUpdatedTime, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
SELECT UserId,@now,@now,UserName,UPPER(UserName),Email,UPPER(Email),1,PasswordHash,CONVERT(nvarchar(36),NEWID()),CONVERT(nvarchar(36),NEWID()),Phone,1,0,0,0 FROM @users;
INSERT dbo.AspNetUserRoles (UserId,RoleId,CreatedTime,LastUpdatedTime)
SELECT u.UserId,r.Id,@now,@now FROM @users u JOIN dbo.AspNetRoles r ON r.NormalizedName=UPPER(u.RoleName);

INSERT dbo.Departments (Id,Code,Name,Description,ManagerId,IsActive,CreatedTime,LastUpdatedTime)
VALUES ('D0000000-0000-0000-0000-000000000001',N'ENG',N'Kỹ thuật',N'Phát triển sản phẩm',NULL,1,@now,@now),
 ('D0000000-0000-0000-0000-000000000002',N'OPS',N'Vận hành',N'Vận hành nội bộ',NULL,1,@now,@now),
 ('D0000000-0000-0000-0000-000000000003',N'HR',N'Nhân sự',N'Quản lý nhân sự',NULL,1,@now,@now),
 ('D0000000-0000-0000-0000-000000000004',N'FIN',N'Tài chính kế toán',N'Kế toán và tiền lương',NULL,1,@now,@now),
 ('D0000000-0000-0000-0000-000000000005',N'MKT',N'Tiếp thị',N'Truyền thông và tiếp thị',NULL,1,@now,@now);
INSERT dbo.Positions (Id,Code,Name,Description,IsActive,CreatedTime,LastUpdatedTime)
VALUES ('E0000000-0000-0000-0000-000000000001',N'STAFF',N'Nhân viên',N'Nhân viên',1,@now,@now),
 ('E0000000-0000-0000-0000-000000000002',N'MANAGER',N'Quản lý',N'Quản lý nhóm',1,@now,@now),
 ('E0000000-0000-0000-0000-000000000003',N'HR',N'Chuyên viên nhân sự',N'Nhân sự',1,@now,@now),
 ('E0000000-0000-0000-0000-000000000004',N'ACCOUNTANT',N'Kế toán',N'Kế toán',1,@now,@now),
 ('E0000000-0000-0000-0000-000000000005',N'LEAD',N'Trưởng nhóm',N'Trưởng nhóm',1,@now,@now);

INSERT dbo.Employees (Id,EmployeeCode,GivenName,FamilyName,Gender,PhoneNumber,Email,UserId,DepartmentId,PositionId,ManagerId,StartDate,LaborType,Status,UsePhoneAttendance,CreatedTime,LastUpdatedTime)
SELECT EmployeeId,CONCAT(N'MX',FORMAT(Seq,'000')),GivenName,FamilyName,1,Phone,Email,UserId,
 CASE DeptCode WHEN N'ENG' THEN 'D0000000-0000-0000-0000-000000000001' WHEN N'OPS' THEN 'D0000000-0000-0000-0000-000000000002' WHEN N'HR' THEN 'D0000000-0000-0000-0000-000000000003' WHEN N'FIN' THEN 'D0000000-0000-0000-0000-000000000004' ELSE 'D0000000-0000-0000-0000-000000000005' END,
 CASE PositionCode WHEN N'MANAGER' THEN 'E0000000-0000-0000-0000-000000000002' WHEN N'HR' THEN 'E0000000-0000-0000-0000-000000000003' WHEN N'ACCOUNTANT' THEN 'E0000000-0000-0000-0000-000000000004' ELSE 'E0000000-0000-0000-0000-000000000001' END,
 CASE WHEN Seq IN (1,6,9) THEN 'C0000000-0000-0000-0000-000000000003' ELSE NULL END,
 DATEADD(day,-(Seq*20),CONVERT(date,GETDATE())),1,2,1,@now,@now FROM @users;
UPDATE d SET ManagerId='C0000000-0000-0000-0000-000000000003' FROM dbo.Departments d WHERE d.Code=N'ENG';

INSERT dbo.Shifts (Id,Code,Name,Description,StartTime,EndTime,StandardHours,BreakMinutes,IsNight,WorkDays,IsActive,CreatedTime,LastUpdatedTime)
VALUES ('F0000000-0000-0000-0000-000000000001',N'HC',N'Ca hành chính',N'Thứ 2 đến thứ 6', '08:00','17:00',8,60,0,31,1,@now,@now),
 ('F0000000-0000-0000-0000-000000000002',N'MORN',N'Ca sáng',N'Ca sáng', '06:00','14:00',7,60,0,127,1,@now,@now),
 ('F0000000-0000-0000-0000-000000000003',N'EVE',N'Ca chiều',N'Ca chiều', '14:00','22:00',7,60,0,127,1,@now,@now),
 ('F0000000-0000-0000-0000-000000000004',N'NIGHT',N'Ca đêm',N'Ca đêm', '22:00','06:00',7,60,1,127,1,@now,@now),
 ('F0000000-0000-0000-0000-000000000005',N'PART',N'Ca bán thời gian',N'Ca linh hoạt', '09:00','13:00',4,0,0,31,1,@now,@now);
INSERT dbo.Banks (Id,Code,Name,ShortName,IsActive,CreatedTime,LastUpdatedTime)
VALUES ('10000000-0000-0000-0000-000000000001',N'VCB',N'Ngân hàng TMCP Ngoại thương Việt Nam',N'Vietcombank',1,@now,@now),
 ('10000000-0000-0000-0000-000000000002',N'TCB',N'Ngân hàng TMCP Kỹ thương Việt Nam',N'Techcombank',1,@now,@now),
 ('10000000-0000-0000-0000-000000000003',N'MB',N'Ngân hàng TMCP Quân đội',N'MB Bank',1,@now,@now),
 ('10000000-0000-0000-0000-000000000004',N'ACB',N'Ngân hàng TMCP Á Châu',N'ACB',1,@now,@now),
 ('10000000-0000-0000-0000-000000000005',N'BIDV',N'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',N'BIDV',1,@now,@now);
INSERT dbo.LeaveTypes (Id,Code,Name,MaxDays,IsPaid,IsActive,CreatedTime,LastUpdatedTime)
VALUES ('11000000-0000-0000-0000-000000000001',N'ANNUAL',N'Nghỉ phép năm',12,1,1,@now,@now),
 ('11000000-0000-0000-0000-000000000002',N'SICK',N'Nghỉ ốm',30,1,1,@now,@now),
 ('11000000-0000-0000-0000-000000000003',N'UNPAID',N'Nghỉ không lương',NULL,0,1,@now,@now),
 ('11000000-0000-0000-0000-000000000004',N'MATERNITY',N'Nghỉ thai sản',180,1,1,@now,@now),
 ('11000000-0000-0000-0000-000000000005',N'PERSONAL',N'Nghỉ việc riêng',3,1,1,@now,@now);

INSERT dbo.EmployeeContracts (Id,EmployeeId,ContractNumber,ContractType,StartDate,EndDate,Note,CreatedTime,LastUpdatedTime)
SELECT NEWID(),EmployeeId,CONCAT(N'HĐ-',FORMAT(Seq,'000')),2,DATEADD(day,-(Seq*20),CONVERT(date,GETDATE())),DATEADD(year,1,CONVERT(date,GETDATE())),N'Dữ liệu demo',@now,@now FROM @users;
INSERT dbo.EmployeeInsurances (Id,EmployeeId,SocialInsuranceNumber,HealthInsuranceNumber,PersonalTaxCode,IsSocialInsuranceParticipant,ParticipationStartDate,SocialInsuranceSalary,Status,CreatedTime,LastUpdatedTime)
SELECT NEWID(),EmployeeId,CONCAT(N'BHXH',FORMAT(Seq,'000000')),CONCAT(N'BHYT',FORMAT(Seq,'000000')),CONCAT(N'MST',FORMAT(Seq,'000000')),1,DATEADD(day,-(Seq*20),CONVERT(date,GETDATE())),12000000,1,@now,@now FROM @users;
INSERT dbo.EmployeeBankAccounts (Id,EmployeeId,BankId,AccountNumber,AccountHolderName,IsPrimary,Status,CreatedTime,LastUpdatedTime)
SELECT NEWID(),EmployeeId,CASE WHEN Seq%5=0 THEN '10000000-0000-0000-0000-000000000005' WHEN Seq%5=1 THEN '10000000-0000-0000-0000-000000000001' WHEN Seq%5=2 THEN '10000000-0000-0000-0000-000000000002' WHEN Seq%5=3 THEN '10000000-0000-0000-0000-000000000003' ELSE '10000000-0000-0000-0000-000000000004' END,CONCAT(N'001234567',FORMAT(Seq,'00')),CONCAT(GivenName,N' ',FamilyName),1,1,@now,@now FROM @users;
INSERT dbo.Payrolls (Id,EmployeeId,PayrollMonth,BasicSalary,Allowance,Bonus,Overtime,Insurance,Tax,Deduction,NetSalary,Status,PayDate,PaymentMethod,CreatedTime,LastUpdatedTime)
SELECT NEWID(),EmployeeId,DATEFROMPARTS(YEAR(GETDATE()),MONTH(GETDATE()),1),15000000,1000000,500000,0,1200000,300000,0,15000000,2,NULL,2,@now,@now FROM @users;

;WITH RecentDays AS (SELECT TOP (5) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n FROM sys.all_objects)
INSERT dbo.Attendances (Id,EmployeeId,AttendanceDate,Status,PlannedShiftId,PlannedHours,ActualHours,ApprovalStatus,CreatedTime,LastUpdatedTime)
SELECT NEWID(),u.EmployeeId,DATEADD(day,-d.n,CONVERT(date,GETDATE())),CASE WHEN d.n=2 THEN 2 ELSE 1 END,'F0000000-0000-0000-0000-000000000001',8,CASE WHEN d.n=2 THEN 7 ELSE 8 END,1,@now,@now FROM @users u CROSS JOIN RecentDays d WHERE u.Seq<=5;
INSERT dbo.LeaveRequests (Id,EmployeeId,LeaveTypeId,FromDate,ToDate,TotalDays,Reason,Status,ApprovedBy,ApprovedAt,CreatedTime,LastUpdatedTime)
SELECT NEWID(),EmployeeId,'11000000-0000-0000-0000-000000000001',DATEADD(day,7+Seq,CONVERT(date,GETDATE())),DATEADD(day,7+Seq,CONVERT(date,GETDATE())),1,N'Nghỉ phép cá nhân',CASE WHEN Seq%2=0 THEN 2 ELSE 1 END,CASE WHEN Seq%2=0 THEN 'C0000000-0000-0000-0000-000000000003' ELSE NULL END,CASE WHEN Seq%2=0 THEN GETDATE() ELSE NULL END,@now,@now FROM @users WHERE Seq<=5;

COMMIT TRANSACTION;
PRINT N'Inserted demo roles, 10 accounts and sample HR, attendance, leave, contract, payroll, insurance and bank data.';
