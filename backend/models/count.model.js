
import mongoose from 'mongoose';

const CountSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['leads', 'users', 'orders', 'messages', 'notifications'],
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Count', CountSchema);
