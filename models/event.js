const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    totalVolunteers: {
      type: Number,
      default: 0,
    },
    maleReq: {
      type: Number,
      default: 0,
    },
    femaleReq: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },

    // ✅ Department-wise volunteer assignments
    departmentAssignments: [
      {
        department: {
          type: String, // e.g. "Hospitality", "Media", etc.
          trim: true,
        },
        assignedVolunteers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ManagementProfile', // volunteer model reference
          },
        ],
      },
    ],

    // ✅ Event status
status: {
  type: String,
  enum: ['Pending', 'Ongoing', 'Completed', 'Upcoming'], // ✅ added Upcoming
  default: 'Pending'
}


  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
