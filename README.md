# RCF Backend API

A comprehensive backend API for managing religious organization content, user communications, and workforce applications. Built with Node.js and Express.

## Overview

RCF Backend is a RESTful API service designed to support a religious community platform with admin controls, content management, and user engagement features. It provides functionality for managing news, programs, hymns, processing workforce applications, and facilitating communication between administrators and users.

## Features

### Admin Features
- **Authentication**: Secure admin registration and login with JWT tokens
- **Content Management**: 
  - Create, read, update, and delete news posts
  - Manage programs and publish schedules
  - Publish and manage hymns
- **User Management**: 
  - View user profiles and applications
  - Reply to user messages
  - Process workforce applications
  - Generate PDF documents for worker applications
- **Media Management**: Upload images via Cloudinary integration

### User Features
- **Messages**: Send and receive messages to/from administrators
- **Applications**: Apply for workforce positions with document uploads
- **Content Access**: View published news, programs, and hymns
- **Communication**: Track replied messages and communications

## Tech Stack

**Runtime & Framework:**
- Node.js
- Express.js v5.1.0

**Database:**
- MongoDB with Mongoose ODM

**Authentication & Security:**
- JWT (JSON Web Tokens)
- Bcrypt for password hashing

**File Management:**
- Multer for file uploads
- Cloudinary for cloud storage
- Puppeteer for PDF generation

**Additional Libraries:**
- Nodemailer for email functionality
- libphonenumber-js for phone number validation
- EJS for templating
- CORS for cross-origin requests

## Project Structure

