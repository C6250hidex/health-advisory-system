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
INSERT INTO health_advice (keywords, advice_text) VALUES ('headache', 'Persistent headaches may be caused by stress, dehydration, or fatigue. Advice: Stay hydrated, rest properly, and reduce screen exposure.'),

('fever', 'Fever may indicate infection. Advice: Drink plenty of fluids, rest adequately, and monitor your temperature regularly.'),

('cough', 'A cough can result from irritation or infection. Advice: Drink warm fluids, avoid smoke exposure, and get sufficient rest.'),

('cold', 'The common cold is usually viral. Advice: Vitamin C, steam inhalation, warm fluids, and plenty of rest.'),

('sore throat', 'Sore throat may occur due to infection or irritation. Advice: Gargle warm salt water and stay hydrated.'),

('stomach pain', 'Stomach pain may result from indigestion or infection. Advice: Avoid spicy foods and drink clean water.'),

('vomiting', 'Vomiting can lead to dehydration. Advice: Sip fluids slowly and avoid heavy meals until symptoms improve.'),

('diarrhea', 'Diarrhea may cause dehydration. Advice: Increase fluid intake and consume light meals.'),

('dizziness', 'Dizziness may result from dehydration or low blood pressure. Advice: Sit down, rest, and drink water.'),

('fatigue', 'Fatigue may be caused by stress or lack of sleep. Advice: Maintain healthy sleep habits and balanced nutrition.'),

('high blood pressure', 'High blood pressure increases cardiovascular risk. Advice: Reduce salt intake and exercise regularly.'),

('low blood pressure', 'Low blood pressure may cause weakness or fainting. Advice: Stay hydrated and rise slowly when standing.'),

('toothache', 'Tooth pain may indicate infection or decay. Advice: Rinse with warm water and seek dental evaluation.'),

('ear pain', 'Ear pain may result from infection or pressure buildup. Advice: Avoid inserting objects into the ear.'),

('eye redness', 'Eye redness may occur from irritation or infection. Advice: Avoid rubbing the eyes and maintain hygiene.'),

('skin rash', 'Skin rashes may result from allergies or irritation. Advice: Keep the skin clean and avoid scratching.'),

('allergy', 'Allergic reactions can vary in severity. Advice: Avoid known triggers and seek medical care if swelling occurs.'),

('asthma', 'Asthma affects breathing and airway function. Advice: Use prescribed inhalers and avoid smoke exposure.'),

('anxiety', 'Anxiety can affect mental and physical well-being. Advice: Practice deep breathing and reduce stress triggers.'),

('depression', 'Depression affects mood and daily activities. Advice: Seek emotional support and professional help if symptoms persist.'),

('insomnia', 'Insomnia may affect concentration and energy. Advice: Maintain a consistent sleep routine and avoid caffeine late at night.'),

('migraine', 'Migraines may cause severe headaches and sensitivity to light. Advice: Rest in a dark, quiet room.'),

('dehydration', 'Dehydration occurs when the body loses excess fluids. Advice: Increase water intake and avoid excessive heat exposure.'),

('joint pain', 'Joint pain may result from inflammation or strain. Advice: Rest affected joints and apply warm compresses.'),

('muscle cramps', 'Muscle cramps may occur due to dehydration or overuse. Advice: Stretch gently and drink electrolyte-rich fluids.'),

('neck pain', 'Neck pain may result from poor posture or strain. Advice: Maintain good posture and avoid sudden movements.'),

('constipation', 'Constipation affects bowel movement frequency. Advice: Increase fiber intake and drink more water.'),

('heartburn', 'Heartburn may result from acid reflux. Advice: Avoid spicy foods and avoid lying down after meals.'),

('flu', 'Flu symptoms may include fever, weakness, and body pain. Advice: Rest, hydrate, and monitor symptoms carefully.'),

('nasal congestion', 'Blocked nasal passages may result from infection or allergies. Advice: Use steam inhalation and drink warm fluids.'),

('sinus pain', 'Sinus pain may occur due to inflammation or infection. Advice: Apply warm compresses and stay hydrated.'),

('weight loss', 'Unexplained weight loss may require medical evaluation. Advice: Maintain balanced meals and monitor symptoms.'),

('weight gain', 'Weight gain may result from lifestyle or hormonal factors. Advice: Increase physical activity and maintain healthy eating.'),

('diabetes', 'Diabetes affects blood sugar regulation. Advice: Monitor blood sugar levels and maintain a balanced diet.'),

('burning urination', 'Burning urination may indicate infection. Advice: Increase water intake and seek medical evaluation.'),

('kidney pain', 'Kidney pain may indicate infection or stones. Advice: Seek prompt medical attention if symptoms persist.'),

('swollen feet', 'Swollen feet may result from fluid retention or poor circulation. Advice: Elevate the legs and reduce prolonged standing.'),

('fainting', 'Fainting may indicate low blood pressure or other medical issues. Advice: Lie flat and seek medical evaluation.'),

('seizure', 'Seizures require immediate medical attention. Advice: Protect the person from injury and seek emergency care.'),

('burns', 'Burn injuries should be cooled immediately. Advice: Use cool running water and avoid applying oil or toothpaste.'),

('cuts', 'Cuts and wounds should be cleaned properly. Advice: Wash with clean water and apply sterile dressing.'),

('nose bleeding', 'Nosebleeds may occur from dryness or injury. Advice: Pinch the nose gently and lean slightly forward.'),

('food poisoning', 'Food poisoning may cause vomiting and diarrhea. Advice: Stay hydrated and seek care if symptoms worsen.'),

('pregnancy nausea', 'Pregnancy nausea is common in early pregnancy. Advice: Eat small frequent meals and avoid strong odors.'),

('menstrual pain', 'Menstrual cramps may cause lower abdominal discomfort. Advice: Apply warm compresses and stay hydrated.'),

('acne', 'Acne may occur due to excess oil production. Advice: Wash gently and avoid harsh skin products.'),

('hair loss', 'Hair loss may result from stress or nutritional deficiency. Advice: Maintain balanced nutrition and reduce harsh treatments.'),

('dry skin', 'Dry skin may worsen in harsh weather conditions. Advice: Use moisturizers regularly and drink enough water.'),

('heat stroke', 'Heat stroke is a medical emergency caused by overheating. Advice: Seek emergency medical care immediately.'),

('panic attack', 'Panic attacks may cause rapid breathing and fear. Advice: Practice slow breathing and seek mental health support.'),('shortness of breath', 'Difficulty breathing may indicate a serious medical condition. Advice: Sit upright and seek urgent medical attention.'),

('back pain', 'Back pain may result from strain or poor posture. Advice: Avoid heavy lifting and apply warm compresses.'),

('chest congestion', 'Chest congestion may occur with respiratory infections. Advice: Drink warm fluids and rest adequately.'),

('wheezing', 'Wheezing may indicate airway narrowing. Advice: Avoid smoke exposure and seek medical care if symptoms worsen.'),

('loss of taste', 'Loss of taste may occur during infections. Advice: Stay hydrated and monitor additional symptoms.'),

('loss of smell', 'Loss of smell may result from infections or allergies. Advice: Seek medical advice if symptoms persist.'),

('swollen lymph nodes', 'Swollen lymph nodes may indicate infection. Advice: Rest adequately and monitor for fever.'),

('mouth ulcers', 'Mouth ulcers may result from irritation or stress. Advice: Avoid spicy foods and maintain oral hygiene.'),

('gum bleeding', 'Bleeding gums may indicate poor oral health. Advice: Brush gently and schedule a dental evaluation.'),

('hip pain', 'Hip pain may result from joint strain or inflammation. Advice: Rest the joint and avoid strenuous activity.'),

('shoulder pain', 'Shoulder pain may occur from muscle strain or injury. Advice: Apply ice packs and avoid heavy lifting.'),

('arm numbness', 'Arm numbness may indicate nerve issues. Advice: Seek medical attention if symptoms persist.'),

('tingling sensation', 'Tingling sensations may result from nerve irritation. Advice: Monitor symptoms and seek evaluation if worsening.'),

('persistent sneezing', 'Frequent sneezing may be related to allergies. Advice: Avoid allergens and keep surroundings clean.'),

('chills', 'Chills may accompany infections or fever. Advice: Keep warm and monitor body temperature.'),

('excessive sweating', 'Excessive sweating may result from stress or illness. Advice: Stay hydrated and seek medical advice if persistent.'),

('jaw pain', 'Jaw pain may result from dental issues or strain. Advice: Avoid hard foods and seek professional evaluation.'),

('general weakness', 'General weakness may result from illness or fatigue. Advice: Rest properly and maintain hydration.'),

('rapid heartbeat', 'Rapid heartbeat may occur due to stress or heart conditions. Advice: Avoid stimulants and seek medical evaluation.'),

('blurred vision', 'Blurred vision may indicate eye or neurological problems. Advice: Avoid driving and seek immediate medical attention.'),

('dry mouth', 'Dry mouth may result from dehydration or medication effects. Advice: Increase water intake regularly.'),

('excessive thirst', 'Excessive thirst may indicate dehydration or diabetes. Advice: Maintain hydration and monitor symptoms.'),

('difficulty hearing', 'Hearing difficulty may result from infection or wax buildup. Advice: Avoid loud noises and seek medical evaluation.'),

('swollen glands', 'Swollen glands may occur during infections. Advice: Rest adequately and monitor for fever.'),

('finger pain', 'Finger pain may result from strain or injury. Advice: Rest the affected hand and avoid repetitive motion.'),

('wrist pain', 'Wrist pain may occur due to overuse or strain. Advice: Use wrist support and rest the joint.'),

('elbow pain', 'Elbow pain may result from repetitive activities. Advice: Apply ice and reduce strain on the joint.'),

('ankle swelling', 'Ankle swelling may result from injury or fluid retention. Advice: Elevate the foot and reduce walking.'),

('foot pain', 'Foot pain may occur due to poor footwear or strain. Advice: Wear supportive shoes and rest adequately.'),

('heel pain', 'Heel pain may result from excessive pressure or inflammation. Advice: Stretch the foot gently and avoid prolonged standing.'),

('dry eyes', 'Dry eyes may result from excessive screen time. Advice: Rest the eyes and reduce screen exposure.'),

('watery eyes', 'Watery eyes may occur due to irritation or allergies. Advice: Avoid irritants and maintain eye hygiene.'),

