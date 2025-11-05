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

    // description
    description: {
      type: String,
      trim: true,
    },

    // ✅ Department-wise assignments
    departmentAssignments: [
      {
        department: {
          type: String, // e.g. "Hospitality", "Logistics", "Media"
        },
        assignedVolunteers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ManagementProfile', // linking to your volunteer profile model
          },
        ],
      },
    ],

    // ✅ All assigned volunteers (flattened list)
    assignedVolunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManagementProfile',
      },
    ],

    // ✅ Status tracking
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
