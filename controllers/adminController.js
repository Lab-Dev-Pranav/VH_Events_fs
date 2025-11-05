const Booking = require("../models/booking");
const Newsletter = require("../models/newsletter");
const ManagementProfile = require("../models/management");
const Media = require("../models/media");
const Event = require("../models/event");

const nodemailer = require("nodemailer");
const cloudinary = require('cloudinary').v2;

// Render admin dashboard
exports.renderAdminDashboard = (req, res) => {
  res.render('admin/admin.ejs');
};

// Render all bookings for admin
exports.renderAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user')
      .sort({ createdAt: -1 });
    res.render('admin/admin_booking.ejs', { bookings });
  } catch (e) {
    req.flash('error', 'Error fetching bookings.');
    res.redirect('/admin');
  }
};

// Update admin note for a booking
exports.updateAdminNote = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { adminNote: req.body.adminNote });
    res.redirect('/admin/bookings');
  } catch (e) {
    req.flash('error', 'Could not update admin note.');
    res.redirect('/admin/bookings');
  }
};

// Render newsletter emails page
exports.renderAdminNewsletters = async (req, res) => {
  try {
  const newsletters = await Newsletter.find({});
  res.render("admin/admin_newsletter.ejs", { newsletters });
  } catch (e) {
    req.flash("error", "Error to render newsletter emails form.");
    res.redirect("/admin");
  }
};

// Render new event form
exports.renderNewEventForm = async (req, res) => {
  try {
    const { date } = req.query;
    const managementProfiles = await ManagementProfile.find({});
    // console.log(managementProfiles);
    res.render('admin/new_event.ejs', { date, managementProfiles });
  } catch (err) {
    req.flash('error', 'Error loading new event form');
    res.redirect('/admin/dates');
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      date,
      location,
      totalVolunteers,
      maleReq,
      femaleReq,
      departmentAssignments,
      assignedVolunteers
    } = req.body;
    // Basic validation
    if (!name || !date) {
      req.flash('error', 'Event name and date are required.');
      return res.redirect(`/admin/event/new?date=${encodeURIComponent(date || '')}`);
    }

    // Normalize and convert types
    const eventDate = date ? new Date(date) : null;
    const total = totalVolunteers ? parseInt(totalVolunteers, 10) : 0;
    const male = maleReq ? parseInt(maleReq, 10) : 0;
    const female = femaleReq ? parseInt(femaleReq, 10) : 0;

    // Parse department assignments safely (client sends JSON string)
    let departments = [];
    if (departmentAssignments) {
      try {
        departments = typeof departmentAssignments === 'string'
          ? JSON.parse(departmentAssignments)
          : departmentAssignments;
        // Ensure each department entry has the expected shape
        departments = departments.map(d => ({
          department: d.department || '',
          assignedVolunteers: Array.isArray(d.assignedVolunteers) ? d.assignedVolunteers : (d.assignedVolunteers ? [d.assignedVolunteers] : [])
        }));
      } catch (e) {
        console.warn('Invalid departmentAssignments JSON provided, ignoring departments.', e);
        departments = [];
      }
    }

    // Normalize assignedVolunteers (may be string or array)
    let assigned = [];
    if (assignedVolunteers) {
      if (Array.isArray(assignedVolunteers)) assigned = assignedVolunteers;
      else assigned = [assignedVolunteers];
    }

    const event = new Event({
      name,
      date: eventDate,
      location,
      totalVolunteers: total,
      maleReq: male,
      femaleReq: female,
      departmentAssignments: departments,
      assignedVolunteers: assigned,
      status: 'Upcoming'
    });

    await event.save();
    req.flash('success', 'Event created successfully!');
    res.redirect('/admin/dates');
  } catch (err) {
    console.error('Error creating event:', err);
    req.flash('error', 'Failed to create event: ' + err.message);
    res.redirect('/admin/dates');
  }
};
// Render edit event details (add/remove volunteers)
exports.renderEditEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).lean();
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/dates');
    }
    const managementProfiles = await ManagementProfile.find({}).sort({ name: 1 }).lean();
    // Ensure assignedVolunteers is an array for template
    event.assignedVolunteers = event.assignedVolunteers || [];
    event.departmentAssignments = event.departmentAssignments || [];
    res.render('admin/edit_event_details.ejs', { event, managementProfiles });
  } catch (err) {
    console.error('Error loading edit event details:', err);
    req.flash('error', 'Unable to load event details');
    res.redirect('/admin/dates');
  }
};

// Update event volunteers & department assignments
exports.updateEventVolunteers = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { assignedVolunteers, departmentAssignments } = req.body;

    // Normalize assignedVolunteers
    let assigned = [];
    if (assignedVolunteers) {
      if (Array.isArray(assignedVolunteers)) assigned = assignedVolunteers;
      else assigned = [assignedVolunteers];
    }

    // Parse departments safely
    let departments = [];
    if (departmentAssignments) {
      try {
        departments = typeof departmentAssignments === 'string'
          ? JSON.parse(departmentAssignments)
          : departmentAssignments;
        departments = departments.map(d => ({
          department: d.department || '',
          assignedVolunteers: Array.isArray(d.assignedVolunteers) ? d.assignedVolunteers : (d.assignedVolunteers ? [d.assignedVolunteers] : [])
        }));
      } catch (e) {
        console.warn('Invalid departmentAssignments JSON provided when updating event:', e);
        departments = [];
      }
    }

    await Event.findByIdAndUpdate(eventId, {
      assignedVolunteers: assigned,
      departmentAssignments: departments
    });

    req.flash('success', 'Event volunteers updated');
    res.redirect('/admin/dates');
  } catch (err) {
    console.error('Error updating event volunteers:', err);
    req.flash('error', 'Failed to update event');
    res.redirect('/admin/dates');
  }
};

