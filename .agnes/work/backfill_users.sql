-- Backfill AspNetUsers.EmployeeId + PhoneNumber từ Employees (Employees.UserId là nguồn chính)
UPDATE u
SET u.EmployeeId = e.Id
FROM AspNetUsers u
JOIN Employees e ON e.UserId = u.Id
WHERE u.EmployeeId IS NULL OR u.EmployeeId <> e.Id;

UPDATE u
SET u.PhoneNumber = e.PhoneNumber
FROM AspNetUsers u
JOIN Employees e ON e.UserId = u.Id
WHERE (u.PhoneNumber IS NULL OR u.PhoneNumber = N'')
  AND e.PhoneNumber IS NOT NULL AND e.PhoneNumber <> N'';

SELECT u.Id, u.EmployeeId, u.UserName, u.PhoneNumber
FROM AspNetUsers u
WHERE u.DeletedTime IS NULL
ORDER BY u.Id;
