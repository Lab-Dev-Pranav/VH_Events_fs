<!-- 

# 🎉 VH Event Planner

> **A complete solution for event management, bookings, team coordination, and gallery curation.**

---

## 🗂️ Project Overview

VH Event Planner is a full-service platform for planning, managing, and executing events—weddings, corporate functions, and more.  
✨ **Professionalism, creativity, and seamless user experience.**

---

## 🚀 Features

- 📝 **Event Booking:**  
  Book consultations, specify event details, and communicate requirements.  
  Admins manage bookings and update statuses.

- 🔒 **User Authentication:**  
  Secure login/signup with validation and session management.

- 👤 **Profile Management:**  
  Create/edit management profiles: info, experience, skills, departments, social links.  
  ⭐ Powerhouse status for standout team members.

- 🛠️ **Admin Dashboard:**  
  Access bookings, management profiles, gallery uploads, and newsletter subscribers.  
  ⭐ Star/unstar media, 🗑️ delete entries, 📧 send newsletters.

- 📬 **Newsletter System:**  
  Subscribe/unsubscribe, admins can send bulk emails.

- 🖼️ **Gallery:**  
  Upload images/videos, star/delete, fullscreen modal viewing.

- 📱 **Responsive UI:**  
  Modern design with Bootstrap 5 & custom CSS.

- 📄 **Agreements & Policies:**  
  Dedicated pages for client agreements, management agreements, privacy, and security.

---

## 🏗️ Modules & Structure

```
📁 controllers/
    ├─ adminController.js
    ├─ authController.js
    ├─ bookingController.js
    ├─ managementController.js
    ├─ newsletterController.js
    └─ commonController.js
📁 models/
    ├─ booking.js
    ├─ management.js
    ├─ media.js
    ├─ newsletter.js
    └─ user.js
📁 routes/
    └─ commen.js
📁 views/
📁 public/
📁 uploads/
```

---

## 📝 Data & Forms

- **Booking Form:**  
  `Full Name`, `Email`, `Phone`, `City`, `Event Type`, `Venue`, `Date`, `Requirements`, `Referral Source`

- **Management Profile Form:**  
  `Profile Picture`, `Full Name`, `Contact Info`, `Age`, `Gender`, `Height`, `Cities`, `Languages`, `Experience`, `Events Worked`, `Categories`, `Companies`, `Departments`, `Skills`, `Working Style`, `Instagram`, `Agreement Confirmations`

- **Newsletter Form:**  
  `Email Input` for subscription

---

## 💡 User Experience

- 🏠 **Homepage:**  
  About, gallery preview, powerhouse team carousel, testimonials, contact/booking CTAs

- 🖼️ **Gallery:**  
  Grid layout, modal viewing for images/videos

- 👤 **Profile:**  
  User info, management profile, booking history, edit/delete options

- 🛠️ **Admin:**  
  Dashboard with quick links to bookings, newsletters, gallery, management profiles

- 🛎️ **Service Page:**  
  Detailed services, team roles, workflow timeline

- 📄 **Agreements:**  
  Clear terms for clients/management, privacy/security policies

---

## ⚙️ Technologies Used

- Node.js, Express.js, MongoDB, Mongoose
- EJS templating
- Bootstrap 5, custom CSS
- Cloudinary (media uploads)
- Passport.js (authentication)
- Nodemailer (emails)

---

## 🔒 Security & Accessibility

- Passwords hashed, secure sessions, privacy policy
- Responsive design, clear navigation, form validation

---

## 🛠️ Customization

Admins manage all aspects: team, media, communications.

---

> For more details, explore the codebase and EJS views for each feature and workflow. -->







# 🎉 VH Event Planner

> **A complete solution for event management, bookings, team coordination, and gallery curation.**

---

## 🗂️ Project Overview

VH Event Planner is a full-service platform for planning, managing, and executing events—weddings, corporate functions, and more.  
✨ **Professionalism, creativity, and seamless user experience.**

---

## 🚀 Features

- 📝 **Event Booking:**  
  Book consultations, specify event details, and communicate requirements.  
  Admins manage bookings, assign departments, and update event statuses.

