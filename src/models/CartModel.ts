import { Document, Model, Schema, model } from "mongoose";

interface ICartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ICartItemDocument extends ICartItem, Document {}

interface ICartItemModel extends Model<ICartItemDocument> {}

const CartItemSchema = new Schema<ICartItemDocument, ICartItemModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default model<ICartItemDocument, ICartItemModel>(
  "CartItem",
  CartItemSchema,
  "cartItems"
);
