import mongoose, { Schema, Document } from "mongoose";

export interface IDiscountPrice {
  currency: "RUB" | "EUR";
  percentage: number;
}

export interface IDiscountBasicInfo {
  percentage: number;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
}

export interface IDiscount extends Document {
  name: string;
  description: string;
  startDate: Date;
  startTime?: string;
  endDate: Date;
  endTime?: string;
  isActive: boolean;
  discountPrices: IDiscountPrice[];
  targetType: "all" | "categories" | "products";
  categories?: mongoose.Types.ObjectId[];
  products?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  getFullDateTime(date: Date, time?: string): Date;
  isValidForProduct(productId: mongoose.Types.ObjectId): boolean;
  isValidForCategory(categoryId: mongoose.Types.ObjectId): boolean;
}

const discountPriceSchema = new Schema<IDiscountPrice>({
  currency: {
    type: String,
    required: true,
    enum: ["RUB", "EUR"],
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const discountSchema = new Schema<IDiscount>(
  {
    name: {
      type: String,
      required: [true, "Discount name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },
    startTime: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Start time must be in HH:mm format",
      },
      default: "00:00",
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      index: true,
    },
    endTime: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "End time must be in HH:mm format",
      },
      default: "23:59",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    discountPrices: {
      type: [discountPriceSchema],
      required: [true, "At least one discount price is required"],
      validate: {
        validator: function (prices: IDiscountPrice[]) {
          const currencies = new Set(prices.map((p) => p.currency));
          if (currencies.size !== prices.length) {
            return false;
          }
          return prices.length > 0;
        },
        message: "Each currency must have exactly one discount price",
      },
    },
    targetType: {
      type: String,
      required: [true, "Target type is required"],
      enum: ["all", "categories", "products"],
      index: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
discountSchema.index({ products: 1, isActive: 1 });
discountSchema.index({ categories: 1, isActive: 1 });

discountSchema.pre("save", function (next) {
  const startDateTime = this.getFullDateTime(this.startDate, this.startTime);
  const endDateTime = this.getFullDateTime(this.endDate, this.endTime);

  if (startDateTime >= endDateTime) {
    next(new Error("End date/time must be after start date/time"));
  }
  next();
});

discountSchema.pre("save", function (next) {
  if (
    this.targetType === "categories" &&
    (!this.categories || this.categories.length === 0)
  ) {
    next(
      new Error("Categories must be specified when target type is categories")
    );
  }
  if (
    this.targetType === "products" &&
    (!this.products || this.products.length === 0)
  ) {
    next(new Error("Products must be specified when target type is products"));
  }
  next();
});

discountSchema.methods.getFullDateTime = function (
  date: Date,
  time: string = "00:00"
): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const fullDate = new Date(date);
  fullDate.setHours(hours, minutes, 0, 0);
  return fullDate;
};

discountSchema.methods.isValidForProduct = function (
  productId: mongoose.Types.ObjectId
): boolean {
  if (!this.isActive) return false;

  const now = new Date();
  const startDateTime = this.getFullDateTime(this.startDate, this.startTime);
  const endDateTime = this.getFullDateTime(this.endDate, this.endTime);

  if (now < startDateTime || now > endDateTime) return false;

  return (
    this.targetType === "all" ||
    (this.targetType === "products" && this.products.includes(productId))
  );
};

discountSchema.methods.isValidForCategory = function (
  categoryId: mongoose.Types.ObjectId
): boolean {
  if (!this.isActive) return false;

  const now = new Date();
  const startDateTime = this.getFullDateTime(this.startDate, this.startTime);
  const endDateTime = this.getFullDateTime(this.endDate, this.endTime);

  if (now < startDateTime || now > endDateTime) return false;

  return (
    this.targetType === "all" ||
    (this.targetType === "categories" && this.categories.includes(categoryId))
  );
};

const Discount = mongoose.model<IDiscount>("Discount", discountSchema);

export default Discount;
