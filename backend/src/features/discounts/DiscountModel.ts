import mongoose from "mongoose";

export interface IDiscount {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  scope: "all" | "categories" | "products";
  targetModel: "Category" | "Product";
  targetIds: mongoose.Types.ObjectId[];
  discounts: {
    rubles: number;
    euros: number;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const discountSchema = new mongoose.Schema<IDiscount>(
  {
    name: {
      type: String,
      required: [true, "Discount name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    scope: {
      type: String,
      enum: ["all", "categories", "products"],
      required: [true, "Discount scope is required"],
    },
    targetModel: {
      type: String,
      enum: ["Category", "Product"],
      required: function (this: IDiscount) {
        return this.scope !== "all";
      },
    },
    targetIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: function (this: IDiscount) {
        return this.scope !== "all";
      },
      default: [],
    },
    discounts: {
      rubles: {
        type: Number,
        required: [true, "Discount percentage in rubles is required"],
        min: 0,
        max: 100,
      },
      euros: {
        type: Number,
        required: [true, "Discount percentage in euros is required"],
        min: 0,
        max: 100,
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
discountSchema.index({ name: 1 });
discountSchema.index({ isActive: 1 });
discountSchema.index({ startDate: 1, endDate: 1 });
discountSchema.index({ scope: 1, targetModel: 1 });
discountSchema.index({ targetIds: 1 });

const Discount = mongoose.model<IDiscount>("Discount", discountSchema);

export default Discount;