```
rcf_backend/
├── config/              # Configuration files
│   └── cloudinary.js   # Cloudinary setup
├── controllers/         # Business logic
│   ├── admin.controller.js
│   ├── users.controller.js
│   ├── post.controller.js
│   ├── update.controller.js
│   └── delete.controller.js
├── models/              # Database schemas
│   ├── admin.model.js
│   ├── users.model.js
│   ├── news.model.js
│   ├── program.model.js
│   ├── Hyms.model.js
│   ├── serial.model.js
│   ├── adminReply.model.js
│   ├── usersMessage.model.js
│   └── workersForm.model.js
├── routes/              # API endpoints
│   ├── admin.routes.js
│   └── users.routes.js
├── middleware/          # Custom middleware
│   ├── upload.js       # File upload middleware
│   └── verifyToken.js  # JWT verification
├── utils/               # Utility functions
│   ├── generateSerialNumber.js
│   └── generateWorkerPDF.js
├── index.js            # Application entry point
├── package.json        # Project dependencies
└── .env                # Environment variables
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Cloudinary account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rcf_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   mongo_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   frontend_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Admin Routes (`/api/admin`)

#### Authentication
- `POST /reg` - Admin registration
- `POST /login` - Admin login
- `GET /profile/me` - Get admin profile (requires token)

#### Content Management
- `POST /post/news` - Create news post (with image upload)
- `GET /published/news` - Get all published news
- `PUT /update/news/:id` - Update news post
- `DELETE /delete/news/:id` - Delete news post

- `POST /post/program` - Create program post (with image upload)
- `GET /published/programmes` - Get all published programs
- `PUT /update/program/:id` - Update program post
- `DELETE /delete/program/:id` - Delete program post

- `POST /post/hymn` - Publish hymn
- `GET /published/hymns` - Get all published hymns
- `PUT /update/hymn/:id` - Update hymn
- `DELETE /delete/hymn/:id` - Delete hymn

#### User Management
- `DELETE /delete/appliedWorker/:id` - Delete worker application

### User Routes (`/api/user`)

- `POST /apply/workforce` - Submit workforce application (with document upload)
- `GET /apply/workforce/getdetails` - Get applied worker details
- `POST /message` - Send message to admin
- `GET /get/message` - Get user messages
- `PUT /message/seen/:id` - Mark message as seen
- `POST /admin/reply` - Admin replies to user message
- `GET /get/message/replied` - Get replied messages (requires token)
- `DELETE /get/message/replied/delete/:id` - Delete replied message

## Database Models

- **Admin**: Administrator accounts and profiles
- **News**: News articles posted by admins
- **Program**: Religious programs and schedules
- **Hymns**: Hymn collection and management
- **UsersMessage**: User communications and inquiries
- **AdminReply**: Admin responses to user messages
- **WorkersForm**: Workforce application submissions
- **Serial**: Serial number generation for tracking
- **AdminReply**: Admin reply tracking

## Middleware

### verifyToken
- Validates JWT tokens for protected routes
- Extracts user/admin information from token

### upload
- Handles file uploads to Cloudinary
- Supports single file uploads with validation

## Utilities

- **generateSerialNumber.js**: Creates unique serial numbers for applications
- **generateWorkerPDF.js**: Generates PDF documents for worker applications

## Error Handling

The API includes error handling for:
- Database connection failures
- Authentication errors
- File upload errors
- Validation errors
- Server errors

## CORS Configuration

Allow requests from frontend domains specified in the `frontend_URL` environment variable.

## Development

**Available Scripts:**
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (requires nodemon installation)

## Future Enhancements

- Add role-based access control (RBAC)
- Implement pagination for list endpoints
- Add input validation schemas
- Add comprehensive error logging
- Create API documentation (Swagger/OpenAPI)
- Add unit and integration tests
- Implement rate limiting

## Workers In Training Exam: RBAC & Exam Engine

This release adds production-level RBAC and an exam engine for "Workers In Training". Key additions:

- New middleware: `verifyToken` (existing) and `requireRole(roleName)` to enforce role-based access.
- New models: `Exam`, `ExamResult`, `Interview`.
- Service layer: `services/exam.service.js` contains grading logic.
- Controllers: `controllers/exam.controller.js`, `controllers/interview.controller.js`.
- Validation middleware: `middleware/validateObjectId.js`, `middleware/validateExamSubmission.js`.

All new admin exam/interview endpoints are protected with `verifyToken` and `requireRole('workersInTraining')`.

### Folder Restructure Proposal

To keep the codebase scalable and clear, adopt this structure for feature areas (already partially applied):

```
rcf_backend/
├── controllers/
│   ├── exam.controller.js
│   ├── interview.controller.js
│   └── ...
├── services/
│   └── exam.service.js
├── models/
│   ├── exam.model.js
│   ├── examResult.model.js
│   └── interview.model.js
├── middleware/
│   ├── requireRole.js
│   ├── validateObjectId.js
│   └── validateExamSubmission.js
├── routes/
│   └── admin.routes.js
```

This structure keeps business logic (controllers), domain services (services), and data models (models) separated for easier scaling and testability.

### Example Requests & Responses

1) Create Exam (Admin with `workersInTraining` role)

POST /api/admin/exam/create
Body JSON:

```
{
   "title": "Workers In Training - Basic",
   "questions": [
      { "question": "What is X?", "options": ["A","B","C","D"], "correctAnswer": "A" }
   ],
   "duration": 30,
   "startTime": "2026-03-01T08:00:00.000Z",
   "endTime": "2026-03-01T10:00:00.000Z",
   "passMark": 60
}
```

Response (201):

```
{ "message": "Exam created", "exam": { ... } }
```

2) Submit Exam

POST /api/admin/exam/submit
Body JSON:

```
{
   "examId": "<examId>",
   "applicantId": "<workersFormId>",
   "fullName": "Jane Doe",
   "email": "jane@example.com",
   "answers": [ { "questionId": "<qId>", "selectedAnswer": "A" } ]
}
```

Responses:
- 201: { "message": "Exam submitted", "result": { ... } }
- 400: { "message": "Applicant has already submitted this exam" }
- 400: { "message": "Applicant must complete exam before interview." }

3) Move Applicant to Interview

POST /api/admin/interview/:applicantId

Response 201: { "message": "Interview created", "interview": { ... } }

### Security & Scalability Notes

- Duplicate submissions are prevented via a unique compound index on `(applicantId, examId)` in `ExamResult`.
- `ExamResult.email` is indexed to support fast lookups.
- Controllers use `.lean()` for read queries to reduce memory overhead.
- Inputs are sanitized and validated in `validateExamSubmission.js` and `validateObjectId.js`.
- Future improvements: add request rate-limiting, detailed audit logs, and a queue for heavy operations (PDF generation, large exports).


## Support

For issues or questions, please contact the development team.

## License

ISC
