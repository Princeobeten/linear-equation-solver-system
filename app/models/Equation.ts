import mongoose, { Schema, models, model } from 'mongoose';

const EquationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  equations: {
    type: [String],
    required: true,
  },
  method: {
    type: String,
    required: true,
    enum: ['Gaussian Elimination', 'Matrix Inversion'],
  },
  solution: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use existing model if available, otherwise create a new one
const Equation = models.Equation || model('Equation', EquationSchema);

export default Equation;
