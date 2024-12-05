
# Bulk Mailing App with MERN Stack and SendGrid API

This project is a bulk mailer application built with the MERN stack (MongoDB, Express, React, Node.js) and SendGrid API for sending customized emails to groups.

### Key Features
- **Frontend:** React with Bootstrap for a user-friendly interface.
- **Backend:** Node.js and Express handle routes and HTTP requests.
- **Database:** MongoDB stores user data, mail groups, and templates.
- **API:** SendGrid API enables sending bulk emails.
- **Utility:** Axios facilitates API communication.

### Project Setup
1. Clone the repository: `git clone <repo-url>`.
2. Set up the backend:
   - Navigate to the `backend` folder: `cd backend`.
   - Install dependencies: `npm install`.
   - Create a `.env` file with:
     ```
     BASEURL=/api/v1
     DATABASE=<your-mongodb-url>
     Secret_Code=<your-jwt-secret>
     Mail_Secret=<your-sendgrid-api-key>
     ```
   - Start the server: `npm start`.
3. Set up the frontend:
   - Navigate to the `frontend` folder: `cd frontend`.
   - Install dependencies: `npm install`.
   - Start the server: `npm run start`.

### Features
- Sign up/login functionality.
- Save mail groups and templates.
- Send emails using custom messages or templates.
- View sent mail details.

### Technologies
- MongoDB, Express, React, Node.js
- SendGrid API, Axios, Bootstrap
