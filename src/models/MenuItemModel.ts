import { Document, Model, Schema, model } from "mongoose";

interface IMenuItem {
  name: string;
  price: number;
}

export interface IMenuItemDocument extends IMenuItem, Document {}

interface IMenuItemModel extends Model<IMenuItemDocument> {}

const MenuItemSchema = new Schema<IMenuItemDocument, IMenuItemModel>(
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
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default model<IMenuItemDocument, IMenuItemModel>(
  "MenuItem",
  MenuItemSchema,
  "menuitems"
);
