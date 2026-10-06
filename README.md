# LearnSphere Full-Stack — Fixed Version

## Requirements
Install Node.js LTS (Node 18+ recommended).

## Run
Open this folder in VS Code, then Terminal:

```bash
npm install
npm start
```

Open:
http://localhost:3000

You do NOT need MongoDB. SQLite is created automatically.

## Test
1. Register as Instructor.
2. Login.
3. Create a course.
4. Open the course and add a resource and quiz question.
5. Logout.
6. Register as Student.
7. Login.
8. Open the course, enroll and take the quiz.
9. Check the result on Dashboard.

## Backend security
- Express REST API
- SQLite database
- bcrypt password hashing
- JWT in HttpOnly cookie
- Server-side role authorization
- Helmet
- Rate limiting
- Input validation
- Safe http/https resource URLs
- No passwords stored in plain text

## If npm install fails
Use Node.js LTS and run:
npm cache verify
npm install
