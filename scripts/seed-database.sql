-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (name, email, password) VALUES 
('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm'),
('Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (name, description, user_id) VALUES 
('Website Redesign', 'Complete redesign of company website', 1),
('Mobile App Development', 'Build iOS and Android mobile application', 1),
('Database Migration', 'Migrate legacy database to new system', 2),
('Marketing Campaign', 'Q1 2024 marketing campaign planning', 2)
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, status, priority, due_date) VALUES 
('Design Homepage', 'Create new homepage design mockups', 1, 'completed', 'high', '2024-01-15'),
('Implement Navigation', 'Build responsive navigation component', 1, 'in_progress', 'medium', '2024-01-20'),
('User Authentication', 'Implement login and signup functionality', 2, 'pending', 'high', '2024-02-01'),
('Push Notifications', 'Add push notification support', 2, 'pending', 'low', '2024-02-15'),
('Data Backup', 'Create backup procedures for migration', 3, 'completed', 'high', '2024-01-10'),
('Schema Design', 'Design new database schema', 3, 'in_progress', 'medium', '2024-01-25'),
('Content Strategy', 'Develop content strategy document', 4, 'pending', 'medium', '2024-02-05'),
('Social Media Plan', 'Create social media posting schedule', 4, 'pending', 'low', '2024-02-10');
