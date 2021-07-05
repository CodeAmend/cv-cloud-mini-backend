import { Request, Response } from "express";
import { mocked } from "ts-jest/utils";

import Controller from "./MenuController";
import { MockedObject } from "ts-jest/dist/utils/testing";
import MenuItemModel, { IMenuItemDocument } from "../models/MenuItemModel";

jest.mock("../models/MenuItemModel");

describe("MenuConroller", () => {
  let request: Request;
  let response: Response;
  let statusFn: jest.Mock;
  let jsonFn: jest.Mock;

  let MenuItemModelMock: MockedObject<typeof MenuItemModel>;

  beforeEach(() => {
    statusFn = jest.fn().mockReturnThis();
    jsonFn = jest.fn().mockReturnThis();
    MenuItemModelMock = mocked(MenuItemModel);

    response = {
      json: jsonFn,
      status: statusFn,
    } as Partial<Response> as Response;

    request = {} as unknown as Request;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getMenuItems", () => {
    it("returns 204 with message for no items", async () => {
      MenuItemModelMock.find.mockResolvedValue([]);
      await Controller.getMenuItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(204);
      expect(jsonFn).toHaveBeenCalledWith([]);
    });

    it("returns 200 with items", async () => {
      const menuItems = [
        { name: "food", price: 3.0 },
      ] as unknown as IMenuItemDocument[];

      MenuItemModelMock.find.mockResolvedValue(menuItems);
      await Controller.getMenuItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(200);
      expect(jsonFn).toHaveBeenCalledWith(menuItems);
    });

    it("returns 500 with server error", async () => {
      MenuItemModelMock.find.mockRejectedValue(new Error("Timed out"));
      await Controller.getMenuItems(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({ message: "Something went wrong" });
    });
  });

  describe("addMenuItem", () => {
    it("returns 400 with missing name", async () => {
      await Controller.addMenuItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(400);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Must submit a name and price",
      });
    });

    it("returns 200 with proper body", async () => {
      request.body = { name: "food", price: 3.0 };
      MenuItemModelMock.create.mockResolvedValue({} as never);
      await Controller.addMenuItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(200);
      expect(jsonFn).toHaveBeenCalledWith({ message: "Success!" });
    });

    it("returns 500 error with server fail", async () => {
      request.body = { name: "food", price: 3.0 };
      MenuItemModelMock.create.mockRejectedValue(
        new Error("server error") as never
      );
      await Controller.addMenuItem(request, response);
      expect(statusFn).toHaveBeenCalledWith(500);
      expect(jsonFn).toHaveBeenCalledWith({
        message: "Something went wrong",
      });
    });
  });
});
