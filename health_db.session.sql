SELECT * FROM health_advice WHERE id BETWEEN 1 AND 30;INSERT INTO health_advice (id, keywords, advice_text)

USE health_system_db;
ALTER TABLE messages ADD COLUMN sender_role VARCHAR(50);
ALTER TABLE messages ADD COLUMN sender_name VARCHAR(100);
INSERT INTO doctors (name, specialization) VALUES ('Dr. Adaeze Okonkwo', 'General Physician'), ('Dr. Emeka Nwosu', 'Cardiologist');