('light sensitivity', 'Sensitivity to light may occur with migraines or eye issues. Advice: Rest in dim environments and seek medical advice if persistent.'),

('bloating', 'Bloating may occur after heavy meals or digestive issues. Advice: Avoid carbonated drinks and eat slowly.'),

('gas pain', 'Gas pain may result from digestion issues. Advice: Avoid foods that trigger discomfort and eat slowly.'),

('indigestion', 'Indigestion may occur after overeating or spicy meals. Advice: Avoid heavy meals and maintain healthy eating habits.'),

('acid reflux', 'Acid reflux may cause burning chest discomfort. Advice: Avoid lying down after meals and reduce fatty foods.'),

('blood in urine', 'Blood in urine may indicate infection or kidney problems. Advice: Seek immediate medical evaluation.'),

('pelvic pain', 'Pelvic pain may result from infection or reproductive conditions. Advice: Rest and consult a healthcare provider.'),

('breast pain', 'Breast pain may occur due to hormonal changes or strain. Advice: Monitor symptoms and seek evaluation if persistent.'),

('irregular menstruation', 'Irregular menstrual cycles may result from stress or hormonal imbalance. Advice: Monitor cycles and seek medical advice if persistent.'),

('persistent coughing', 'Persistent coughing may indicate infection or irritation. Advice: Stay hydrated and seek care if symptoms continue.'),

('sleep apnea', 'Sleep apnea may affect breathing during sleep. Advice: Consult a sleep specialist for evaluation.'),

('snoring', 'Snoring may be linked to airway obstruction. Advice: Maintain healthy weight and avoid sleeping on the back.'),

('mood swings', 'Mood swings may result from stress or hormonal changes. Advice: Maintain healthy routines and manage stress levels.'),

('hallucinations', 'Hallucinations require urgent psychiatric or medical evaluation. Advice: Seek immediate professional help.'),

('hyperventilation', 'Rapid breathing may occur during anxiety or panic attacks. Advice: Focus on slow controlled breathing.'),

('restlessness', 'Restlessness may result from stress or anxiety. Advice: Reduce caffeine intake and practice relaxation techniques.'),

('sleepwalking', 'Sleepwalking may occur due to sleep disturbances. Advice: Maintain a safe sleeping environment and seek medical advice if frequent.'),

('bone pain', 'Bone pain may indicate injury or underlying conditions. Advice: Rest and seek medical evaluation if persistent.'),

('balance problems', 'Balance issues may increase fall risk. Advice: Seek neurological evaluation promptly.'),

('yellow skin', 'Yellowing of the skin may indicate liver problems. Advice: Seek immediate medical attention.'),

('persistent bruising', 'Frequent bruising may indicate clotting or nutritional issues. Advice: Seek medical evaluation promptly.'),

('swollen lips', 'Lip swelling may result from allergic reactions. Advice: Seek emergency care if breathing becomes difficult.'),

('difficulty speaking', 'Difficulty speaking may indicate neurological emergencies. Advice: Seek emergency medical attention immediately.'),

('facial drooping', 'Facial drooping may be a sign of stroke. Advice: Seek emergency medical care immediately.'),

('loss of consciousness', 'Loss of consciousness is a medical emergency. Advice: Call emergency services immediately.'),

('poor appetite', 'Poor appetite may occur during illness or stress. Advice: Encourage balanced meals and stay hydrated.'),

('night sweats', 'Night sweats may occur with infections or hormonal changes. Advice: Monitor symptoms and seek medical advice if persistent.'),

('blue lips', 'Blue lips may indicate low oxygen levels. Advice: Seek emergency medical assistance immediately.'),

('weak pulse', 'A weak pulse may indicate circulatory problems. Advice: Seek urgent medical evaluation.'),

('difficulty opening mouth', 'Difficulty opening the mouth may result from infection or jaw disorders. Advice: Seek dental or medical evaluation.'),

('bloody cough', 'Coughing blood may indicate serious respiratory conditions. Advice: Seek emergency medical attention immediately.'),

('chest tightness', 'Chest tightness may indicate breathing or heart problems. Advice: Avoid strenuous activity and seek medical evaluation.'),

('persistent fear', 'Persistent fear may affect daily functioning. Advice: Seek mental health support and counseling.'),

('muscle spasms', 'Muscle spasms may occur due to dehydration or strain. Advice: Stretch gently and stay hydrated.'),

('reduced mobility', 'Reduced mobility may result from injury or illness. Advice: Seek medical evaluation and physical therapy if needed.'),('cold hands and feet', 'Cold hands and feet may result from poor circulation. Advice: Keep warm and monitor for circulation problems.'),

('tingling feet', 'Tingling feet may indicate nerve irritation or poor circulation. Advice: Seek medical evaluation if symptoms persist.'),

('dry hair', 'Dry hair may result from dehydration or nutritional deficiency. Advice: Maintain balanced nutrition and proper hair care.'),

('brittle nails', 'Brittle nails may indicate nutritional deficiencies. Advice: Improve nutrition and avoid harsh chemicals.'),

('difficulty standing', 'Difficulty standing may indicate weakness or neurological issues. Advice: Seek urgent medical evaluation.'),

('sharp back pain', 'Sharp back pain may result from muscle strain or injury. Advice: Avoid strenuous activity and seek medical care if severe.'),

('confusion after injury', 'Confusion following injury may indicate serious head trauma. Advice: Seek emergency medical attention immediately.'),

('severe migraine', 'Severe migraines may cause intense pain and sensitivity to light. Advice: Rest in a dark room and seek medical care if severe.'),

('child breathing difficulty', 'Breathing difficulty in children requires urgent attention. Advice: Seek emergency pediatric care immediately.'),

('child rash', 'Rashes in children may result from allergies or infections. Advice: Monitor symptoms and consult a pediatrician if worsening.'),

('child dehydration', 'Children can become dehydrated quickly. Advice: Use oral rehydration solutions and seek medical care promptly.'),

('baby refusing food', 'Loss of appetite in babies may indicate illness. Advice: Monitor hydration and seek pediatric advice if persistent.'),

('persistent crying in infants', 'Persistent crying in infants may indicate discomfort or illness. Advice: Check for fever or discomfort and consult a pediatrician.'),

('swollen abdomen', 'Abdominal swelling may indicate digestive or medical conditions. Advice: Seek medical evaluation if swelling persists.'),

('rapid breathing', 'Rapid breathing may indicate respiratory distress. Advice: Sit upright and seek medical attention immediately.'),

('blue fingertips', 'Blue fingertips may indicate poor oxygen circulation. Advice: Seek emergency medical evaluation immediately.'),

('swollen veins', 'Swollen veins may occur due to circulation problems. Advice: Elevate the legs and seek medical advice if painful.'),

('persistent paleness', 'Persistent paleness may indicate anemia or illness. Advice: Maintain iron-rich nutrition and seek medical evaluation.'),

('swollen tongue', 'Tongue swelling may indicate severe allergic reactions. Advice: Seek emergency medical care immediately.'),

('persistent dry cough', 'A prolonged dry cough may indicate infection or irritation. Advice: Stay hydrated and seek medical advice if symptoms continue.'),

('persistent wheezing', 'Persistent wheezing may indicate asthma or respiratory conditions. Advice: Seek medical care promptly.'),

('loss of energy', 'Loss of energy may result from illness or stress. Advice: Maintain proper sleep, nutrition, and hydration.'),

('difficulty remembering', 'Memory difficulties may result from stress or neurological conditions. Advice: Maintain mental exercises and seek medical advice if worsening.'),

('sudden mood changes', 'Sudden mood changes may indicate emotional or hormonal imbalance. Advice: Monitor stress levels and seek support if severe.'),

('frequent crying', 'Frequent crying may indicate emotional distress. Advice: Seek emotional support and mental health assistance if persistent.'),

('extreme stress', 'Extreme stress may affect both physical and mental health. Advice: Practice stress management techniques and seek counseling support.'),

('isolation feelings', 'Feelings of isolation may affect emotional well-being. Advice: Stay socially connected and seek support from trusted individuals.'),

('trouble relaxing', 'Difficulty relaxing may result from stress or anxiety. Advice: Practice meditation and relaxation exercises.'),

('excessive worry', 'Excessive worry may interfere with daily activities. Advice: Reduce stress triggers and seek counseling if persistent.'),

('frequent anger', 'Frequent anger may affect relationships and mental health. Advice: Practice emotional control techniques and stress management.'),

('persistent irritability', 'Irritability may result from stress or lack of sleep. Advice: Maintain healthy routines and adequate rest.'),

('daytime drowsiness', 'Daytime drowsiness may indicate poor sleep quality. Advice: Maintain healthy sleep habits and avoid late-night screen use.'),

('persistent nightmares', 'Frequent nightmares may be linked to stress or anxiety. Advice: Reduce stress and seek support if symptoms worsen.'),

('sleep paralysis', 'Sleep paralysis may occur during disrupted sleep cycles. Advice: Maintain healthy sleep routines and reduce stress.'),

('restless legs', 'Restless legs may interfere with sleep quality. Advice: Stretch regularly and avoid caffeine before bedtime.'),

('poor posture pain', 'Pain from poor posture may affect the back and neck. Advice: Improve posture habits and stretch regularly.'),

('persistent shoulder stiffness', 'Shoulder stiffness may result from overuse or strain. Advice: Apply warm compresses and avoid heavy lifting.'),

('chronic neck pain', 'Chronic neck pain may result from poor posture or strain. Advice: Maintain ergonomic posture and seek medical advice if persistent.'),

('severe joint pain', 'Severe joint pain may indicate inflammation or injury. Advice: Seek medical assessment promptly.'),

('limited joint movement', 'Limited joint movement may affect mobility. Advice: Rest the joint and seek physiotherapy if necessary.'),

('swollen knees', 'Swollen knees may result from injury or inflammation. Advice: Rest, elevate the leg, and apply ice packs.'),

('difficulty running', 'Difficulty running may indicate muscle or joint issues. Advice: Avoid strenuous exercise and seek medical evaluation.'),

('difficulty sitting long', 'Difficulty sitting for long periods may result from posture or spinal issues. Advice: Take regular breaks and improve sitting posture.'),

('persistent chills', 'Persistent chills may indicate infection or illness. Advice: Monitor temperature and seek medical advice if symptoms continue.'),

('excessive bruising', 'Excessive bruising may indicate clotting or health issues. Advice: Seek medical evaluation promptly.'),

