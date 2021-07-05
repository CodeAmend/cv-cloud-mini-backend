import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";

import CartController from "./cartController";
import { MockedObject } from "ts-jest/dist/utils/testing";
import MenuItemModel, { IMenuItemDocument } from "../models/MenuItemModel";
import CartItemModel, { ICartItemDocument } from "../models/CartModel";

jest.mock("../models/MenuItemModel");
jest.mock("../models/CartModel");

describe("MenuConroller", () => {
  let request: Request;
  let response: Response;
  let statusFn: jest.Mock;
  let jsonFn: jest.Mock;

  let MenuItemModelMock: MockedObject<typeof MenuItemModel>;
  let CartItemModelMock: MockedObject<typeof CartItemModel>;

  beforeEach(() => {
    statusFn = jest.fn().mockReturnThis();
    jsonFn = jest.fn().mockReturnThis();
    MenuItemModelMock = mocked(MenuItemModel);
    CartItemModelMock = mocked(CartItemModel);

    response = {
      json: jsonFn,
      status: statusFn,
    } as Partial<Response> as Response;

    request = {} as unknown as Request;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getCartItems", () => {
    it("returns 204 with message for no items", async () => {
      CartItemModelMock.find.mockResolvedValue([]);
      await CartController.getCartItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
      expect(jsonFn).toHaveBeenCalledWith({ message: "No cart items" });
    });

    it("returns 200 with items", async () => {
      const cartItems = [
        { name: "food", price: 5.0, quantity: 3 },
      ] as unknown as ICartItemDocument[];

      CartItemModelMock.find.mockResolvedValue(cartItems);
      await CartController.getCartItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(200);
    });

    it("returns 500 with server error", async () => {
      CartItemModelMock.find.mockRejectedValue(new Error("Timed out"));
      await CartController.getCartItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe("addCartItem", () => {
    it("returns 400 with missing name", async () => {
      await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Must submit a name",
      });
    });

    it("returns 204 with no items found in menu", async () => {
      request.body = { name: "cheese" };
      MenuItemModelMock.findOne.mockResolvedValue(null);
      await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
      expect(jsonFn).toHaveBeenCalledWith({ message: "No items found!" });
    });

    it("returns 204 with items found in menu", async () => {
      request.body = { name: "cheese" };
      MenuItemModelMock.findOne.mockResolvedValue({
        name: "cheese",
      } as IMenuItemDocument);
      // TODO: how can I mock this?? needed to use any to pass this
      CartItemModelMock.findOneAndUpdate.mockReturnValue({
        exec: () => true,
      } as any);
      await CartController.addCartItem(request, response);
      // await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
    });

    it("returns 500 error with server fail", async () => {
      request.body = { name: "cheese" };
      MenuItemModelMock.findOne.mockRejectedValue(new Error("Timed out"));
      await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("removeCartItem", () => {
    it("returns 400 with missing name", async () => {
      await CartController.removeCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Must submit a name",
      });
    });

    it("returns 204 with no items found in menu", async () => {
      request.body = { name: "cheese" };
      CartItemModelMock.findOne.mockResolvedValue(null);
      await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
      expect(jsonFn).toHaveBeenCalledWith({ message: "No items found!" });
    });

    it("calls delete with 204 status with quantity <= 1 ", async () => {
      request.body = { name: "cheese" };
      CartItemModelMock.findOne.mockResolvedValue({
        name: "cheese",
        quantity: 1,
      } as ICartItemDocument);
      CartItemModelMock.findOneAndDelete.mockReturnValue({
        exec: () => true,
      } as any);
      await CartController.removeCartItem(request, response);
      // await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
    });

    it("calls update with 204 status with quantity > 1 ", async () => {
      request.body = { name: "cheese" };
      CartItemModelMock.findOne.mockResolvedValue({
        name: "cheese",
        quantity: 2,
      } as ICartItemDocument);
      CartItemModelMock.findOneAndUpdate.mockReturnValue({
        exec: () => true,
      } as any);
      await CartController.removeCartItem(request, response);
      // await CartController.addCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
    });

    it("returns 500 error with server fail", async () => {
      request.body = { name: "cheese" };
      CartItemModelMock.findOne.mockRejectedValue(new Error("Timed out"));
      await CartController.removeCartItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });

  describe("clearCartItems", () => {
    it("returns 204 and calls delete", async () => {
      CartItemModelMock.remove.mockImplementation();
      await CartController.clearCartItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Success!",
      });
    });

    it("returns 500 error with server fail", async () => {
      CartItemModelMock.remove.mockRejectedValue(new Error("Timed out"));
      await CartController.clearCartItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
});
