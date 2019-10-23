import { NextFunction, Request, Response, Router } from "express";
import {AdminModel} from "../models/AdminModel";
import {CourseModel} from "../models/CourseModel";
import {GradableItemModel} from "../models/GradableItemModel";
import {UserModel} from "../models/UserModel";

export class SessionController {
    constructor() {

    }
    public async RequestUsers(req: Request, res: Response, next: NextFunction) {
        const m = new AdminModel();

        const retval = await m.GetAllUsers(req, res, next);
        return retval;
    }
    public async RequestUser(req: Request, res: Response, next: NextFunction, id: number) {

        const m = new UserModel(id);
        const retVal =  await m.GetUserDetails(req, res, next, id);
        console.log("Retval is ");
        console.log(retVal[0].Courses[0]);
        // Get course names
        const cm = new CourseModel();
        const gm = new GradableItemModel();
        const gradableItems = [];
        const courses = [];
        for (const course of retVal[0].Courses) {
            console.log("Getting course details for courseid " + course);
            const courseDetails = await cm.GetCourseDetails(+course);
            for (const gradableItem of courseDetails[0].GradableItems) {
                gradableItems.push(await gm.GetGradableItemDetails(gradableItem));
            }

            courses.push(courseDetails);

        }
        retVal.push(courses);
        retVal.push(gradableItems);
        return retVal;

    }
}
