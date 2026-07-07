# Learning Management System (LMS)
## Production Database Design

Version: 1.0

---

# Project Overview

This Learning Management System (LMS) is designed as a production-ready education platform for a tuition institute.

The platform consists of two major parts:

1. Public Website
2. Learning Management System (LMS)

The public website serves as the institute's official website, while the LMS manages teachers, students, learning materials, assignments, recordings, announcements, and monthly session access.

The architecture is designed for rapid MVP development while remaining scalable for future enterprise features such as online payments, AI assistants, mobile applications, attendance tracking, analytics, and parent portals.

---

# Design Principles

- PostgreSQL relational database
- Prisma ORM
- UUID primary keys
- Normalized database structure
- Role-Based Access Control (RBAC)
- Feature-based backend architecture
- Soft delete strategy
- Audit fields on every table
- Scalable domain-driven design

---

# User Roles

The system uses a single User table.

Roles:

- ADMIN
- TEACHER
- STUDENT

Permissions are controlled through role-based authorization.

---

# Business Flow

Teacher creates Courses.

Each Course consists of multiple Course Sessions.

Each Course Session represents one teaching period (normally monthly).

Every Course Session contains:

- Recordings
- Learning Materials
- Assignments
- Announcements

Students enroll in Courses.

Access to each Course Session is controlled independently.

If payment for a session is approved, the student receives permanent access to that session.

Future sessions remain locked until payment is approved.

---

# Entity Overview

User

↓

Course

↓

CourseSession

├── Recording

├── Material

├── Assignment

├── Announcement

└── SessionAccess

Assignment

↓

Submission

User

↓

Notification

---

# Database Entities

---

## User

Stores all users of the system.

Fields

- id (UUID)
- email
- password
- firstName
- lastName
- phone
- profileImage
- role
- status
- lastLogin
- createdAt
- updatedAt

---

## Course

Represents one tuition class.

Example:

- 2027 A/L Physics
- 2026 Combined Maths

Fields

- id
- teacherId
- title
- description
- subject
- grade
- thumbnail
- status
- createdAt
- updatedAt

Relationship

One Teacher

↓

Many Courses

---

## Enrollment

Represents the relationship between a student and a course.

Students enroll only once.

Enrollment does NOT determine monthly access.

Fields

- id
- studentId
- courseId
- joinedAt
- status
- createdAt

Relationship

Student

↓

Enrollment

↓

Course

---

## CourseSession

Represents one learning session of a course.

Normally one session equals one teaching month.

Examples

- January 2027
- February 2027
- Revision Session
- Paper Discussion

Fields

- id
- courseId
- title
- sessionNumber
- month
- year
- description
- startDate
- endDate
- status
- createdAt
- updatedAt

Relationship

Course

↓

Many Course Sessions

---

## SessionAccess

Controls whether a student can access a Course Session.

One record is created after payment is approved.

Fields

- id
- studentId
- courseSessionId
- paymentStatus
- approvedBy
- approvedAt
- accessGranted
- createdAt

Application Rule

If SessionAccess exists and accessGranted = true

↓

Student can access that session.

Otherwise

↓

Session remains locked.

Students permanently retain access to previously paid sessions.

---

## Material

Learning resources.

Examples

- PDF
- Notes
- ZIP Files
- External Links

Fields

- id
- courseSessionId
- title
- description
- fileUrl
- createdBy
- createdAt

---

## Recording

Stores recorded lecture information.

Fields

- id
- courseSessionId
- title
- videoUrl
- duration
- uploadedBy
- createdAt

Videos will be hosted externally (Cloudinary, Bunny Stream, Vimeo, etc.)

Only metadata is stored in PostgreSQL.

---

## Assignment

Teacher assignments.

Fields

- id
- courseSessionId
- title
- description
- deadline
- attachmentUrl
- createdBy
- createdAt

---

## Submission

Student assignment submissions.

Fields

- id
- assignmentId
- studentId
- fileUrl
- submittedAt
- marks
- feedback
- status

Future Features

- AI Evaluation
- Plagiarism Detection

---

## Announcement

Teacher announcements.

Fields

- id
- courseSessionId
- title
- content
- publishedAt

---

## Notification

Stores notifications for users.

Fields

- id
- userId
- title
- message
- type
- isRead
- createdAt

Examples

- New Assignment
- Assignment Graded
- New Recording
- Payment Approved
- Announcement Published

---

# Relationships

User (Teacher)

↓

Course

↓

CourseSession

├── Material

├── Recording

├── Assignment

│

└── Submission

├── Announcement

└── SessionAccess

Student

↓

Enrollment

↓

Course

Notification

↓

User

---

# Access Flow

Student registers

↓

Student enrolls in Course

↓

Teacher creates monthly Course Sessions

↓

Student pays for session

↓

Admin approves payment

↓

SessionAccess created

↓

Student can access

- Materials
- Recordings
- Assignments
- Announcements

Future sessions remain locked until payment approval.

Previously unlocked sessions remain permanently accessible.

---

# Status Enums

UserStatus

- ACTIVE
- INACTIVE
- BLOCKED

CourseStatus

- DRAFT
- ACTIVE
- ARCHIVED

SessionStatus

- DRAFT
- PUBLISHED
- CLOSED

SubmissionStatus

- PENDING
- SUBMITTED
- LATE
- GRADED

PaymentStatus

- PENDING
- APPROVED
- REJECTED

---

# Naming Standards

Tables

Singular

Example

- User
- Course
- Assignment

Columns

camelCase

Primary Key

id

Foreign Keys

teacherId

studentId

courseId

courseSessionId

createdBy

approvedBy

---

# Future Modules

This architecture supports:

- Online Payments
- Attendance
- Parent Portal
- Live Classes
- AI Assistant
- RAG Knowledge Base
- Discussion Forums
- Mobile Application
- Analytics Dashboard
- Certificates

without requiring structural database redesign.

---

# Development Order

Phase 1

- Authentication
- User Management

Phase 2

- Course Management
- Course Sessions

Phase 3

- Student Enrollment
- Session Access

Phase 4

- Materials
- Recordings
- Assignments
- Submissions
- Announcements

Phase 5

- Notifications

Phase 6

- Frontend Integration

Phase 7

- Production Deployment

Phase 8

- AI Assistant
- Payment Gateway
- Attendance