('weak immune system', 'A weak immune system may increase infection risk. Advice: Maintain balanced nutrition, exercise, and adequate sleep.'),

('persistent fever', 'Persistent fever may indicate ongoing infection. Advice: Seek medical evaluation for proper diagnosis.'),

('frequent infections', 'Frequent infections may indicate immune system issues. Advice: Maintain hygiene and seek medical evaluation.'),

('cold exposure', 'Excessive cold exposure may affect circulation and body temperature. Advice: Warm the body gradually and avoid prolonged cold exposure.'),

('heat exhaustion', 'Heat exhaustion may result from excessive heat exposure. Advice: Move to a cool environment and drink fluids immediately.'),

('smoking effects', 'Smoking increases the risk of lung and heart disease. Advice: Reduce tobacco exposure and seek cessation support.'),

('alcohol overuse', 'Excessive alcohol use may affect liver and mental health. Advice: Limit alcohol intake and seek professional help if needed.'),

('high cholesterol', 'High cholesterol increases cardiovascular risk. Advice: Reduce fatty foods and exercise regularly.'),

('palpitations', 'Heart palpitations may occur from stress or stimulants. Advice: Reduce caffeine intake and seek medical evaluation if persistent.'),

('memory problems', 'Memory problems may affect daily activities. Advice: Maintain mental stimulation and consult a doctor if worsening.'),

('swallowing difficulty', 'Difficulty swallowing may indicate throat or neurological issues. Advice: Seek prompt medical attention.'),

('leg swelling', 'Leg swelling may indicate circulation problems or injury. Advice: Elevate the leg and seek medical care if persistent.'),

('hand tremors', 'Hand tremors may result from stress or neurological conditions. Advice: Reduce caffeine and seek evaluation if persistent.'),

('wet cough', 'A wet cough may indicate infection or mucus buildup. Advice: Monitor mucus color and stay hydrated.'),

('chest pain while breathing', 'Chest pain during breathing may indicate lung or heart conditions. Advice: Seek urgent medical evaluation.'),

('difficulty waking up', 'Difficulty waking up may indicate sleep deprivation or health conditions. Advice: Maintain proper sleep routines and seek medical advice if persistent.'),

('persistent vomiting in child', 'Persistent vomiting in children can lead to dehydration. Advice: Encourage fluids and seek pediatric care immediately.'),

('child wheezing', 'Wheezing in children may indicate asthma or respiratory infection. Advice: Seek immediate pediatric medical attention.'),

('infant fever', 'Fever in infants requires prompt medical evaluation. Advice: Seek pediatric care immediately, especially in newborns.'),

('infant breathing difficulty', 'Breathing difficulty in infants is a medical emergency. Advice: Seek emergency pediatric care immediately.'),

('poor circulation', 'Poor circulation may cause numbness and cold extremities. Advice: Stay active and seek medical evaluation if symptoms worsen.'),

('persistent sadness', 'Persistent sadness may indicate depression or emotional distress. Advice: Seek emotional support and professional mental health care if needed.'),('itchy eyes', 'Itchy eyes may result from allergies or irritation. Advice: Avoid rubbing the eyes and maintain good hygiene.'),

('eye pain', 'Eye pain may indicate infection or injury. Advice: Avoid touching the eye and seek medical attention promptly.'),

('eye swelling', 'Swollen eyes may result from allergies or infection. Advice: Apply a cool compress and seek medical evaluation if severe.'),

('red spots on skin', 'Red spots on the skin may indicate irritation or infection. Advice: Keep the skin clean and seek medical advice if spreading.'),

('skin peeling', 'Skin peeling may occur from dryness or skin conditions. Advice: Moisturize regularly and avoid harsh chemicals.'),

('itchy scalp', 'An itchy scalp may result from dryness or infection. Advice: Use gentle hair products and maintain scalp hygiene.'),

('scalp rash', 'Scalp rashes may occur due to irritation or infection. Advice: Avoid scratching and seek medical advice if symptoms worsen.'),

('cracked lips', 'Cracked lips may result from dehydration or weather exposure. Advice: Stay hydrated and use lip moisturizers.'),

('dry throat', 'Dry throat may occur from dehydration or irritation. Advice: Drink warm fluids and avoid smoking.'),

('persistent hiccups', 'Persistent hiccups may indicate irritation or digestive issues. Advice: Drink water slowly and seek medical care if prolonged.'),

('difficulty swallowing food', 'Difficulty swallowing food may indicate throat or neurological conditions. Advice: Seek prompt medical evaluation.'),

('painful swallowing', 'Pain while swallowing may result from throat infection. Advice: Drink warm fluids and seek medical advice if severe.'),

('swollen gums', 'Swollen gums may indicate gum disease or infection. Advice: Maintain oral hygiene and schedule dental evaluation.'),

('tooth sensitivity', 'Tooth sensitivity may occur due to enamel wear or cavities. Advice: Avoid very hot or cold foods and seek dental care.'),

('bad breath', 'Persistent bad breath may indicate oral or digestive problems. Advice: Maintain oral hygiene and stay hydrated.'),

('mouth dryness', 'Dry mouth may result from dehydration or medications. Advice: Increase water intake and avoid alcohol-based mouthwash.'),

('jaw stiffness', 'Jaw stiffness may result from strain or dental issues. Advice: Avoid hard foods and seek dental evaluation if persistent.'),

('persistent ear ringing', 'Constant ringing in the ears may indicate hearing issues. Advice: Avoid loud noise exposure and seek medical advice.'),

('ear blockage', 'Ear blockage may result from wax buildup or infection. Advice: Avoid inserting objects into the ear.'),

('hearing loss', 'Hearing loss may occur from infection or prolonged noise exposure. Advice: Seek medical evaluation promptly.'),

('sinus congestion', 'Sinus congestion may result from allergies or infection. Advice: Use steam inhalation and stay hydrated.'),

('sinus headache', 'Sinus headaches may occur from sinus inflammation. Advice: Apply warm compresses and rest adequately.'),

('post nasal drip', 'Post nasal drip may cause throat irritation and coughing. Advice: Stay hydrated and avoid allergens.'),

('persistent sneezing in morning', 'Morning sneezing may indicate allergies. Advice: Keep the environment dust-free and avoid triggers.'),

('breathing difficulty at night', 'Nighttime breathing difficulty may indicate respiratory conditions. Advice: Seek medical evaluation promptly.'),

('shortness of breath while walking', 'Breathing difficulty during walking may indicate heart or lung issues. Advice: Seek medical evaluation.'),

('persistent chest discomfort', 'Persistent chest discomfort should not be ignored. Advice: Seek urgent medical attention.'),

('pain under ribs', 'Pain under the ribs may result from digestive or muscular issues. Advice: Rest and seek medical advice if persistent.'),

('abdominal cramps', 'Abdominal cramps may result from digestion or infection. Advice: Stay hydrated and avoid heavy meals.'),

('loss of appetite in child', 'Poor appetite in children may indicate illness or stress. Advice: Encourage nutritious meals and monitor hydration.'),

('child stomach pain', 'Stomach pain in children may result from infection or indigestion. Advice: Monitor symptoms and seek pediatric advice if severe.'),

('child diarrhea', 'Diarrhea in children may quickly cause dehydration. Advice: Use oral rehydration solutions and seek care if persistent.'),

('persistent crying child', 'Persistent crying in children may indicate discomfort or illness. Advice: Monitor symptoms and seek pediatric evaluation.'),

('child fever at night', 'Night fever in children requires monitoring. Advice: Keep the child hydrated and seek medical care if fever persists.'),

('baby cough', 'Coughing in babies may indicate infection or irritation. Advice: Keep the baby hydrated and seek pediatric advice if symptoms worsen.'),

('baby rash', 'Rashes in babies may occur from allergies or skin irritation. Advice: Keep the skin clean and consult a pediatrician if spreading.'),

('baby constipation', 'Constipation in babies may cause discomfort. Advice: Ensure proper feeding and seek pediatric advice if persistent.'),

('difficulty breastfeeding', 'Breastfeeding difficulties may affect infant nutrition. Advice: Seek support from a healthcare professional or lactation consultant.'),

('persistent crying at night', 'Night crying may indicate discomfort or illness in infants. Advice: Check for fever or feeding issues and consult a pediatrician.'),

('pregnancy back pain', 'Back pain during pregnancy is common due to body changes. Advice: Maintain proper posture and avoid heavy lifting.'),

('pregnancy swelling', 'Swelling during pregnancy may occur due to fluid retention. Advice: Elevate the legs and monitor symptoms carefully.'),

('pregnancy dizziness', 'Dizziness during pregnancy may result from low blood pressure. Advice: Rise slowly and stay hydrated.'),

('pregnancy fatigue', 'Fatigue during pregnancy is common. Advice: Rest adequately and maintain nutritious meals.'),

('pregnancy headache', 'Headaches during pregnancy may result from stress or dehydration. Advice: Drink enough water and seek medical advice if severe.'),

('pregnancy cramps', 'Mild cramps may occur during pregnancy. Advice: Rest and seek immediate care if pain becomes severe.'),

('difficulty urinating', 'Difficulty urinating may indicate infection or blockage. Advice: Seek medical evaluation promptly.'),

('frequent nighttime urination', 'Frequent urination at night may indicate medical conditions or excess fluid intake. Advice: Reduce caffeine and seek evaluation if persistent.'),

('cloudy urine', 'Cloudy urine may indicate dehydration or infection. Advice: Increase water intake and seek medical advice if symptoms continue.'),

('strong urine smell', 'Strong-smelling urine may result from dehydration or infection. Advice: Drink more water and monitor symptoms.'),

('pelvic pressure', 'Pelvic pressure may occur due to infection or reproductive issues. Advice: Seek medical evaluation if symptoms persist.'),

('lower abdominal pain', 'Lower abdominal pain may result from digestive or reproductive issues. Advice: Rest and seek medical care if severe.'),

('difficulty concentrating', 'Difficulty concentrating may result from stress or fatigue. Advice: Maintain healthy sleep habits and reduce stress.'),

('persistent tiredness', 'Persistent tiredness may indicate underlying medical conditions. Advice: Maintain proper nutrition and seek medical evaluation.'),

('loss of motivation', 'Loss of motivation may be linked to stress or emotional conditions. Advice: Seek emotional support and maintain healthy routines.'),

