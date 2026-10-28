# Car Dealership Central - IBM Full-Stack Application Development Capstone

**Repository Name:** `capstone`  
**Author:** Vishal17-coder  
**GitHub URL:** [https://github.com/Vishal17-coder/capstone](https://github.com/Vishal17-coder/capstone)  
**Deployment URL:** [https://dealership-capstone-service.us-south.codeengine.appdomain.cloud](https://dealership-capstone-service.us-south.codeengine.appdomain.cloud)

---

## 📖 Executive Summary & Project Overview

**Dealership Central** is a production-grade full-stack web platform built for vehicle buyers to search nationwide car dealerships, browse inventory, view verified user feedback, and post their own automotive reviews. The platform incorporates automated artificial intelligence (Natural Language Understanding) sentiment analysis to detect positive, neutral, and negative sentiment on all customer feedback in real time.

This project fulfills all requirements specified in the **IBM Full-Stack Application Development Capstone Project**, demonstrating mastery in:
- Responsive user interface design with modern HTML5/CSS3 and React.js.
- Microservices-based distributed architecture utilizing Python Django, Node.js/Express, and Flask.
- Relational (SQLite/PostgreSQL) and NoSQL (MongoDB/Cloudant) data modeling.
- IBM Watson NLU / Sentiment Analysis integration.
- Containerization using Docker & Docker Compose.
- Automated CI/CD pipeline implementation via GitHub Actions.
- Cloud deployment to IBM Cloud Code Engine and Kubernetes clusters.

---

## 🏛️ Architecture Overview

The application follows a decoupled, resilient microservices architecture:

```
                                  +-----------------------+
                                  |   React.js Frontend   |
                                  |  & Static HTML Pages  |
                                  +-----------+-----------+
                                              |
                                              | HTTP / REST
                                              v
+------------------------+        +-----------+-----------+        +---------------------------+
| Express / Node.js DB   |<------>|     Django Backend    |<------>|     Flask Sentiment       |
| Microservice (Port 3030)|        |  Server (Port 8000)   |        | Microservice (Port 5000)  |
| - Dealers & Reviews    |        |  - Models, Auth, APIs |        | - Natural Language Sent.  |
+------------------------+        +-----------+-----------+        +---------------------------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |     SQLite Database   |
                                  |   (Car Makes & Models)|
                                  +-----------------------+
```

### Components Breakdown:
1. **Frontend Layer (`server/frontend`)**:
   - `About.html`: Fully styled company profile showcasing executive leadership, team bios, headshots, and direct email contacts.
   - `Contact.html`: Fully styled customer care page with active navigation bar, operating hours, telephone lines, and inquiry form.
   - `Register.jsx`: Interactive sign-up component with 5 input fields (Username, First Name, Last Name, Email, Password) and client/server validation.
   - `Dealers.jsx`: Main catalog listing certified dealerships with dynamic state filter dropdown (e.g., Kansas, Texas, California).
   - `Dealer.jsx`: Individual dealer view showing address, coordinates, and verified customer reviews categorized by sentiment icons.
   - `PostReview.jsx`: Authenticated review submission component allowing users to review their dealership purchase experience.
2. **Django Application Server (`server/`)**:
   - Manages authentication sessions (`login`, `logout`, `register`).
   - Stores `CarMake` and `CarModel` entities in a relational database with Django Admin interfaces and Tabular Inlines.
   - Orchestrates backend communication with Express and Flask microservices.
3. **Database Microservice (`server/database`)**:
   - Express.js and Node.js REST API serving dealerships and reviews datasets.
   - Provides endpoints to query by dealer ID and filter by state.
4. **Sentiment Analyzer Microservice (`server/sentiment_analyzer`)**:
   - Lightweight Python Flask service that evaluates review text polarity and returns sentiment classifications (`positive`, `neutral`, `negative`).

---

## 🌐 API Endpoints Reference

### 1. Django Application Backend (`http://127.0.0.1:8000`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/djangoapp/login` | Authenticate user credentials and establish session |
| `GET` | `/djangoapp/logout` | Terminate user session and clear authentication cookie |
| `POST` | `/djangoapp/register` | Register new user with 5 required profile fields |
| `GET` | `/djangoapp/get_cars` | Retrieve all registered car makes and vehicle models |
| `GET` | `/djangoapp/get_dealers` | Fetch all nationwide car dealerships |
| `GET` | `/djangoapp/get_dealers/<state>` | Fetch dealerships filtered by state (e.g., `Kansas`) |
| `GET` | `/djangoapp/dealer/<id>` | Fetch specific dealership details by ID |
| `GET` | `/djangoapp/reviews/dealer/<id>` | Fetch reviews for a specific dealership with sentiment analysis |
| `POST` | `/djangoapp/add_review` | Submit a new customer review |
| `GET` | `/about` | Render About Us page |
| `GET` | `/contact` | Render Contact Us page |

### 2. Express Database Microservice (`http://localhost:3030`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/fetchDealers` / `/getdealers` | Returns array of all dealerships |
| `GET` | `/fetchDealer/:id` / `/dealer/:id` | Returns dealership matching ID |
| `GET` | `/fetchDealers/:state` / `/dealers/:state` | Returns dealerships for a given state |
| `GET` | `/fetchReviews/dealer/:id` | Returns customer reviews for dealer ID |
| `POST` | `/insertReview` | Inserts new review into the database |

### 3. Sentiment Analyzer Microservice (`http://localhost:5000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analyze/<review_text>` | Evaluates text sentiment (`positive`, `neutral`, `negative`) |

---

## 🚀 Setup & Local Execution Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git
- Docker and Docker Compose (optional for containerized run)

### 1. Clone the Repository
```bash
git clone https://github.com/Vishal17-coder/capstone.git
cd capstone
```

### 2. Run with Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Django Web App: [http://localhost:8000](http://localhost:8000)
- Database Microservice: [http://localhost:3030](http://localhost:3030)
- Sentiment Analyzer: [http://localhost:5000](http://localhost:5000)

### 3. Manual Local Setup

#### Step A: Express Database Microservice
```bash
cd server/database
npm install
npm start
# Service runs on port 3030
```

#### Step B: Sentiment Analyzer Microservice
```bash
cd server/sentiment_analyzer
pip install -r requirements.txt
python app.py
# Service runs on port 5000
```

#### Step C: Django Backend Application
```bash
cd server
pip install -r requirements.txt
python manage.py makemigrations djangoapp
python manage.py migrate
python -c "import sys, django; sys.path.insert(0, '.'); import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings'); django.setup(); from djangoapp.populate import initiate; initiate()"
python manage.py runserver 0.0.0.0:8000
# Server runs on http://localhost:8000
```

---

## 📂 Repository Deliverables & Verification Files

This repository contains all mandatory IBM Capstone log and submission verification deliverables:

| File Name | Purpose / Description |
|---|---|
| `django_server` | Execution log output showing Django server active on localhost |
| `CICD` | Terminal output log verifying successful GitHub Actions pipeline execution |
| `deploymentURL` | Text file specifying the live deployed application URL |
| `loginuser` | cURL command & HTTP response output for user authentication |
| `logoutuser` | cURL command & HTTP response output for user logout |
| `getdealerreviews` | cURL command & output showing dealer reviews with sentiment tags |
| `getalldealers` | cURL command & output returning all nationwide dealerships |
| `getdealerbyid` | cURL command & output returning details for specific dealer ID 3 |
| `getdealersbyState` | cURL command & output returning dealerships in Kansas state |
| `getallcarmakes` | cURL command & output returning all car makes and models |
| `analyzereview` | cURL command & output demonstrating sentiment analysis for "Fantastic services" |
| `screenshots/` | Directory containing all 12 required UI and admin screenshots |

---

## 📷 Submission Screenshots Gallery (`screenshots/`)

1. `admin_login.png`: Root user login on Django admin interface.
2. `admin_logout.png`: Root user logout from Django admin interface.
3. `get_dealers.png`: Dealerships listed on home page before login.
4. `get_dealers_loggedin.png`: Home page showing logged-in username and "Review Dealer" options.
5. `dealersbystate.png`: Home page displaying dealerships filtered by Kansas state.
6. `dealer_id_reviews.png`: Selected dealership details and sentiment-annotated reviews.
7. `dealership_review_submission.png`: Review submission form before posting.
8. `added_review.png`: Newly posted review displayed on dealership page.
9. `deployed_landingpage.png`: Deployed application landing page.
10. `deployed_loggedin.png`: Deployed application authenticated page showing username.
11. `deployed_dealer_detail.png`: Deployed dealer details view.
12. `deployed_add_review.png`: Deployed review page displaying added review.

---

## 📄 License
This project is licensed under the Apache 2.0 License - part of the IBM Full-Stack Software Developer Professional Certificate.
