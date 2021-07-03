import express, { Application } from "express";
import { MockedObject, mocked } from "ts-jest/dist/utils/testing";
import supertest from "supertest";

import MenuRoute from "./MenuRoute";
import MenuController from "../controllers/MenuController";

jest.mock("../controllers/MenuController");

describe("MenuRoute", () => {
  let app: Application;
  let request: supertest.SuperTest<supertest.Test>;
  let MenuItemControllerMock: MockedObject<typeof MenuController>;
  const expectedResponse = expect.anything();

  beforeEach(() => {
    MenuItemControllerMock = mocked(MenuController);
    MenuItemControllerMock.getMenuItems.mockImplementation(async (_, res) => {
      return res.json({});
    });

    MenuItemControllerMock.addMenuItem.mockImplementation(async (_, res) => {
      return res.json({});
    });

    app = express();
    app.use(express.json());
    app.use("/", MenuRoute.getRouter());
    request = supertest(app);
  });

  it("should call MenuController.getMenuItems function when GET /", async () => {
    await request.get("/");
    expect(MenuItemControllerMock.getMenuItems).toHaveBeenCalled();
  });

  it("should call addMenuItem when POST /add-item", async () => {
    const body = { name: "Fish", price: 3.0 };
    await request.post("/add-item").send(body);
    expect(MenuItemControllerMock.addMenuItem).toHaveBeenCalledWith(
      expect.objectContaining({ body }),
      expectedResponse
    );
  });
});
