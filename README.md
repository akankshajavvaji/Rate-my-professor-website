# Rate My Professor Website

This project has been developed as part of Software Engineering Course (CS3201) at Mahindra University, Hyderabad.

We would like to thank our professors Dr. Vijay Rao and Dr. Avinash, our project guide Mrs. Sravanthi mam, and TA's of the course for constant guidance.

## Project Overview

A scalable and secure web-based platform built with Node.js and Express.js that allows students to rate and review professors and universities across multiple parameters. The system supports user authentication, structured data storage with MySQL, and APIs for dynamic interactions.

## Features

- **Professor Reviews:** Students can submit reviews based on quality, difficulty, and classroom experience
- **User Authentication:** Secure login/registration system for students
- **Professor Profiles:** Detailed information about professors including departments, courses taught, and ratings
- **Review Submission:** Students can submit detailed text reviews along with their ratings
- **Comparison Tool:** Compare professors by name for better course planning
- **University Insights:** View universities and submit reviews for them
- **Responsive Design:** Mobile-friendly interface for accessibility across devices

## Tech Stack

| Component | Technology Used |
|-----------|----------------|
| Frontend | HTML, CSS, JavaScript |
| Backend Framework | Express.js, Node.js |
| Database | MySQL |
| Authentication | JWT, bcryptjs |
| API Testing | Postman |

## Installation

### Prerequisites

- Node.js
- MySQL
- npm

### Setup Instructions

Clone the repository
```bash
git clone https://github.com/yourusername/rate-my-professor.git
cd rate-my-professor
```

Install dependencies
```bash
npm install
```

Run the application
```bash
npm start
```

## Usage

1. **Homepage:** Browse all professors or use the search functionality
2. **Search:** Enter professor names to find specific professors (Note: Currently only professors in the database can be searched)
3. **Login/Signup:** Create an account or login to rate professors
4. **Professor Profile:** View detailed information about a professor and their ratings
5. **Compare Professors/Universities:** Select multiple professors/universities to compare their ratings and reviews

> Note: The search suggestive mode is not functional for now, so only data from the database can be searched.

## Project Structure

```
Rate_my_professor/
├── backend/                      # Server-side logic and API
│   ├── config/                   # Configuration files (e.g., DB config)
│   ├── controllers/              # Functions handling request logic
│   ├── middleware/               # Custom middleware for request processing
│   ├── models/                   # Database schemas/models
│   ├── routes/                   # API routes
│   └── app.js                    # Main backend application entry point
├── frontend/                     # Client-side UI and interaction
│   ├── *.html                    # Pages: department, professor, university, comparisons
│   ├── *.css                     # Styles for individual pages + global styles
│   ├── *.js                      # Page-specific and shared interaction scripts
│   └── styles.css                # Common stylesheet for UI consistency
├── .env                          # Environment variables (e.g., DB credentials)
├── package.json                  # Node.js dependencies and scripts
└── package-lock.json             # Dependency version locking
```

## Known Issues

- Search suggestive mode is not functional currently
- Rating distribution is not displayed in professor compare page

## Sample Data

The system includes sample data for testing:

### Professor Data:

| professor_id | user_id | department_id | professor_name | rating | ratings_count |
|--------------|---------|---------------|----------------|--------|---------------|
| 1 | 41 | 41 | Dr. Anita Sharma | 0 | 0 |
| 2 | 42 | 42 | Dr. Rajesh Verma | 0 | 0 |
| 3 | 43 | 43 | Prof. Kavita Rao | 0 | 0 |
| 4 | 44 | 44 | Dr. Anil Mehta | 0 | 0 |
| 5 | 45 | 45 | Prof. Sneha Desai | 0 | 0 |
| 6 | 46 | 46 | Dr. Ravi Iyer | 0 | 0 |
| 7 | 47 | 47 | Prof. Meera Joshi | 0 | 0 |
| 8 | 48 | 48 | Dr. Sandeep Reddy | 0 | 0 |
| 9 | 49 | 49 | Prof. Neha Kulkarni | 0 | 0 |
| 10 | 50 | 50 | Dr. Arjun Nair | 0 | 0 |

### University Data:

| university_id | university_name | location | established_year |
|---------------|-----------------|----------|------------------|
| 42 | Brahmaputra Institute of Technology | Assam | 1995 |
| 43 | Dakshin Bharatiya University | Chennai | 1984 |
| 44 | Shivneri College of Engineering | Pune | 2002 |
| 45 | North Valley Science University | Dehradun | 2009 |
| 46 | Sri Aditya Institute of Technology | Hyderabad | 2006 |
| 47 | Eastern Ganga University | Kolkata | 1988 |
| 48 | Mount Kailash Institute of Research | Shimla | 2015 |
| 49 | Rajasthan Academy of Engineering | Jaipur | 1999 |
| 50 | Dr. Kalam Institute of Technology | Bhopal | 1990 |
| 51 | Narmada School of Science and Tech | Vadodara | 2003 |

## Team-2

- J. Hasini – SE22UCSE114
- J. Srihitha - SE22UCSE117
- J. Laxmi Akanksha – SE22UCSE119
- M. Ashritha - SE22UCSE158
- M. Srihitha – SE22UCSE306
- V. Anjusree Reddy - SE22UCSE283