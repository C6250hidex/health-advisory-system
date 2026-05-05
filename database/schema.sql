-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS health_system_db;
USE health_system_db;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT
);

-- 4. Health Advisory Table
CREATE TABLE IF NOT EXISTS health_advice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keywords VARCHAR(255) NOT NULL,
    advice_text TEXT NOT NULL
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT unique_booking UNIQUE (doctor_id, appointment_date, appointment_time)
);

-- 6. Insert Initial Data
INSERT INTO doctors (name, specialization, experience_years) 
VALUES ('Dr. Alice Johnson', 'General Physician', 10), ('Dr. Robert Smith', 'Pediatrician', 8);

INSERT INTO health_advice (keywords, advice_text) 
VALUES 
INSERT INTO health_advice (keywords, advice_text) 
VALUES 
('fever, headache', 'Rest and stay hydrated.'), ('cough, cold', 'Drink warm fluids.');
('stomach, ache, pain, bloating', 'Avoid solid foods for a few hours. Sip water or clear fluids. If the pain is sharp and on the lower right side, seek emergency care immediately.'),
('malaria, chills, shivering, body pain', 'Malaria often starts with high fever and chills. Please visit a lab for a blood test and consult a doctor for a prescription.'),
('allergy, itching, rash, skin', 'Avoid scratching. Use a cool compress. Over-the-counter antihistamines may help, but see a doctor if your face or throat begins to swell.'),
('fatigue, tired, weakness', 'Ensure you are getting 7-9 hours of sleep. Check your hydration and iron intake. If tiredness lasts for weeks, a blood test is recommended.'),
('diarrhea, stooling, vomiting', 'The biggest risk is dehydration. Drink ORS (Oral Rehydration Salts) or salted rice water. Avoid dairy and caffeine until you feel better.');



USE health_system_db;
DELETE FROM health_advice WHERE id BETWEEN 1 AND 7;
-- 1. Reset the counter to 0
SET @count = 0;
-- 2. Update all existing IDs to start from 1, 2, 3...
UPDATE health_advice SET id = (@count:= @count + 1);
-- 3. Ensure the next new advice starts after the last number
ALTER TABLE health_advice AUTO_INCREMENT = 1;

USE health_system_db;
-- Now run your search again:
SELECT * FROM users WHERE id BETWEEN 1 AND 7;
DELETE FROM users WHERE id BETWEEN 1 AND 7;
ALTER TABLE users AUTO_INCREMENT = 1;

INSERT INTO doctors (name, specialization, experience_years) 
VALUES ('Dr.John Kenneth', 'General Surgeon', 5);
-- Check the list
SELECT * FROM doctors;


USE health_system_db;
-- 1. Update the role options
ALTER TABLE users MODIFY COLUMN role ENUM('user', 'doctor', 'admin') DEFAULT 'user';
-- 2. Link doctors to users table
-- This allows a "User" with role 'doctor' to have a profile in the doctors table
ALTER TABLE doctors ADD COLUMN user_id INT UNIQUE;
ALTER TABLE doctors ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


USE health_system_db;
-- Add verification column
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0;

-- Set your specific account as Admin
-- (Run this AFTER you register this email on the site)
UPDATE users SET role = 'admin', is_verified = 1 WHERE email = 'chidex2004@gmail.com';


USE health_system_db;

-- Clear previous test data to start fresh if you want, or just add these
INSERT INTO health_advice (keywords, advice_text) 
VALUES 
('malaria, fever, chills, shivering', 'Malaria is common. You need a parasite test. Advice: Use insecticide-treated nets and consult a doctor for ACT-based treatment.'),
('typhoid, stomach pain, fever, weakness', 'Typhoid is spread through contaminated water. Advice: Boil drinking water, maintain high hygiene, and get a Widal test at a clinic.'),
('diabetes, sugar, thirst, frequent urination', 'Diabetes requires careful monitoring. Advice: Reduce sugar intake, stay active, and consult an endocrinologist for a glucose test.'),
('hypertension, blood pressure, dizziness', 'High blood pressure can be silent. Advice: Reduce salt intake, avoid stress, and monitor your BP daily. Seek a doctor for a prescription.'),
('asthma, breathing, wheezing, chest tightness', 'Asthma triggers vary. Advice: Keep your inhaler close, avoid dusty environments, and see a pulmonologist for a long-term plan.'),
('ulcer, stomach burn, hunger pain', 'Stomach ulcers are often caused by H. pylori. Advice: Avoid spicy foods, NSAIDs (like Ibuprofen), and eat small, frequent meals.'),
('flu, cold, runny nose, sneezing', 'The common flu is viral. Advice: Vitamin C, steam inhalation, plenty of rest, and warm fluids like ginger tea.'),
('depression, sadness, low energy, mood', 'Mental health is vital. Advice: Reach out to a trusted friend or professional counselor. You are not alone. Consider therapy.'),
('toothache, gum pain, swelling', 'Dental pain is often deep-seated. Advice: Rinse with warm salt water. Avoid very cold or hot food. See a dentist immediately.'),
('pregnancy, nausea, morning sickness', 'Prenatal care is key. Advice: Take folic acid, stay hydrated, and register for antenatal care at a verified hospital.');


USE health_system_db;
UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'chidex6250@gmail.com';


USE health_system_db;

-- 1. Add Doctor Active Status
ALTER TABLE doctors ADD COLUMN is_active BOOLEAN DEFAULT 1;

-- 2. Create Audit Logs Table (For Admin Performance Tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100), -- e.g., 'USER_DELETED', 'APPOINTMENT_REJECTED'
    performed_by INT,         -- user_id of the person who did the action
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE health_system_db;

-- 1. Add Medical Profile fields to Users
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN dob DATE,
ADD COLUMN gender ENUM('Male', 'Female', 'Other');

-- 2. Add Clinical details to Appointments
ALTER TABLE appointments 
ADD COLUMN reason TEXT,
ADD COLUMN instructions TEXT; -- This is what the doctor writes


USE health_system_db;

-- Add the columns using standard syntax
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN dob DATE;
ALTER TABLE users ADD COLUMN gender ENUM('Male', 'Female', 'Other');
ALTER TABLE users ADD COLUMN address TEXT;


USE health_system_db;
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    sender_id INT,
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);


USE health_system_db;
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100),
    performed_by INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

USE health_system_db;

-- ALTER TABLE doctors 
-- ADD COLUMN bio TEXT, 
-- ADD COLUMN clinic_address TEXT;
ALTER TABLE doctors CHANGE phone_number phone VARCHAR(20);
DESCRIBE doctors;
USE health_system_db;

-- Rename the column in the 'users' table
ALTER TABLE users CHANGE phone_number phone VARCHAR(20);

-- Verify the change
DESCRIBE users;




USE health_system_db;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(255),
    category VARCHAR(50),
    author_id INT,
    read_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);


USE health_system_db;
UPDATE posts
SET category = 'Fitness'
WHERE id = 4;