('social withdrawal', 'Social withdrawal may affect emotional well-being. Advice: Stay connected with trusted individuals and seek support if needed.'),

('constant worry', 'Constant worry may affect daily life and mental health. Advice: Practice relaxation techniques and seek counseling if persistent.'),

('fear of sleeping', 'Fear of sleep may result from anxiety or nightmares. Advice: Maintain calming bedtime routines and seek support if severe.'),

('difficulty calming down', 'Difficulty calming down may result from stress or anxiety. Advice: Practice slow breathing and relaxation exercises.'),

('shaking hands', 'Shaking hands may result from stress, fatigue, or neurological conditions. Advice: Reduce caffeine intake and seek medical evaluation if persistent.'),

('persistent muscle weakness', 'Persistent muscle weakness may indicate medical conditions. Advice: Seek prompt medical evaluation.'),

('difficulty lifting objects', 'Difficulty lifting objects may result from muscle or nerve issues. Advice: Avoid strain and seek medical advice.'),

('painful joints in morning', 'Morning joint pain may indicate inflammation or arthritis. Advice: Stretch gently and seek medical evaluation if persistent.'),

('swollen fingers', 'Finger swelling may result from injury or inflammation. Advice: Rest the hand and monitor symptoms.'),

('leg cramps at night', 'Night leg cramps may result from dehydration or strain. Advice: Stretch regularly and maintain hydration.'),

('pain while walking', 'Pain during walking may indicate joint or muscle issues. Advice: Rest and seek medical evaluation if persistent.'),

('difficulty bending knee', 'Difficulty bending the knee may indicate injury or inflammation. Advice: Rest the joint and seek medical care if severe.'),

('persistent ankle pain', 'Persistent ankle pain may result from injury or strain. Advice: Avoid strenuous activity and seek medical advice if symptoms continue.'),

('burning feet', 'Burning sensations in the feet may indicate nerve irritation. Advice: Seek medical evaluation if persistent.'),

('cold sweats', 'Cold sweats may occur due to stress, fever, or medical emergencies. Advice: Seek medical evaluation if severe or persistent.'),

('sudden weakness', 'Sudden weakness may indicate serious medical conditions. Advice: Seek emergency medical attention immediately.'),('difficulty breathing after exercise', 'Breathing difficulty after exercise may indicate asthma or heart conditions. Advice: Rest immediately and seek medical evaluation if persistent.'),

('persistent dry lips', 'Dry lips may result from dehydration or weather exposure. Advice: Drink enough water and use lip moisturizer regularly.'),

('burning chest sensation', 'A burning sensation in the chest may indicate acid reflux. Advice: Avoid spicy foods and seek medical care if symptoms worsen.'),

('persistent bloating', 'Persistent bloating may indicate digestive issues. Advice: Avoid overeating and monitor foods that trigger symptoms.'),

('difficulty digesting food', 'Digestive difficulties may result from stomach or intestinal conditions. Advice: Eat light meals and seek medical evaluation if persistent.'),

('pain after eating', 'Pain after eating may indicate digestive problems. Advice: Avoid oily meals and seek medical attention if symptoms continue.'),

('frequent vomiting', 'Frequent vomiting may lead to dehydration. Advice: Sip fluids slowly and seek medical care if persistent.'),

('stomach burning', 'A burning stomach sensation may indicate ulcers or acid irritation. Advice: Avoid spicy foods and seek medical advice.'),

('persistent constipation', 'Long-term constipation may affect digestive health. Advice: Increase fiber intake and drink more water.'),

('blood in stool', 'Blood in stool may indicate digestive tract problems. Advice: Seek immediate medical evaluation.'),

('dark stool', 'Dark-colored stool may indicate internal bleeding. Advice: Seek urgent medical attention immediately.'),

('persistent diarrhea', 'Persistent diarrhea may cause dehydration and weakness. Advice: Increase fluid intake and seek medical evaluation.'),

('painful urination', 'Pain during urination may indicate infection. Advice: Increase water intake and seek medical advice.'),

('frequent urination', 'Frequent urination may indicate infection or diabetes. Advice: Monitor symptoms and seek medical evaluation if persistent.'),

('urine retention', 'Difficulty emptying the bladder may indicate urinary problems. Advice: Seek prompt medical attention.'),

('kidney stones symptoms', 'Kidney stone symptoms may include severe pain and urinary discomfort. Advice: Seek immediate medical evaluation.'),

('bladder pain', 'Bladder pain may indicate infection or inflammation. Advice: Increase hydration and seek medical care.'),

('persistent pelvic pain', 'Persistent pelvic pain may require medical evaluation. Advice: Rest and consult a healthcare provider.'),

('swollen hands', 'Hand swelling may result from fluid retention or injury. Advice: Elevate the hands and monitor symptoms.'),

('arm weakness', 'Arm weakness may indicate nerve or muscle problems. Advice: Seek medical evaluation if symptoms persist.'),

('difficulty moving arm', 'Difficulty moving the arm may result from injury or nerve issues. Advice: Avoid strain and seek medical care.'),

('persistent shoulder pain', 'Persistent shoulder pain may result from muscle or joint conditions. Advice: Rest the shoulder and seek medical advice if symptoms continue.'),

('joint stiffness', 'Joint stiffness may occur due to inflammation or arthritis. Advice: Stretch gently and stay active.'),

('painful swelling', 'Painful swelling may indicate infection or injury. Advice: Seek medical evaluation if symptoms worsen.'),

('swollen wrist', 'Wrist swelling may result from strain or inflammation. Advice: Rest the wrist and apply cold compresses.'),

('finger numbness', 'Finger numbness may indicate nerve compression. Advice: Reduce repetitive strain and seek medical advice.'),

('difficulty gripping objects', 'Difficulty gripping objects may indicate muscle or nerve problems. Advice: Seek medical evaluation if persistent.'),

('muscle weakness in legs', 'Leg muscle weakness may affect walking and balance. Advice: Seek medical attention promptly.'),

('difficulty balancing', 'Balance problems may increase the risk of falls. Advice: Seek neurological evaluation.'),

('persistent knee pain', 'Persistent knee pain may indicate joint injury or inflammation. Advice: Rest the knee and seek medical advice if severe.'),

('swollen calf', 'Calf swelling may indicate circulation issues or injury. Advice: Seek medical evaluation promptly.'),

('leg numbness', 'Leg numbness may result from nerve or circulation problems. Advice: Seek medical attention if symptoms persist.'),

('foot numbness', 'Foot numbness may indicate nerve damage or circulation issues. Advice: Seek medical evaluation promptly.'),

('difficulty standing long', 'Difficulty standing for long periods may result from circulation or joint issues. Advice: Take breaks and seek medical advice if persistent.'),

('persistent fatigue after exercise', 'Excessive fatigue after exercise may indicate overexertion or medical conditions. Advice: Rest adequately and seek evaluation if persistent.'),

('dry cough at night', 'Nighttime dry cough may indicate allergies or respiratory conditions. Advice: Stay hydrated and avoid irritants.'),

('difficulty taking deep breaths', 'Difficulty taking deep breaths may indicate lung or anxiety-related conditions. Advice: Seek medical evaluation promptly.'),

('persistent mucus', 'Persistent mucus production may indicate infection or allergies. Advice: Stay hydrated and seek medical advice if symptoms worsen.'),

('green mucus', 'Green mucus may indicate respiratory infection. Advice: Monitor symptoms and seek medical care if severe.'),

('difficulty speaking clearly', 'Speech difficulty may indicate neurological conditions. Advice: Seek emergency medical evaluation immediately.'),

('sudden vision changes', 'Sudden changes in vision may indicate serious eye or neurological problems. Advice: Seek immediate medical attention.'),

('eye pressure', 'Eye pressure may indicate glaucoma or eye strain. Advice: Seek medical evaluation promptly.'),

('flashing lights in vision', 'Flashing lights in vision may indicate retinal problems. Advice: Seek urgent eye care immediately.'),

('persistent eye itching', 'Persistent eye itching may result from allergies or irritation. Advice: Avoid allergens and maintain eye hygiene.'),

('eye discharge in morning', 'Morning eye discharge may indicate infection. Advice: Keep the eyes clean and avoid touching them frequently.'),

('swollen face', 'Facial swelling may indicate allergic reactions or infection. Advice: Seek medical evaluation immediately if severe.'),

('facial numbness', 'Facial numbness may indicate nerve or neurological conditions. Advice: Seek immediate medical attention.'),

('difficulty smiling', 'Difficulty smiling evenly may indicate nerve problems or stroke symptoms. Advice: Seek emergency medical evaluation.'),

('persistent headache with fever', 'Headache combined with fever may indicate infection. Advice: Seek prompt medical attention.'),

('headache with blurry vision', 'Headache with blurred vision may indicate neurological or eye conditions. Advice: Seek urgent medical care.'),

('difficulty sleeping due to pain', 'Pain affecting sleep may require medical evaluation. Advice: Rest properly and seek medical care if persistent.'),

('extreme tiredness', 'Extreme tiredness may indicate underlying illness or stress. Advice: Maintain proper nutrition and seek medical advice.'),

('loss of interest', 'Loss of interest in activities may indicate emotional distress or depression. Advice: Seek emotional support and mental health evaluation if persistent.'),

('persistent loneliness', 'Persistent loneliness may affect mental health. Advice: Stay socially connected and seek emotional support.'),

('panic symptoms at night', 'Night panic symptoms may interfere with sleep and well-being. Advice: Practice calming techniques and seek professional help if persistent.'),

('fear and anxiety', 'Fear and anxiety may affect daily functioning. Advice: Practice relaxation exercises and seek counseling support.'),

('difficulty controlling emotions', 'Difficulty managing emotions may result from stress or emotional conditions. Advice: Seek support and practice stress management.'),

('constant stress', 'Constant stress may negatively affect physical and mental health. Advice: Maintain healthy routines and relaxation techniques.'),

('mental exhaustion', 'Mental exhaustion may result from prolonged stress or overwork. Advice: Rest adequately and reduce stress triggers.'),

('difficulty focusing at work', 'Difficulty focusing may result from fatigue or stress. Advice: Improve sleep quality and reduce distractions.'),

('persistent sadness at night', 'Nighttime sadness may affect emotional well-being. Advice: Seek emotional support and maintain healthy routines.'),