- 🔒 **User Authentication:**  
  Secure login/signup with validation and session management.

- 👤 **Profile Management:**  
  Create/edit management profiles with info, experience, departments, and skills.  
  ⭐ Powerhouse status for standout team members.  
  📩 **New:** Email form for users to update or complete their management profiles.

- 🛠️ **Admin Dashboard:**  
  Access bookings, management profiles, event details, gallery uploads, and newsletter subscribers.  
  🧭 **New:** Edit Event Page — update event details, volunteers, departments, and statuses dynamically.  
  🧩 Volunteer assignment with department-based dropdowns.  
  🧱 Department ordering uses a priority sequence: ['Show Flow', 'Shadow', 'Production', 'Logistics', 'Hospitality', 'F&B', 'Ritual', 'Artist Coordination']

  (Any missing departments from DB are auto-appended.)

- 📬 **Newsletter System:**  
Subscribe/unsubscribe; admins can send bulk emails directly via the dashboard.  
✉️ Updated mailer logic with improved structure and error handling.

- 🖼️ **Gallery:**  
Upload images/videos, star/delete, fullscreen modal viewing.

- 📱 **Responsive UI:**  
Modern layout built with EJS + Bootstrap 5 + custom CSS.  
Unified design across Home, Contact, and Profile pages.

- 📄 **Agreements & Policies:**  
Dedicated pages for client agreements, management agreements, privacy, and security.

---

## 🏗️ Modules & Structure
📁 controllers/
├─ adminController.js # Dashboard + event edit features
├─ authController.js # Login/signup/authentication
├─ bookingController.js # Event booking and management
├─ managementController.js # Profile management
├─ newsletterController.js # Bulk email + subscriber handling
└─ commonController.js # Shared routes and rendering
📁 models/
├─ booking.js
├─ management.js
├─ media.js
├─ newsletter.js
└─ user.js
📁 routes/
└─ commen.js
📁 views/
├─ admin/ (dashboard, editEvent.ejs)
├─ users/
├─ partials/
📁 public/
├─ css/
├─ js/
📁 uploads/


---

## 📝 Data & Forms

- **Booking Form:**  
  `Full Name`, `Email`, `Phone`, `City`, `Event Type`, `Venue`, `Date`, `Requirements`, `Referral Source`

- **Management Profile Form:**  
  `Profile Picture`, `Full Name`, `Contact Info`, `Age`, `Gender`, `Height`, `Cities`, `Languages`,  
  `Experience`, `Events Worked`, `Categories`, `Companies`, `Departments`, `Skills`,  
  `Working Style`, `Instagram`, `Agreement Confirmations`

- **Event Edit Form (Admin):**  
  `Event Date`, `Location`, `Description`, `Volunteers`,  
  `Department Assignments (dropdown)`, `Event Status`

- **Newsletter Form:**  
  `Email Input` for subscription and admin message broadcast

---

## 💡 User Experience

- 🏠 **Homepage:**  
  About, gallery preview, powerhouse team carousel, testimonials, and CTAs.

- 🖼️ **Gallery:**  
  Grid layout with modal image/video viewer.

- 👤 **Profile:**  
  User info, management profile, edit/update via email form, booking history.

- 🛠️ **Admin Dashboard:**  
  Central hub for bookings, newsletters, gallery, management profiles, and events.

- 📅 **Event Management:**  
  Admins can add/update event data, manage volunteer assignments, and track statuses.

- 📄 **Agreements:**  
  Clear terms for clients and management with privacy/security policies.

---

## ⚙️ Technologies Used

- Node.js, Express.js, MongoDB, Mongoose  
- EJS templating  
- Bootstrap 5, custom CSS  
- Cloudinary (media uploads)  
- Passport.js (authentication)  
- Nodemailer (emails)

---

## 🔒 Security & Accessibility

- Passwords hashed, secure sessions, privacy policy  
- Responsive design, clear navigation, form validation

---

## 🛠️ Customization

Admins manage all aspects: team, media, communications, events, and newsletters.

---

> For more details, explore the codebase and EJS views for each feature and workflow.
  