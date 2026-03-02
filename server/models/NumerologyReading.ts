import mongoose from 'mongoose';

const numerologyReadingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  destinyNumber: {
    type: Number,
    required: true
  },
  soulUrgeNumber: {
    type: Number,
    required: true
  },
  personalityNumber: {
    type: Number,
    required: true
  },
  lifePathNumber: {
    type: Number,
    required: true
  },
  birthdayNumber: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const NumerologyReading = mongoose.model('NumerologyReading', numerologyReadingSchema);