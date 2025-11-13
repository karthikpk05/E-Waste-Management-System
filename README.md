# ♻️ E-Waste Management System

An intelligent web application designed to streamline the collection, tracking, and management of electronic waste (e-waste).  
This project was developed as part of an **internship**, focusing on building a full-stack system with secure authentication, automated notifications, and real-time status tracking for waste requests.

---

## 🚀 Project Overview

The **E-Waste Management System** provides a digital platform that connects users, pickup personnel, and administrators to manage e-waste efficiently and transparently.

- **Users** can register, submit disposal requests, update their profiles, and track their pickup status.  
- **Pickup Personnel** can view assigned pickup requests, update collection status, and manage logistics.  
- **Admin** can manage users, approve or reject requests, assign pickups, and oversee all system operations via a dashboard.

---

## 🧩 Features

### 👤 User
- Register and login securely (JWT-based authentication)
- Submit e-waste disposal requests with location details
- View and track request status
- Receive in-app and email notifications for request updates
- Edit profile details

### 🚚 Pickup Person
- View assigned pickup requests
- Update collection progress (Pending → In-Progress → Completed)
- Access map navigation (via OpenStreetMap integration)

### 🛠️ Admin
- Dashboard overview of all requests and users
- Approve, reject, or assign pickup requests
- Monitor overall system performance and activities

### 🔔 Additional Features
- Automated email notifications for approvals and scheduling
- In-app notification system with bell icon
- Data visualization using Recharts (status and request analytics)
- Integrated interactive map using **OpenStreetMap + Leaflet.js**

### 💡 Applications & Benefits
- Promotes responsible electronic waste management
- Encourages recycling and environmental protection
- Automates scheduling and tracking for better efficiency
- Reduces manual coordination and paperwork

### ⚠️ Challenges Faced

- Handling API security with JWT and CORS configuration
- Integrating frontend-backend communication seamlessly
- Managing asynchronous updates and notifications
- Ensuring scalability and reliability of the system

---

## 🖼️ System Workflow

User → Submits E-Waste Request → Admin Reviews & Assigns Pickup → Pickup Person Collects Waste → Admin Confirms Completion → User Receives Notifications

---

## 🧠 Technology Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, CSS, Recharts, Leaflet.js |
| Backend | Spring Boot (Java), RESTful APIs |
| Database | MySQL |
| Authentication | JWT (JSON Web Token) |
| Map Integration | OpenStreetMap + Leaflet |
| API Testing | Postman |
| Notifications | Email + In-App Notification System |

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites
- Node.js and npm  
- Java JDK 17+  
- MySQL Database  
- Spring Boot CLI (optional)

### 🗂️ Clone the Repository
```bash
git clone https://github.com/<your-username>/ewaste-management-system.git
cd ewaste-management-system

