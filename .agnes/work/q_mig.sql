SELECT name FROM sys.tables WHERE name LIKE '__EF%' OR name LIKE '%Migration%';
SELECT MigrationId, MigrationAssemblyName FROM __EFMigrationsHistory ORDER BY MigrationId;
GO
SELECT c.name FROM sys.columns c WHERE c.object_id = OBJECT_ID('EmployeeHandovers') AND c.name IN ('AssetsJson','ProjectsJson');
