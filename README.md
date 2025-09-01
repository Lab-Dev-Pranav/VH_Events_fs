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

> For more details, explore the codebase and EJS views for each feature and workflow.
