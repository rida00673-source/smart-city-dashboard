# 🏙️ Smart City Dashboard

**Intelligent Urban Monitoring System for Islamabad & Rawalpindi**

Smart City Dashboard is a web-based urban monitoring platform designed to visualize and analyze important city conditions across Islamabad and Rawalpindi.

The system provides a centralized dashboard for monitoring traffic, environment, air quality, infrastructure, waste, water leakage, electricity, flood risk, road conditions, alerts, and city zones.

It also includes an AI-powered insights layer that converts available city data into understandable insights, risk indicators, comparisons, and priority areas.

---

## 🔗 Live Demo

**Frontend:** [https://rida00673-source.github.io/smart-city-dashboard/](https://rida00673-source.github.io/smart-city-dashboard/)

> ⚠️ **Note:** This project currently uses simulated/demo data for demonstration and portfolio purposes. It does not represent official real-time government or sensor data.

---

## 📸 Screenshots

| City Overview | City Intelligence Map |
|---|---|
| ![Dashboard Overview](images/overview.png) | ![City Map](images/map.png) |

| Traffic Monitoring | AI Insights |
|---|---|
| ![Traffic](images/traffic.png) | ![AI Insights](images/ai-insights.png) |

---

## ✨ Features

### 📊 Smart City Overview
- Overall city health indicators
- Air quality monitoring
- Traffic congestion monitoring
- Temperature information
- Active alerts
- Islamabad vs Rawalpindi comparison

### 🚦 Traffic Monitoring
- Traffic congestion visualization
- Road-wise traffic information
- Interactive charts
- Traffic condition analysis

### 🌤️ Environment & Air Quality
- AQI monitoring
- Environmental condition analysis
- Zone-based environmental information
- Air quality visualization

### 🗺️ Interactive City Intelligence Map
The interactive map provides location-based monitoring for:
- 🚦 Traffic
- 🗑️ Garbage
- 💧 Water Leakage
- ⚡ Electricity
- 🌊 Flood Risk
- 🛣️ Road Damage

Users can explore different zones and identify areas that require attention.

### 🤖 AI-Powered Insights
The AI intelligence layer generates data-based insights including:
- High-risk zones
- Traffic insights
- Environmental insights
- City comparisons
- Overall city health
- Priority areas
- Data-based predictions

### 🚨 Smart Alerts
The dashboard identifies important city conditions and presents alerts to help users quickly recognize potential problems.

### 🌊 Flood Risk Monitoring
Provides visualization of areas with potential flood-related risks.

### 🗑️ Waste Management
Allows monitoring of waste-related conditions across different city zones.

### 💧 Water Leakage Monitoring
Helps identify areas where water leakage issues may require attention.

### ⚡ Electricity Monitoring
Provides city-zone information related to electricity conditions.

### 🛣️ Road Damage Monitoring
Highlights road-related problems and helps identify priority areas.

### 💬 Smart City Assistant
A smart assistant interface designed to help users interact with city information and understand dashboard insights.

---

## 🏙️ Supported Cities

The dashboard focuses on:
- **Islamabad (ISL)**
- **Rawalpindi (RWP)**

The system uses zone-based information to provide a more detailed view of urban conditions.

---

## 📈 Data Visualization

The dashboard uses interactive visualizations to make complex city information easier to understand.

Visualization includes:
- Traffic charts
- Environmental charts
- AQI information
- City comparisons
- Health scores
- Forecast/prediction visualizations
- Alert indicators

---

## 🤖 AI Intelligence Layer

The dashboard includes an intelligent analysis layer that processes available city data and generates meaningful information.

The system can analyze:

**Air Quality + Traffic + Alerts + Zone Conditions**

to produce an overall understanding of city health.

Example insights include:
- Which zone has the highest risk
- Which city is performing better
- Current traffic conditions
- Environmental concerns
- Priority areas requiring attention

---

## 🛠️ Technologies

**Frontend**
- HTML5
- CSS3
- JavaScript

**Libraries**
- Chart.js
- Leaflet.js
- Google Fonts

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- MongoDB Atlas

**Deployment**
- GitHub Pages — Frontend
- Railway — Backend
- MongoDB Atlas — Database

---

## 🏗️ System Architecture

```
                    👤 User
                       │
                       ▼
            🏙️ Smart City Dashboard
                       │
                       ▼
        Frontend — HTML / CSS / JavaScript
                       │
                       ▼
             Backend API — Node.js
                       │
                       ▼
              Express.js Server
                       │
                       ▼
                 MongoDB Database
                       │
                       ▼
                📊 City Data
```

---

## 📂 Project Structure

```
Smart-City-Dashboard/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── data.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── images/
│
├── .gitignore
└── README.md
```

*Project structure may change as additional features and backend modules are added.*

---

## 🚀 Getting Started

### Prerequisites
Make sure the following are installed:
- Node.js
- npm
- MongoDB or MongoDB Atlas
- VS Code

### 1. Clone the Repository
```bash
git clone https://github.com/rida00673-source/smart-city-dashboard.git
cd smart-city-dashboard
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Never publish your actual MongoDB credentials.

### 4. Start the Backend
```bash
npm start
```
The backend API will run on the configured port.

### 5. Run the Frontend
Open the `frontend` folder in VS Code and launch `index.html` using Live Server.

Alternatively, use the deployed version:

**Live Demo:** [https://rida00673-source.github.io/smart-city-dashboard/](https://rida00673-source.github.io/smart-city-dashboard/)

---

## 🔐 Security

Sensitive configuration files should never be committed to GitHub.

Do not upload:
- `.env`
- MongoDB passwords
- API keys
- Private credentials
- Authentication secrets

Make sure `.env` is included in `.gitignore`.

---

## 🎯 Project Goal

The goal of Smart City Dashboard is to provide a simple and centralized platform for understanding urban conditions.

Instead of presenting raw city data, the system organizes information into:

**Monitor → Analyze → Identify → Understand → Act**

This approach can help users quickly understand city conditions and identify areas that may require attention.

---

## 🗺️ Future Improvements

Planned improvements include:
- [ ] Real-time IoT/sensor data integration
- [ ] Advanced AI predictions
- [ ] User authentication and administrator accounts
- [ ] Push notifications for critical alerts
- [ ] More detailed GIS-based city mapping
- [ ] Mobile application
- [ ] Advanced analytics and reporting
- [ ] Real-time government/open-data integration

---

## 👩‍💻 Developer

Developed independently as a Software Engineering project.

The project was designed and developed to demonstrate skills in:
- Frontend Development
- JavaScript
- Data Visualization
- Interactive Maps
- Backend API Development
- Database Integration
- AI-based Data Analysis
- Deployment

---

## 📄 License

This project is created for educational, portfolio, and demonstration purposes.

---

### 🌟 Turning City Data into Smarter Decisions.
