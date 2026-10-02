IF COL_LENGTH('EmployeeHandovers','AssetsJson') IS NULL
ALTER TABLE dbo.EmployeeHandovers ADD AssetsJson nvarchar(max) NOT NULL CONSTRAINT DF_EmployeeHandovers_AssetsJson DEFAULT '[]';
GO
IF COL_LENGTH('EmployeeHandovers','ProjectsJson') IS NULL
ALTER TABLE dbo.EmployeeHandovers ADD ProjectsJson nvarchar(max) NOT NULL CONSTRAINT DF_EmployeeHandovers_ProjectsJson DEFAULT '[]';
GO
PRINT 'EmployeeHandovers columns:';
SELECT c.name FROM sys.columns c WHERE c.object_id=OBJECT_ID('EmployeeHandovers') AND c.name IN ('AssetsJson','ProjectsJson') ORDER BY c.name;
