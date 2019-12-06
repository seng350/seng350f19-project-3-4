import { NextFunction, Request, Response} from "express";
import { OverviewController } from "../../controllers/OverviewController";

jest.mock("../../models/UserModel");
jest.mock("../../models/GradableItemModel");
jest.mock("../../models/CourseModel");

describe("Overview Controller Tests", () => {
    let controller: OverviewController;
    const userid = 1;
    beforeEach(() => {
        controller = new OverviewController();
    });

    it("requests a user and their courses and gradable items", async () => {
        controller.RequestUser(userid)
        .then((returnVal: any) => {
            expect(returnVal.length).toEqual(3);
        })
        .catch((error) => error);
    });
});
