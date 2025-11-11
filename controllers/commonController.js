const Media = require("../models/media");
const ManagementProfile = require("../models/management");
const Event = require("../models/event");
const Booking = require("../models/booking");
const nodemailer = require("nodemailer");

exports.renderHome = async (req, res) => {
  const starredMedia = await Media.find({ starred: true }).sort({ uploadedAt: -1 });
  const managementProfiles = await ManagementProfile.find({ powerhouse: true }).populate('user', 'email').sort({ createdAt: -1 });

 const bestDepartmentsequence = [
  "Show Flow",
  "Shadow",
  "Production",
  "Logistics",
  "Hospitality",
  "F&B",
  "Ritual",
  "Artist Coordination",
  "Overall Management",
  "Client Handling",
  "Decor",
  "Photography"
];


  // Group by department in sequence, sort males first in each group
  let sortedProfiles = [];
  for (const dept of bestDepartmentsequence) {
    const group = managementProfiles.filter(p => p.bestDepartment === dept);

    group.sort((a, b) => {
      if (a.gender === b.gender) return 0;
      if (a.gender === 'Male') return -1;
      return 1;
    });
    sortedProfiles = sortedProfiles.concat(group);
  }

  console.log("Sorted Profiles:", sortedProfiles);

  res.render('home/home.ejs', { starredMedia, managementProfiles: sortedProfiles });
};

exports.renderServices = (req, res) => {
  res.render("service/service.ejs");
};

exports.renderContact = (req, res) => {
  res.render("contact/contact.ejs");
};

exports.handleContact = async (req, res) => {
  const { FirstName, Email, PhoneNumber, TextArea } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.VH_EVENTS_USER,
      pass: process.env.VH_EVENTS_PASS,
    },
  });
  const mailOptions = {
    from: `"VH Events Contact" <${process.env.VH_EVENTS_USER}>`,
    to: process.env.VH_EVENTS_USER,
    subject: `New Contact Form Submission from ${FirstName}`,
    text: `
    sender: ${Email}
    receiver: ${process.env.VH_EVENTS_USER}
    -------------------------------------------------------------
    -------------------------------------------------------------
📩 New Contact Form Message:

👤 Name: ${FirstName}
📧 Email: ${Email}
📞 Phone: ${PhoneNumber}

📝 Query:
${TextArea}
    `,
    replyTo: Email,
  };
  try {
    await transporter.sendMail(mailOptions);
    req.flash("success", "Your message has been sent successfully!");
    res.redirect("/contact");
  } catch (error) {
    console.error("Email sending error:", error);
    req.flash("error", "Error sending email ❗ PLEASE CONTACT US BY 9588626847 OR vh.eventplanner25@gmail.com");
    res.redirect("/contact");
  }
};

exports.renderProfile = async (req, res) => {
  try {
    // Get bookings (might be empty array)
    const bookings = await Booking.find({ user: req.user._id }) || [];

    // Get management profile (might be null)
    const managementProfile = await ManagementProfile.findOne({ user: req.user._id });

    // Prepare empty array first for safety
    let assignedEvents = [];

    // Only query assigned events if managementProfile exists
    if (managementProfile) {
      assignedEvents = await Event.find({
        'departmentAssignments.assignedVolunteers': managementProfile._id
      }).populate({
        path: 'departmentAssignments.assignedVolunteers',
        select: 'fullName'
      });

      // Sort by date safely (ignore undefined dates)
      assignedEvents.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    }

    // Always render page with safe defaults
    res.render("profile/profile.ejs", {
      bookings,
      managementProfile,
      assignedEvents
    });

  } catch (err) {
    console.error("Error rendering profile:", err);
    res.status(500).send("Server error while rendering profile.");
  }
};
  

exports.renderGallery = async (req, res) => {
  const media = await Media.find().sort({ uploadedAt: -1 });
  res.render('gallery/gallery.ejs', { media });
};

exports.renderAgreement = (req, res) => {
  res.render("agreement/agreement.ejs");
};

