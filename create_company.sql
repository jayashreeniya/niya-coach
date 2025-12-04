-- Insert a sample company
INSERT INTO companies (name, email, address, hr_code, employee_code, created_at, updated_at)
VALUES ('Test Company', 'test@company.com', '123 Test Street', 'HR001', 'EMP001', NOW(), NOW());

SELECT * FROM companies WHERE name = 'Test Company';


