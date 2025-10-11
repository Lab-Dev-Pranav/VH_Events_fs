const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const ManagementProfile = require("./models/management"); 
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const { isLoggedIn, isBookingOwner, isAdmin } = require("./MW");
const newsletterRouter = require("./models/newsletter");
const Booking = require("./models/booking");
const Media = require('./models/media');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 







cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'vh_gallery',
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
  }),
});
const cloudinaryUpload = multer({ storage });

const app = express();
let port = 3030;


app.use(methodOverride("_method"));

// DB URL & CONECTION
const dbUrl = process.env.DB_URL;
main()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
//---------------------


app.set("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOption = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
};
app.use(
  session({
    secret: "yourSecret",
    resave: false,
    saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbUrl }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } //COOKIE VALID FOR 7 DAYS for user login session
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});




// -----------------Commen--ROUTES--------------------------  -------
//get to render home page Start #base page
const commonController = require('./controllers/commonController');

app.get('/', commonController.renderHome);
//get to render home page End

app.get('/services', commonController.renderServices);
//get to render services page End

const bookingController = require('./controllers/bookingController');
// Booking routes
app.get('/booking', isLoggedIn, bookingController.renderBookingPage);
//get to render booking page End


app.get('/contact', commonController.renderContact);
//get to render contact page End


app.post('/contact', commonController.handleContact);





const managementController = require('./controllers/managementController');
// Profile
app.get('/profile', isLoggedIn, commonController.renderProfile);
//get to render PROFILE page End

app.get('/gallery', commonController.renderGallery);

app.get('/management', isLoggedIn, managementController.renderForm);
//get to render management form page End

const newsletterController = require('./controllers/newsletterController');

// Newsletter
app.post('/newsletter', newsletterController.subscribe);

app.delete('/newsletter/:id', newsletterController.unsubscribe);


const authController = require('./controllers/authController');

// Auth
app.get('/login', authController.renderLogin);
app.post('/register', authController.register);
app.post('/login', ...authController.login);
app.get('/logout', authController.logout);




// Booking create/delete
app.post('/booking', isLoggedIn, bookingController.createBooking);

app.delete('/booking/:id', isLoggedIn, isBookingOwner, bookingController.deleteBooking);


// -------------------ADMIN---------------------------------


app.get("/admin", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin/admin.ejs");
});

app.get("/admin/bookings", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .sort({ createdAt: -1 }); 
    res.render("admin/admin_booking.ejs", { bookings });
  } catch (e) {
    req.flash("error", "Error fetching bookings.");
    res.redirect("/admin");
  }
});
const adminController = require('./controllers/adminController');

app.get('/admin', isLoggedIn, isAdmin, adminController.renderAdminDashboard);
app.get('/admin/bookings', isLoggedIn, isAdmin, adminController.renderAdminBookings);
app.post('/admin/bookings/:id/note', isLoggedIn, isAdmin, adminController.updateAdminNote);

app.get('/admin/newsletters', isLoggedIn, isAdmin, adminController.renderAdminNewsletters);
app.post('/admin/newsletters', isLoggedIn, isAdmin, adminController.sendNewsletterEmails);


app.get('/admin/gallery/upload', isLoggedIn, isAdmin, adminController.renderGalleryUpload);
app.post('/admin/gallery/upload', isLoggedIn, isAdmin, cloudinaryUpload.single('media'), adminController.handleGalleryUpload);
app.post('/admin/gallery/delete/:id', isLoggedIn, isAdmin, adminController.deleteGalleryMedia);
app.post('/admin/gallery/star/:id', isLoggedIn, isAdmin, adminController.toggleStarGalleryMedia);
app.get('/admin/managementprofiles', isLoggedIn, isAdmin, adminController.renderAdminManagementProfiles);

// -------------------MANAGEMENT---------------------------------

app.get("/management", isLoggedIn, async (req, res) => {
  try {
    res.render("management/management.ejs");
  } catch (e) {
    req.flash("error", "Error fetching management form.");
    res.redirect("/");
  }
});

app.post('/management', isLoggedIn, upload.single('profilePicture'), managementController.createProfile);
app.delete('/management/:id', isLoggedIn, managementController.deleteProfile);
app.post('/management/:id/powerhouse', isLoggedIn, isAdmin, managementController.updatePowerhouse);
app.get('/management/:id/edit', isLoggedIn, managementController.renderEditForm);
app.put('/management/:id', isLoggedIn, upload.single('profilePicture'), managementController.updateProfile);

app.get("/agreement", (req, res) => {
  res.render("agreement/agreement.ejs");
});






app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------