('sleep difficulties', 'Sleep difficulties may affect energy and concentration. Advice: Maintain a consistent sleep schedule and avoid caffeine late at night.'),

('waking up tired', 'Waking up tired may indicate poor sleep quality. Advice: Improve sleep habits and seek medical advice if persistent.'),

('frequent waking during sleep', 'Frequent waking during sleep may reduce sleep quality. Advice: Avoid screen exposure before bedtime and maintain relaxation routines.'),

('muscle pain after exercise', 'Muscle pain after exercise may result from strain or overuse. Advice: Rest adequately and stay hydrated.'),

('persistent body pain', 'Persistent body pain may indicate underlying medical conditions. Advice: Seek medical evaluation if symptoms continue.'),

('burning muscle pain', 'Burning muscle pain may result from strain or nerve irritation. Advice: Rest and seek medical evaluation if persistent.'),

('difficulty climbing stairs', 'Difficulty climbing stairs may indicate weakness or joint conditions. Advice: Seek medical evaluation if symptoms worsen.'),

('pain when bending', 'Pain during bending may indicate muscle or joint strain. Advice: Avoid heavy lifting and rest adequately.'),

('difficulty lifting leg', 'Difficulty lifting the leg may indicate muscle or nerve conditions. Advice: Seek prompt medical evaluation.'),

('cold skin', 'Cold skin may result from poor circulation or low body temperature. Advice: Keep warm and seek medical advice if persistent.'),

('persistent sweating', 'Persistent sweating may result from stress or medical conditions. Advice: Stay hydrated and seek medical evaluation if excessive.'),

('difficulty recovering from illness', 'Slow recovery from illness may indicate weakness or immune issues. Advice: Maintain nutritious meals and adequate rest.'),('erectile dysfunction', 'Erectile dysfunction may result from stress, circulation problems, or medical conditions. Advice: Maintain a healthy lifestyle and seek medical evaluation if persistent.'),

('low libido in men', 'Reduced libido in men may be linked to stress, hormonal imbalance, or fatigue. Advice: Maintain healthy habits and seek medical advice if persistent.'),

('testicular pain', 'Testicular pain may indicate injury or infection. Advice: Seek prompt medical evaluation immediately.'),

('testicular swelling', 'Swelling of the testicles may indicate infection or other medical conditions. Advice: Seek urgent medical attention.'),

('prostate pain', 'Prostate discomfort may indicate infection or inflammation. Advice: Increase hydration and consult a healthcare professional.'),

('difficulty maintaining erection', 'Difficulty maintaining erections may result from stress or circulation issues. Advice: Reduce stress and seek medical evaluation if persistent.'),

('male infertility concerns', 'Male fertility issues may result from lifestyle or medical conditions. Advice: Maintain healthy habits and consult a fertility specialist.'),

('pain during ejaculation', 'Pain during ejaculation may indicate infection or inflammation. Advice: Seek medical evaluation promptly.'),

('blood in semen', 'Blood in semen may indicate infection or other conditions. Advice: Seek medical attention promptly.'),

('groin pain', 'Groin pain may result from strain, infection, or injury. Advice: Avoid strenuous activity and seek medical advice if persistent.'),

('breast tenderness in women', 'Breast tenderness may occur due to hormonal changes. Advice: Monitor symptoms and seek evaluation if severe or persistent.'),

('missed period', 'Missed periods may occur due to stress, pregnancy, or hormonal imbalance. Advice: Monitor cycles and seek medical advice if persistent.'),

('heavy menstrual bleeding', 'Heavy menstrual bleeding may lead to weakness or anemia. Advice: Seek medical evaluation promptly.'),

('spotting between periods', 'Spotting between menstrual cycles may indicate hormonal changes or medical conditions. Advice: Seek medical advice if persistent.'),

('ovarian pain', 'Ovarian pain may result from cysts or reproductive conditions. Advice: Seek medical evaluation if severe or persistent.'),

('vaginal itching', 'Vaginal itching may indicate irritation or infection. Advice: Maintain hygiene and seek medical evaluation if symptoms persist.'),

('vaginal discharge', 'Unusual vaginal discharge may indicate infection. Advice: Seek medical evaluation if accompanied by odor or discomfort.'),

('pain during menstruation', 'Menstrual pain may occur due to cramps or hormonal changes. Advice: Use warm compresses and rest adequately.'),

('pregnancy nausea in morning', 'Morning nausea during pregnancy is common. Advice: Eat small meals frequently and stay hydrated.'),

('pregnancy swelling in legs', 'Leg swelling during pregnancy may occur due to fluid retention. Advice: Elevate the legs and avoid prolonged standing.'),

('pregnancy breathing difficulty', 'Breathing difficulty during pregnancy requires medical evaluation. Advice: Seek immediate medical attention if severe.'),

('breastfeeding pain', 'Pain during breastfeeding may result from poor latch or infection. Advice: Seek guidance from a healthcare professional.'),

('postpartum sadness', 'Sadness after childbirth may occur due to hormonal changes or emotional stress. Advice: Seek emotional support and medical evaluation if persistent.'),

('postpartum fatigue', 'Fatigue after childbirth is common. Advice: Rest adequately and maintain nutritious meals.'),

('hot flashes', 'Hot flashes may occur during hormonal changes or menopause. Advice: Stay cool and seek medical advice if symptoms become severe.'),

('menopause symptoms', 'Menopause symptoms may include mood changes and hot flashes. Advice: Maintain healthy habits and seek medical support if needed.'),

('pelvic cramps', 'Pelvic cramps may result from menstrual or reproductive conditions. Advice: Rest and seek medical advice if symptoms worsen.'),

('pain during pregnancy', 'Pain during pregnancy should be monitored carefully. Advice: Seek immediate medical attention if severe or persistent.'),

('breast lump', 'Breast lumps should always be medically evaluated. Advice: Schedule a healthcare appointment promptly.'),

('difficulty conceiving', 'Difficulty conceiving may result from reproductive or hormonal conditions. Advice: Seek fertility evaluation and maintain healthy habits.'),

('low testosterone symptoms', 'Low testosterone may cause fatigue and reduced libido. Advice: Seek hormonal evaluation from a healthcare professional.'),

('male chest pain', 'Chest pain in men may indicate heart conditions. Advice: Seek emergency medical evaluation immediately.'),

('female chest pain', 'Chest pain in women may also indicate serious heart conditions. Advice: Seek urgent medical attention immediately.'),

('male hair loss', 'Hair loss in men may result from genetics or stress. Advice: Maintain balanced nutrition and seek medical advice if concerned.'),

('female hair thinning', 'Hair thinning in women may result from hormonal or nutritional factors. Advice: Maintain healthy nutrition and seek evaluation if persistent.'),

('pain during intercourse', 'Pain during intercourse may indicate infection or reproductive conditions. Advice: Seek medical evaluation promptly.'),

('male urinary pain', 'Painful urination in men may indicate urinary or prostate infection. Advice: Increase hydration and seek medical attention.'),

('female urinary pain', 'Painful urination in women may indicate urinary infection. Advice: Drink more water and seek medical evaluation.'),

('pelvic swelling', 'Pelvic swelling may indicate reproductive or digestive conditions. Advice: Seek medical evaluation promptly.'),

('abnormal menstrual cycle', 'Abnormal menstrual cycles may result from hormonal imbalance or stress. Advice: Monitor symptoms and seek medical advice if persistent.'),

('pregnancy fatigue in first trimester', 'Fatigue is common during early pregnancy. Advice: Rest adequately and maintain balanced meals.'),

('pregnancy back cramps', 'Back cramps during pregnancy may result from body changes. Advice: Maintain proper posture and avoid strain.'),

('pregnancy headaches', 'Headaches during pregnancy may result from dehydration or stress. Advice: Stay hydrated and seek medical advice if severe.'),

('swollen breasts', 'Breast swelling may occur due to hormonal changes or infection. Advice: Monitor symptoms and seek medical advice if severe.'),

('breast redness', 'Breast redness may indicate infection or irritation. Advice: Seek medical evaluation promptly.'),

('male lower abdominal pain', 'Lower abdominal pain in men may indicate digestive or urinary issues. Advice: Seek medical evaluation if persistent.'),

('female lower abdominal pain', 'Lower abdominal pain in women may result from reproductive or digestive conditions. Advice: Seek medical advice if severe.'),

('male fatigue', 'Fatigue in men may result from stress, illness, or hormonal imbalance. Advice: Maintain healthy sleep and nutrition habits.'),

('female fatigue', 'Fatigue in women may result from stress, hormonal changes, or anemia. Advice: Rest adequately and seek medical advice if persistent.'),

('menstrual dizziness', 'Dizziness during menstruation may result from blood loss or dehydration. Advice: Stay hydrated and rest adequately.'),

('pregnancy dizziness in morning', 'Morning dizziness during pregnancy may result from low blood pressure. Advice: Rise slowly and stay hydrated.'),

('persistent breast pain', 'Persistent breast pain should be medically evaluated. Advice: Schedule a healthcare appointment promptly.'),

('male infertility symptoms', 'Male infertility symptoms may require medical assessment. Advice: Maintain healthy habits and consult a fertility specialist.'),

('female infertility symptoms', 'Female fertility concerns may result from hormonal or reproductive conditions. Advice: Seek evaluation from a healthcare professional.'),

('postpartum anxiety', 'Anxiety after childbirth may affect emotional well-being. Advice: Seek emotional support and professional care if persistent.'),

('pregnancy leg pain', 'Leg pain during pregnancy may result from pressure or circulation changes. Advice: Elevate the legs and seek medical advice if swelling occurs.'),

('male groin swelling', 'Groin swelling in men may indicate hernia or infection. Advice: Seek prompt medical evaluation.'),

('female pelvic pain', 'Pelvic pain in women may indicate reproductive conditions. Advice: Seek medical attention if symptoms persist.'),

('painful breast lump', 'Painful breast lumps require prompt medical evaluation. Advice: Schedule a healthcare appointment immediately.'),

('irregular ovulation', 'Irregular ovulation may affect fertility and menstrual cycles. Advice: Seek medical evaluation and maintain healthy habits.'),

('prostate swelling', 'Prostate swelling may cause urinary discomfort. Advice: Seek medical evaluation promptly.'),

('difficulty urinating in men', 'Difficulty urinating in men may indicate prostate or urinary conditions. Advice: Seek prompt medical attention.'),

