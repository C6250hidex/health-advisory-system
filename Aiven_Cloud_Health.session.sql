-- 1. Setup Database
USE defaultdb;
UPDATE users SET role = 'admin', is_verified = 1 WHERE email = 'chidex6250@gmail.com';
-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'doctor', 'admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT 0,
    phone VARCHAR(20),
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    bio TEXT,
    experience_years INT DEFAULT 0,
    clinic_address TEXT,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Health Advice Table
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
    reason TEXT,
    instructions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT unique_booking UNIQUE (doctor_id, appointment_date, appointment_time)
);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    sender_id INT,
    message_text TEXT,
    sender_role VARCHAR(50),
    sender_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(100),
    performed_by INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Posts Table (Blog)
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

-- -- 9. SEED INITIAL DOCTORS (Crucial for testing)
-- INSERT INTO doctors (name, specialization, is_active, bio) VALUES 
-- ('Dr. Adaeze Okonkwo', 'General Physician', 1, 'Expert in family medicine with 12 years of experience.'),
-- ('Dr. Emeka Nwosu', 'Cardiologist', 1, 'Heart specialist focused on preventive cardiology.'),
-- ('Dr. Sarah Lee', 'Pediatrician', 1, 'Compassionate care for children and infants.');

-- 10. SEED INITIAL ADVICE
INSERT INTO health_advice (keywords, advice_text) VALUES 
('malaria, fever, chills, shivering', 'Malaria is common. You need a parasite test. Advice: Use insecticide-treated nets and consult a doctor for ACT-based treatment.'),
('typhoid, stomach pain, fever, weakness', 'Typhoid is spread through contaminated water. Advice: Boil drinking water, maintain high hygiene, and get a Widal test at a clinic.'),
('diabetes, sugar, thirst, frequent urination', 'Diabetes requires careful monitoring. Advice: Reduce sugar intake, stay active, and consult an endocrinologist for a glucose test.'),
('hypertension, blood pressure, dizziness', 'High blood pressure can be silent. Advice: Reduce salt intake, avoid stress, and monitor your BP daily.'),
('asthma, breathing, wheezing, chest tightness', 'Asthma triggers vary. Advice: Keep your inhaler close, avoid dusty environments, and see a pulmonologist.'),
('ulcer, stomach burn, hunger pain', 'Stomach ulcers are often caused by H. pylori. Advice: Avoid spicy foods and NSAIDs (like Ibuprofen).'),
('flu, cold, runny nose, sneezing', 'The common flu is viral. Advice: Vitamin C, steam inhalation, and plenty of rest.'),
('depression, sadness, low energy, mood', 'Mental health is vital. Advice: Reach out to a trusted friend or professional counselor.'),
('toothache, gum pain, swelling', 'Dental pain is deep-seated. Advice: Rinse with warm salt water. See a dentist immediately.'),
('pregnancy, nausea, morning sickness', 'Prenatal care is key. Advice: Take folic acid and register for antenatal care.');