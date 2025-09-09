# EduTrack 🎓  
*A Smart Platform for Tracking Student Attentiveness in Online Learning*  

EduTrack is a **full-stack web platform** that helps teachers monitor and evaluate student attentiveness while learning online. Using a deep learning model with live video analysis, EduTrack classifies students as **Attentive** or **Distracted** during study sessions.  

---

## 👥 User Roles  
- Superuser → manages teachers.  
- Teacher → manages students, courses, learning materials, and monitors attentiveness.  
- Student → accesses assigned courses and study materials.  

---

## 🚀 Features  

### 🔑 Authentication & Profiles  
- Superuser → can add/view teachers.  
- Teacher → can add/view students.  
- Students & Teachers → can update profile and change password.  

### 📚 Course Management  
- Teachers can add courses and upload PDF materials.  
- Teachers can assign materials to students.  
- Teachers can track student progress (time spent, attentiveness %, distraction %).  

### 👀 Attentiveness Detection  
- When a student opens a material, their webcam is activated.  
- Every 5 seconds, an image is sent from frontend → backend.  
- Deep learning model analyzes frames:  
  - Attentive → looking at screen.  
  - Distracted → using phone, looking away, covering face, etc.  
- Results are logged per material and aggregated in teacher dashboards.  

### 📊 Analytics  
- Teachers can see per-student stats:  
  - Total time spent learning.  
  - Attentive % vs Distracted %.  

---

## 🧠 Deep Learning Model  

### Dataset  
- Collected videos of 10+ people attending online classes.  
- Collected selfie videos/images from Kaggle & Roboflow.  
- Extracted frames (every 5th frame at 30 fps).  
- Cropped images to face + upper shoulder.  

**Final dataset**:  
- 900 Attentive images  
- 900 Distracted images  

### Training  
- Model: MobileNetV2 (transfer learning).  
- Input size: 224×224.  
- Techniques: Data Augmentation (rotation, brightness, zoom, blur), Dropout (0.4–0.5), Learning Rate tuning (1e-4 → 1e-5).  

### Results  
- Accuracy: ~87% on validation set.  

### Live Performance  
- Detects distractions like phone use, looking away, or covering face.  

---

## 🛠️ Tech Stack  
- Frontend → React (Vite)  
- Backend → Django, Django REST Framework  
- Database → PostgreSQL  
- Model Training → TensorFlow / Keras (MobileNetV2)  

---

## ⚡ How to Run  

### 1. Clone repo  
```bash
git clone https://github.com/yourusername/edutrack.git
cd edutrack
```
### 2. Backend setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
### 3. Frontend setup (React + Vite)
```bash
cd client
npm install
npm run dev
```
### 📈 Future Improvements

- Expand dataset with more people, varied backgrounds & lighting.
- Use head pose & eye gaze tracking for better accuracy.
- Deploy as Dockerized full-stack app.
