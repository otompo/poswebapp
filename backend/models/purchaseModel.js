import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const purchaseSchema = new Schema(
  {
    products: {
      type: Array,
      require: true,
    },
    purchaseTime: {
      type: Date,
      default: Date.now,
      require: true,
    },
    invoiceID: {
      type: String,
      unique: true,
      index: true,
    },
    grandQuantity: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Purchase
  ? mongoose.models.Purchase
  : mongoose.model('Purchase', purchaseSchema);