('burning sensation after intercourse', 'Burning sensations after intercourse may indicate irritation or infection. Advice: Seek medical evaluation if symptoms persist.'),

('menstrual weakness', 'Weakness during menstruation may result from blood loss or fatigue. Advice: Rest adequately and maintain hydration.'),

('pregnancy abdominal pressure', 'Abdominal pressure during pregnancy should be monitored carefully. Advice: Seek medical advice if severe or persistent.'),

('swollen ankles during pregnancy', 'Swollen ankles may occur during pregnancy due to fluid retention. Advice: Elevate the legs and avoid prolonged standing.'),

('male chest tightness', 'Chest tightness in men may indicate serious heart or lung conditions. Advice: Seek emergency medical evaluation immediately.'),

('female chest tightness', 'Chest tightness in women may indicate respiratory or heart conditions. Advice: Seek urgent medical attention.'),

('difficulty breastfeeding baby', 'Difficulty breastfeeding may affect infant nutrition. Advice: Seek support from a healthcare professional or lactation consultant.'),('pregnancy spotting', 'Spotting during pregnancy should always be monitored carefully. Advice: Seek immediate medical evaluation if bleeding increases or pain occurs.'),

('pregnancy vomiting', 'Vomiting during pregnancy may lead to dehydration. Advice: Drink small amounts of fluid regularly and seek medical advice if severe.'),

('pregnancy fever', 'Fever during pregnancy may affect both mother and baby. Advice: Seek prompt medical attention.'),

('pregnancy insomnia', 'Difficulty sleeping during pregnancy is common. Advice: Maintain a comfortable sleeping position and avoid caffeine late at night.'),

('pregnancy constipation', 'Constipation during pregnancy may occur due to hormonal changes. Advice: Increase fiber intake and drink enough water.'),

('pregnancy heartburn', 'Heartburn during pregnancy may result from hormonal and digestive changes. Advice: Eat smaller meals and avoid spicy foods.'),

('pregnancy shortness of breath', 'Breathing difficulty during pregnancy may occur due to body changes. Advice: Rest adequately and seek medical care if severe.'),

('pregnancy frequent urination', 'Frequent urination during pregnancy is common. Advice: Stay hydrated and monitor for pain or burning sensations.'),

('pregnancy pelvic pressure', 'Pelvic pressure during pregnancy may result from body changes. Advice: Rest and seek medical advice if symptoms worsen.'),

('pregnancy swollen hands', 'Swollen hands during pregnancy may occur due to fluid retention. Advice: Elevate the hands and seek medical care if severe.'),

('male burning urination', 'Burning urination in men may indicate urinary infection or prostate issues. Advice: Increase hydration and seek medical evaluation.'),

('male frequent urination', 'Frequent urination in men may indicate prostate or urinary conditions. Advice: Seek medical advice if symptoms persist.'),

('male prostate discomfort', 'Prostate discomfort may result from inflammation or infection. Advice: Seek medical evaluation promptly.'),

('male testicular lump', 'A lump in the testicle requires immediate medical evaluation. Advice: Schedule a healthcare appointment promptly.'),

('male groin discomfort', 'Groin discomfort in men may result from strain or infection. Advice: Avoid heavy lifting and seek medical advice if persistent.'),

('male reproductive pain', 'Pain in male reproductive organs may indicate infection or injury. Advice: Seek medical attention promptly.'),

('male urinary blockage', 'Difficulty passing urine in men may indicate urinary blockage or prostate enlargement. Advice: Seek urgent medical evaluation.'),

('male pelvic discomfort', 'Pelvic discomfort in men may indicate urinary or reproductive conditions. Advice: Seek medical advice if persistent.'),

('female breast swelling', 'Breast swelling in women may occur due to hormonal changes or infection. Advice: Seek medical evaluation if symptoms worsen.'),

('female reproductive pain', 'Reproductive pain in women may result from infection or hormonal conditions. Advice: Seek prompt medical evaluation.'),

('female hormonal imbalance', 'Hormonal imbalance may affect menstrual cycles and mood. Advice: Maintain healthy habits and seek medical evaluation.'),

('female pelvic cramps', 'Pelvic cramps may result from menstrual or reproductive conditions. Advice: Use warm compresses and seek medical advice if severe.'),

('female breast discharge', 'Breast discharge may indicate hormonal or medical conditions. Advice: Seek healthcare evaluation promptly.'),

('female abdominal bloating', 'Abdominal bloating in women may result from digestive or hormonal causes. Advice: Avoid heavy meals and monitor symptoms.'),

('female urinary infection', 'Urinary infections in women may cause pain and frequent urination. Advice: Increase water intake and seek medical care.'),

('pain during pregnancy walking', 'Pain while walking during pregnancy may result from body strain or pelvic pressure. Advice: Rest and seek medical advice if severe.'),

('pregnancy leg swelling', 'Leg swelling during pregnancy may occur due to circulation changes. Advice: Elevate the legs and avoid prolonged standing.'),

('pregnancy body weakness', 'Weakness during pregnancy may result from fatigue or nutritional deficiency. Advice: Rest adequately and maintain balanced nutrition.'),

('pregnancy mood swings', 'Mood swings during pregnancy may occur due to hormonal changes. Advice: Reduce stress and seek emotional support.'),

('pregnancy anxiety', 'Anxiety during pregnancy may affect emotional well-being. Advice: Practice relaxation techniques and seek support if persistent.'),

('pregnancy depression', 'Persistent sadness during pregnancy may indicate depression. Advice: Seek emotional support and professional healthcare guidance.'),

('pregnancy chest pain', 'Chest pain during pregnancy requires urgent medical evaluation. Advice: Seek immediate medical attention.'),

('pregnancy blurry vision', 'Blurred vision during pregnancy may indicate medical complications. Advice: Seek immediate medical care.'),

('pregnancy severe headache', 'Severe headaches during pregnancy should not be ignored. Advice: Seek urgent medical evaluation.'),

('pregnancy high blood pressure', 'High blood pressure during pregnancy may be dangerous. Advice: Seek immediate healthcare evaluation.'),

('pregnancy bleeding', 'Bleeding during pregnancy may indicate serious complications. Advice: Seek emergency medical care immediately.'),

('pregnancy severe cramps', 'Severe cramping during pregnancy requires medical evaluation. Advice: Seek immediate medical attention.'),

('male chest burning', 'Chest burning in men may result from acid reflux or heart conditions. Advice: Seek medical care if symptoms persist.'),

('male severe fatigue', 'Severe fatigue in men may indicate illness or hormonal imbalance. Advice: Maintain healthy sleep and seek medical evaluation.'),

('male stress symptoms', 'Stress in men may affect physical and mental health. Advice: Practice relaxation techniques and maintain healthy routines.'),

('male anxiety symptoms', 'Anxiety symptoms in men may include restlessness and rapid heartbeat. Advice: Seek emotional support and reduce stress triggers.'),

('male depression symptoms', 'Depression symptoms in men may include sadness and loss of motivation. Advice: Seek professional mental health support.'),

('male sleep problems', 'Sleep problems in men may affect energy and concentration. Advice: Maintain healthy sleep habits and avoid caffeine late at night.'),

('male body weakness', 'Body weakness in men may indicate illness or nutritional deficiency. Advice: Maintain balanced nutrition and seek medical evaluation if persistent.'),

('female severe fatigue', 'Severe fatigue in women may result from anemia, stress, or illness. Advice: Seek medical advice if symptoms persist.'),

('female anxiety symptoms', 'Anxiety in women may affect emotional and physical health. Advice: Practice stress management and seek support if needed.'),

('female depression symptoms', 'Depression symptoms in women may include sadness and emotional withdrawal. Advice: Seek mental health support promptly.'),

('female sleep difficulties', 'Sleep difficulties in women may result from stress or hormonal changes. Advice: Maintain calming bedtime routines.'),

('female dizziness', 'Dizziness in women may result from dehydration or hormonal changes. Advice: Stay hydrated and seek medical advice if persistent.'),

('female weakness', 'Weakness in women may result from illness or nutritional deficiency. Advice: Rest adequately and maintain healthy nutrition.'),

('female swollen legs', 'Leg swelling in women may indicate circulation or fluid retention issues. Advice: Elevate the legs and seek medical evaluation if severe.'),

('female chest discomfort', 'Chest discomfort in women should not be ignored. Advice: Seek urgent medical evaluation immediately.'),

('female breathing difficulty', 'Breathing difficulty in women may indicate respiratory or heart conditions. Advice: Seek prompt medical attention.'),

('female migraines', 'Migraines in women may be linked to hormonal changes or stress. Advice: Rest in a quiet dark room and stay hydrated.'),

('female joint pain', 'Joint pain in women may result from inflammation or hormonal conditions. Advice: Rest affected joints and seek medical advice if persistent.'),

('male migraines', 'Migraines in men may result from stress or medical conditions. Advice: Reduce stress and rest in a dark quiet room.'),

('male joint pain', 'Joint pain in men may result from strain or inflammation. Advice: Avoid excessive strain and seek medical evaluation if persistent.'),

('male dizziness', 'Dizziness in men may indicate dehydration or blood pressure issues. Advice: Sit down, hydrate, and seek medical evaluation if symptoms continue.'),

('male breathing problems', 'Breathing problems in men may indicate respiratory or cardiovascular conditions. Advice: Seek immediate medical attention if severe.'),

('male persistent cough', 'Persistent cough in men may indicate infection or lung irritation. Advice: Stay hydrated and seek medical care if symptoms persist.'),

('female persistent cough', 'Persistent cough in women may result from infection or allergies. Advice: Drink warm fluids and seek medical advice if symptoms continue.'),

('male fever symptoms', 'Fever in men may indicate infection or illness. Advice: Rest adequately, stay hydrated, and monitor body temperature.'),

('female fever symptoms', 'Fever in women may indicate infection or inflammation. Advice: Increase fluid intake and seek medical evaluation if symptoms worsen.'),

('male stomach pain', 'Stomach pain in men may result from digestive or urinary conditions. Advice: Avoid spicy foods and seek medical care if severe.'),

('female stomach pain', 'Stomach pain in women may result from digestive or reproductive conditions. Advice: Seek medical advice if persistent or severe.'),

('male back pain', 'Back pain in men may result from strain or posture issues. Advice: Avoid heavy lifting and maintain good posture.'),