// Send newsletter emails
exports.sendNewsletterEmails = async (req, res) => {
  const { subject, message } = req.body;
  const newsletters = await newsletterRouter.find({});
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.VH_EVENTS_USER,
        pass: process.env.VH_EVENTS_PASS,
      },
    });
    for (const newsletter of newsletters) {
      const mailOptions = {
        from: `"VH Events Newsletter" <${process.env.VH_EVENTS_USER}>`,
        to: newsletter.email,
        subject: subject,
        text: message,
      };
      await transporter.sendMail(mailOptions);
    }
    req.flash("success", "Newsletter emails sent successfully!");
    res.redirect("/");
  } catch (e) {
    req.flash("error", "Error sending newsletter emails.");
    res.redirect("/admin/newsletters");
  }
};

// Render gallery upload page
exports.renderGalleryUpload = async (req, res) => {
  const media = await Media.find().sort({ uploadedAt: -1 });
  res.render('admin/admin_gallery_upload.ejs', { media });
};

// Handle gallery upload
exports.handleGalleryUpload = async (req, res) => {
  const file = req.file;
  if (!file) {
    req.flash('error', 'No file uploaded.');
    return res.redirect('/admin/gallery/upload');
  }
  const type = file.mimetype.startsWith('video') ? 'video' : 'image';
  await Media.create({ url: file.path, type });
  req.flash('success', 'Media uploaded!');
  res.redirect('/admin/gallery/upload');
};

// Delete gallery media
exports.deleteGalleryMedia = async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (media) {
    const publicId = media.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: media.type });
    await media.deleteOne();
  }
  res.redirect('/admin/gallery/upload');
};

// Star/unstar gallery media
exports.toggleStarGalleryMedia = async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (media) {
    media.starred = !media.starred;
    await media.save();
  }
  res.redirect('/admin/gallery/upload');
};

// Render management profiles for admin
exports.renderAdminManagementProfiles = async (req, res) => {
  try {
    const managementProfiles = await ManagementProfile.find({})
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.render("admin/admin_management_profiles.ejs", { managementProfiles });
  } catch (e) {
    req.flash("error", "Error fetching management profiles.");
    res.redirect("/admin");
  }
};

// /admin/dates
exports.renderAdminManagementDates = async (req, res) => {
   try {
    // 📦 Fetch all events from DB, sorted by date (soonest first)
    const events = await Event.find().sort({ date: 1 });

    // 🧭 Render to EJS page
    res.render("admin/admin_management_dates", { events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Server Error: Unable to fetch events");
  }
};



exports.addSampleEventData = async (req, res) => {
  try {
    // Get some existing management profiles for assignments
    const managementProfiles = await ManagementProfile.find().limit(6);
    
    if (managementProfiles.length === 0) {
      req.flash('error', 'Please add some management profiles first to assign to events');
      return res.redirect('/admin/dates');
    }

    // Create sample events matching the Event schema
    const sampleEvents = [
      {
        name: "VH Annual Meet 2025",
        date: new Date('2025-11-10'),
        location: "ITM Campus Auditorium",
        totalVolunteers: 12,
        maleReq: 6,
        femaleReq: 6,
        departmentAssignments: [
          {
            department: "Hospitality",
            assignedVolunteers: managementProfiles.slice(0, 2).map(p => p._id)
          },
          {
            department: "Media",
            assignedVolunteers: managementProfiles.slice(2, 4).map(p => p._id)
          }
        ],
        assignedVolunteers: managementProfiles.slice(0, 4).map(p => p._id),
        status: 'Upcoming'
      },
      {
        name: "Wedding Exhibition",
        date: new Date('2025-11-25'),
        location: "Royal Convention Center",
        totalVolunteers: 8,
        maleReq: 4,
        femaleReq: 4,
        departmentAssignments: [
          {
            department: "Logistics",
            assignedVolunteers: managementProfiles.slice(2, 4).map(p => p._id)
          },
          {
            department: "Show Flow",
            assignedVolunteers: managementProfiles.slice(4, 6).map(p => p._id)
          }
        ],
        assignedVolunteers: managementProfiles.slice(2, 6).map(p => p._id),
        status: 'Upcoming'
      },
      {
        name: "Corporate Event Workshop",
        date: new Date('2025-11-15'),
        location: "Business Hub",
        totalVolunteers: 6,
        maleReq: 3,
        femaleReq: 3,
        departmentAssignments: [
          {
            department: "Production",
            assignedVolunteers: managementProfiles.slice(0, 3).map(p => p._id)
          }
        ],
        assignedVolunteers: managementProfiles.slice(0, 3).map(p => p._id),
        status: 'Upcoming'
      }
    ];

    await Event.insertMany(sampleEvents);
    req.flash('success', '✅ Sample events with department assignments added successfully!');
    res.redirect('/admin/dates');
  } catch (err) {
    console.error('Error adding sample events:', err);
    req.flash('error', 'Failed to add sample events: ' + err.message);
    res.redirect('/admin/dates');
  }
};