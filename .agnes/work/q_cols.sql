SELECT c.name + ' | ' + t.name + CASE WHEN c.max_length=-1 THEN '' ELSE CAST(c.max_length AS varchar(10)) END + CASE WHEN c.is_nullable=1 THEN ' null' ELSE '' END AS col
FROM sys.columns c JOIN sys.types t ON c.user_type_id=t.user_type_id
WHERE c.object_id=OBJECT_ID('EmployeeHandovers') ORDER BY c.column_id;