('female back pain', 'Back pain in women may result from posture, strain, or hormonal changes. Advice: Rest adequately and apply warm compresses.'),('male insomnia', 'Insomnia in men may result from stress or lifestyle habits. Advice: Maintain a consistent sleep schedule and avoid caffeine late at night.'),

('female insomnia', 'Insomnia in women may be linked to stress or hormonal changes. Advice: Practice relaxation techniques before sleep and maintain good sleep hygiene.'),

('male weight loss unexplained', 'Unexplained weight loss in men may indicate underlying medical conditions. Advice: Seek medical evaluation promptly.'),

('female weight loss unexplained', 'Unexplained weight loss in women may indicate hormonal or medical issues. Advice: Consult a healthcare provider for evaluation.'),

('male weight gain rapid', 'Rapid weight gain in men may result from lifestyle or hormonal imbalance. Advice: Maintain balanced diet and regular exercise.'),

('female weight gain rapid', 'Rapid weight gain in women may result from hormonal changes or health conditions. Advice: Seek medical advice if persistent.'),

('male hair thinning', 'Hair thinning in men may be linked to genetics or stress. Advice: Maintain healthy nutrition and reduce stress.'),

('female hair loss severe', 'Severe hair loss in women may result from hormonal imbalance or nutritional deficiency. Advice: Seek medical evaluation.'),

('male body sweating excessive', 'Excessive sweating in men may result from stress or medical conditions. Advice: Stay hydrated and seek evaluation if persistent.'),

('female body sweating excessive', 'Excessive sweating in women may be linked to hormonal changes or stress. Advice: Maintain hydration and monitor symptoms.'),

('male muscle pain persistent', 'Persistent muscle pain in men may result from strain or inflammation. Advice: Rest and seek medical advice if symptoms continue.'),

('female muscle pain persistent', 'Muscle pain in women may result from overuse or medical conditions. Advice: Rest adequately and seek evaluation if persistent.'),

('male chest tightness anxiety', 'Chest tightness in men due to anxiety may cause discomfort. Advice: Practice breathing exercises and seek support if frequent.'),

('female chest tightness anxiety', 'Chest tightness in women due to anxiety may affect breathing comfort. Advice: Practice relaxation techniques and seek help if persistent.'),

('male abdominal bloating', 'Abdominal bloating in men may result from digestion issues. Advice: Avoid heavy meals and monitor food triggers.'),

('female abdominal bloating severe', 'Severe bloating in women may indicate digestive or hormonal issues. Advice: Seek medical evaluation if persistent.'),

('male constipation chronic', 'Chronic constipation in men may affect digestive health. Advice: Increase fiber intake and stay hydrated.'),

('female constipation chronic', 'Chronic constipation in women may be linked to hormonal or dietary factors. Advice: Maintain healthy diet and hydration.'),

('male diarrhea persistent', 'Persistent diarrhea in men may cause dehydration. Advice: Increase fluid intake and seek medical evaluation.'),

('female diarrhea persistent', 'Persistent diarrhea in women may indicate infection or digestive issues. Advice: Stay hydrated and seek medical care.'),

('male urinary infection', 'Urinary infections in men may cause pain and frequent urination. Advice: Seek medical evaluation and increase hydration.'),

('female urinary infection recurrent', 'Recurrent urinary infections in women require medical attention. Advice: Maintain hygiene and seek medical care.'),

('male pelvic pain', 'Pelvic pain in men may indicate urinary or reproductive issues. Advice: Seek medical evaluation if persistent.'),

('female pelvic pain chronic', 'Chronic pelvic pain in women may indicate reproductive conditions. Advice: Seek gynecological evaluation.'),

('male dizziness standing', 'Dizziness when standing in men may indicate low blood pressure. Advice: Stand up slowly and stay hydrated.'),

('female dizziness standing', 'Dizziness in women when standing may result from dehydration or anemia. Advice: Increase fluid intake and seek evaluation.'),

('male blurred vision', 'Blurred vision in men may indicate eye or neurological conditions. Advice: Seek medical evaluation promptly.'),

('female blurred vision', 'Blurred vision in women may indicate hormonal or medical issues. Advice: Seek immediate medical attention if persistent.'),

('male chest pain exercise', 'Chest pain during exercise in men may indicate heart issues. Advice: Stop activity immediately and seek medical care.'),

('female chest pain exercise', 'Chest pain during exercise in women may indicate cardiac issues. Advice: Seek urgent medical evaluation.'),

('male high fever', 'High fever in men may indicate infection. Advice: Stay hydrated and seek medical attention if persistent.'),

('female high fever', 'High fever in women may indicate infection or inflammation. Advice: Seek medical evaluation promptly.'),

('male sore throat severe', 'Severe sore throat in men may indicate infection. Advice: Gargle warm salt water and seek medical care if worsening.'),

('female sore throat severe', 'Severe sore throat in women may indicate bacterial or viral infection. Advice: Stay hydrated and seek medical evaluation.'),

('male leg swelling', 'Leg swelling in men may indicate circulation issues. Advice: Elevate legs and seek medical evaluation if persistent.'),

('female leg swelling pregnancy', 'Leg swelling during pregnancy is common but should be monitored. Advice: Elevate legs and seek medical advice if severe.'),

('male anxiety attacks', 'Anxiety attacks in men may cause rapid heartbeat and fear. Advice: Practice deep breathing and seek support if frequent.'),

('female anxiety attacks', 'Anxiety attacks in women may affect emotional stability. Advice: Use relaxation techniques and seek professional help.'),

('male depression severe', 'Severe depression in men may affect daily functioning. Advice: Seek mental health support immediately.'),

('female depression severe', 'Severe depression in women may require professional treatment. Advice: Seek immediate mental health care.'),

('male panic disorder', 'Panic disorder in men may cause sudden fear episodes. Advice: Practice breathing control and seek therapy support.'),

('female panic disorder', 'Panic disorder in women may affect daily life. Advice: Seek psychological evaluation and support.'),

('male stroke symptoms', 'Stroke symptoms in men include facial drooping and weakness. Advice: Seek emergency medical care immediately.'),

('female stroke symptoms', 'Stroke symptoms in women may include confusion and weakness. Advice: Seek emergency medical attention immediately.'),

('male heart attack symptoms', 'Heart attack symptoms in men include chest pain and sweating. Advice: Seek emergency care immediately.'),

('female heart attack symptoms', 'Heart attack symptoms in women may include fatigue and chest discomfort. Advice: Seek urgent medical attention.'),

('male dehydration severe', 'Severe dehydration in men may cause weakness and dizziness. Advice: Increase fluid intake and seek medical care if severe.'),

('female dehydration severe', 'Severe dehydration in women may cause fatigue and confusion. Advice: Increase fluids and seek medical attention.'),

('male muscle cramps night', 'Night muscle cramps in men may result from dehydration. Advice: Stretch before sleep and stay hydrated.'),

('female muscle cramps night', 'Night cramps in women may be linked to circulation issues. Advice: Stretch regularly and maintain hydration.'),

('male fatigue chronic', 'Chronic fatigue in men may indicate underlying illness. Advice: Seek medical evaluation if persistent.'),

('female fatigue chronic', 'Chronic fatigue in women may result from anemia or stress. Advice: Seek medical evaluation if ongoing.'),

('male sleep apnea', 'Sleep apnea in men may affect breathing during sleep. Advice: Seek sleep study evaluation.'),

('female sleep apnea', 'Sleep apnea in women may cause interrupted sleep. Advice: Seek medical evaluation for proper diagnosis.'),

('male erectile pain', 'Pain during erection in men may indicate infection or injury. Advice: Seek medical evaluation promptly.'),

('female vaginal pain intercourse', 'Pain during intercourse in women may indicate infection or dryness. Advice: Seek gynecological evaluation.'),

('male infertility hormonal', 'Hormonal imbalance in men may affect fertility. Advice: Seek endocrine evaluation.'),

('female infertility hormonal', 'Hormonal imbalance in women may affect fertility. Advice: Seek reproductive health evaluation.'),

('male reproductive infection', 'Reproductive infections in men require medical attention. Advice: Seek prompt treatment.'),

('female reproductive infection', 'Reproductive infections in women require gynecological care. Advice: Seek medical evaluation promptly.'),

('male groin infection', 'Groin infections in men may cause pain and swelling. Advice: Seek medical treatment.'),

('female pelvic infection', 'Pelvic infections in women require medical care. Advice: Seek gynecological evaluation promptly.'),

('male chronic stress', 'Chronic stress in men may affect physical health. Advice: Practice relaxation techniques and maintain balance.'),

('female chronic stress', 'Chronic stress in women may affect emotional health. Advice: Seek support and maintain healthy routines.'),('cold', 'The common cold is viral. Advice: Drink warm fluids, rest well, and take vitamin C rich foods.'),

('fever', 'Fever may indicate infection. Advice: Stay hydrated, rest, and monitor body temperature.'),

('malaria', 'Malaria is caused by mosquito bites. Advice: Seek medical treatment and use prescribed antimalarial drugs.'),

('headache', 'Headache may result from stress or dehydration. Advice: Rest in a quiet room and drink water.'),

('toothache', 'Toothache may indicate dental infection. Advice: Avoid sugary foods and see a dentist.'),

('diarrhea', 'Diarrhea may cause dehydration. Advice: Drink ORS and avoid oily foods.'),

('constipation', 'Constipation affects bowel movement. Advice: Eat fiber-rich foods and drink plenty of water.'),

('cough', 'Cough may be viral or bacterial. Advice: Drink warm fluids and avoid cold air exposure.'),

('sore throat', 'Sore throat may be due to infection. Advice: Gargle warm salt water and rest your voice.'),

('flu', 'Flu is a viral infection. Advice: Rest, hydrate, and take prescribed medication if needed.'),

('asthma', 'Asthma affects breathing. Advice: Avoid triggers and use inhaler as prescribed.'),

('high blood pressure', 'High BP increases heart risk. Advice: Reduce salt intake and exercise regularly.'),

('low blood pressure', 'Low BP may cause dizziness. Advice: Drink fluids and avoid sudden standing.'),

('diabetes', 'Diabetes affects blood sugar. Advice: Monitor sugar levels and maintain healthy diet.'),

('ulcer', 'Ulcer causes stomach pain. Advice: Avoid spicy foods and take prescribed medication.'),

('back pain', 'Back pain may be due to posture. Advice: Exercise gently and avoid heavy lifting.'),

