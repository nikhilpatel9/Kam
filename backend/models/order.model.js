import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    leadId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    calls: {
      type: Array,
      default: [],
    },
    numberOfCalls: {
      type: Number,
      default: 0,
    },
    callHistory: {
        type: Map,
        of: [Date],
        default: new Map(),
      },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;