('neck pain', 'Neck pain may result from strain. Advice: Stretch gently and maintain good posture.'),

('eye strain', 'Eye strain comes from screens. Advice: Rest eyes every 20 minutes.'),

('insomnia', 'Insomnia affects sleep. Advice: Avoid screens before bed and maintain sleep routine.'),

('stress', 'Stress affects mental health. Advice: Practice relaxation and deep breathing.'),

('anxiety', 'Anxiety affects mood. Advice: Talk to someone and practice mindfulness.'),

('depression', 'Depression affects emotions. Advice: Seek professional mental health support.'),

('obesity', 'Obesity increases health risks. Advice: Exercise regularly and eat balanced meals.'),

('malnutrition', 'Malnutrition weakens the body. Advice: Eat balanced diet with proteins and vitamins.'),

('dehydration', 'Dehydration reduces body fluid. Advice: Drink enough water daily.'),

('food poisoning', 'Food poisoning is from contaminated food. Advice: Drink fluids and seek care if severe.'),

('ear infection', 'Ear infection causes pain. Advice: Avoid inserting objects and see a doctor.'),

('sinus infection', 'Sinus infection causes facial pain. Advice: Use steam inhalation and rest.'),

('arthritis', 'Arthritis affects joints. Advice: Exercise gently and use anti-inflammatory medication.'),

('allergy', 'Allergy causes reactions. Advice: Avoid triggers and use antihistamines if prescribed.'),

('skin rash', 'Skin rash may be allergic. Advice: Keep skin clean and avoid irritants.'),

('eczema', 'Eczema causes itchy skin. Advice: Moisturize regularly and avoid harsh soaps.'),

('fungal infection', 'Fungal infection affects skin. Advice: Keep area dry and use antifungal cream.'),

('UTI', 'Urinary tract infection causes pain. Advice: Drink water and take antibiotics if prescribed.'),

('kidney pain', 'Kidney pain may indicate infection. Advice: Seek medical attention immediately.'),

('liver disease', 'Liver disease affects detoxification. Advice: Avoid alcohol and eat healthy diet.'),

('heart disease', 'Heart disease affects circulation. Advice: Exercise and avoid fatty foods.'),

('stroke', 'Stroke is a medical emergency. Advice: Seek immediate hospital care.'),

('migraine', 'Migraine causes severe headache. Advice: Rest in dark room and avoid triggers.'),

('fatigue', 'Fatigue reduces energy. Advice: Sleep well and eat nutritious food.'),

('weakness', 'Weakness may indicate illness. Advice: Rest and hydrate properly.'),

('vomiting', 'Vomiting may cause dehydration. Advice: Drink small fluids and rest.'),

('nausea', 'Nausea affects appetite. Advice: Eat light meals and stay hydrated.'),

('chest pain', 'Chest pain may be serious. Advice: Seek emergency medical attention.'),

('breathing difficulty', 'Breathing difficulty is serious. Advice: Seek urgent medical help.'),

('palpitations', 'Palpitations affect heart rhythm. Advice: Reduce caffeine and seek evaluation.'),

('menstrual pain', 'Menstrual pain is common. Advice: Use warm compress and rest.'),

('pregnancy nausea', 'Pregnancy nausea is common. Advice: Eat small meals frequently.'),

('low immunity', 'Low immunity increases infections. Advice: Eat healthy and rest well.'),

('weight loss', 'Unexplained weight loss may indicate illness. Advice: Seek medical evaluation.'),('hypertension', 'Hypertension is high blood pressure. Advice: Reduce salt intake, exercise regularly, and monitor blood pressure.'),

('hypotension', 'Low blood pressure may cause dizziness. Advice: Drink fluids and avoid sudden standing.'),

('dizziness', 'Dizziness may result from dehydration or low blood pressure. Advice: Sit down, rest, and drink water.'),

('blurred vision', 'Blurred vision may indicate eye strain or medical issues. Advice: Rest eyes and seek medical evaluation if persistent.'),

('ear pain', 'Ear pain may be caused by infection. Advice: Avoid inserting objects and seek medical care.'),

('sinus pain', 'Sinus pain may result from infection. Advice: Use steam inhalation and rest adequately.'),

('nosebleed', 'Nosebleeds may occur due to dryness or injury. Advice: Pinch nostrils and lean forward gently.'),

('chest tightness', 'Chest tightness may indicate respiratory or heart issues. Advice: Seek immediate medical attention if severe.'),

('shortness of breath', 'Shortness of breath may be serious. Advice: Sit upright and seek urgent medical care.'),

('rapid heartbeat', 'Rapid heartbeat may be due to stress or heart conditions. Advice: Avoid stimulants and rest calmly.'),

('slow heartbeat', 'Slow heartbeat may indicate heart issues. Advice: Seek medical evaluation if symptoms persist.'),

('hand pain', 'Hand pain may result from strain. Advice: Rest the hand and avoid repetitive motion.'),

('leg pain', 'Leg pain may be due to muscle strain or circulation issues. Advice: Rest and stretch gently.'),

('foot pain', 'Foot pain may result from poor footwear. Advice: Wear comfortable shoes and rest.'),

('ankle sprain', 'Ankle sprain occurs from injury. Advice: Apply ice, rest, and elevate the leg.'),

('knee pain', 'Knee pain may be from injury or arthritis. Advice: Rest and avoid heavy activity.'),

('shoulder stiffness', 'Shoulder stiffness may result from poor posture. Advice: Stretch gently and apply warm compress.'),

('muscle strain', 'Muscle strain is caused by overuse. Advice: Rest and avoid heavy lifting.'),

('sprain', 'Sprain affects ligaments. Advice: Rest, ice, and elevate the affected area.'),

('fracture pain', 'Fracture pain is severe bone injury. Advice: Seek emergency medical attention.'),

('burn injury', 'Burns require immediate care. Advice: Cool with water and avoid applying oils.'),

('cuts and wounds', 'Cuts may lead to infection. Advice: Clean properly and cover with bandage.'),

('bleeding', 'Excessive bleeding is dangerous. Advice: Apply pressure and seek urgent care.'),

('infection', 'Infection occurs due to bacteria or viruses. Advice: Seek medical treatment promptly.'),

('fever chills', 'Fever with chills may indicate infection. Advice: Rest and drink fluids.'),

('night sweats', 'Night sweats may indicate illness. Advice: Monitor symptoms and seek medical advice.'),

('loss of appetite', 'Loss of appetite may indicate illness. Advice: Eat small nutritious meals.'),

('weight gain', 'Weight gain may be due to lifestyle. Advice: Exercise regularly and eat balanced diet.'),

('sleep apnea', 'Sleep apnea affects breathing during sleep. Advice: Seek sleep study evaluation.'),

('snoring', 'Snoring may indicate airway blockage. Advice: Maintain healthy weight and sleep position.'),

('memory loss', 'Memory loss may indicate neurological issues. Advice: Seek medical evaluation if persistent.'),

('confusion', 'Confusion may be serious. Advice: Seek immediate medical attention.'),

('seizures', 'Seizures require urgent care. Advice: Protect patient and seek emergency help.'),

('tremors', 'Tremors may indicate neurological conditions. Advice: Seek medical evaluation.'),

('paralysis', 'Paralysis is medical emergency. Advice: Seek immediate hospital care.'),

('speech difficulty', 'Speech difficulty may indicate stroke. Advice: Seek emergency care immediately.'),

('facial droop', 'Facial droop may indicate stroke. Advice: Call emergency services immediately.'),

('loss of balance', 'Loss of balance may indicate neurological issues. Advice: Seek medical evaluation.'),

('skin infection', 'Skin infection causes redness and swelling. Advice: Keep area clean and seek treatment.'),

('boils', 'Boils are skin infections. Advice: Avoid squeezing and apply warm compress.'),

('acne', 'Acne affects skin health. Advice: Wash face regularly and avoid oily foods.'),

('dry skin', 'Dry skin may cause irritation. Advice: Moisturize regularly and drink water.'),

('hair loss', 'Hair loss may be hormonal or nutritional. Advice: Eat balanced diet and reduce stress.'),

('dandruff', 'Dandruff affects scalp. Advice: Use anti-dandruff shampoo regularly.'),

('itching skin', 'Skin itching may be allergy related. Advice: Avoid irritants and keep skin clean.'),

('sunburn', 'Sunburn is skin damage from sun. Advice: Apply cool compress and avoid sun exposure.'),

('heat rash', 'Heat rash occurs in hot weather. Advice: Keep skin cool and dry.'),

('cold symptoms', 'Cold symptoms include sneezing and runny nose. Advice: Rest and drink warm fluids.'),

('flu symptoms', 'Flu symptoms include fever and body pain. Advice: Rest and stay hydrated.'),

('COVID symptoms', 'COVID symptoms include cough and fever. Advice: Isolate and seek medical testing.'),

('pneumonia', 'Pneumonia affects lungs. Advice: Seek immediate medical treatment.'),

('tuberculosis', 'TB affects lungs and spreads through air. Advice: Complete full treatment course.'),

('HIV symptoms', 'HIV affects immune system. Advice: Get tested and seek medical care.'),

('hepatitis', 'Hepatitis affects liver. Advice: Avoid alcohol and seek treatment.'),

('malaria relapse', 'Malaria relapse may occur after infection. Advice: Complete full medication course.'),

('typhoid', 'Typhoid causes fever and weakness. Advice: Drink clean water and take antibiotics.'),

('cholera', 'Cholera causes severe diarrhea. Advice: Drink ORS and seek emergency care.'),

('depression symptoms', 'Depression affects mood and energy. Advice: Seek mental health support.'),

('anxiety symptoms', 'Anxiety causes worry and restlessness. Advice: Practice relaxation techniques.'),

('panic attack', 'Panic attacks cause sudden fear. Advice: Breathe slowly and seek support.'),

('stress overload', 'Excess stress affects health. Advice: Rest and reduce workload.'),

('burnout', 'Burnout causes exhaustion. Advice: Take breaks and rest adequately.')



-- 1. Update Users Table for Verification and Password Reset
ALTER TABLE users 
ADD COLUMN verification_token VARCHAR(255),
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_expires DATETIME,
MODIFY COLUMN is_verified BOOLEAN DEFAULT 0;

-- 2. Ensure Email uniqueness (if not already)
-- ALTER TABLE users ADD UNIQUE (email);

INSERT INTO health_advice (keywords, advice_text) VALUES