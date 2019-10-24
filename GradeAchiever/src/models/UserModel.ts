import {NextFunction, Request, Response} from "express";
import DbClient = require("../DbClient");
import { BaseModel } from "./BaseModel";
import { CourseModel } from "./CourseModel";
export class UserModel extends BaseModel {
    private readonly userID: number;
    /* User Model Fields:
    	○ StudentID (auto-generated, auto-increment, int)
		○ Email (string, unique)
		○ StudentName (string, unique?)
		○ NotificationLevel
		○ AlgorithmAccuracy (float: 0.5f - 2f)
		○ Courses[]
        IsAdmin (bool)
     */
    constructor(userID: number) {
        // Table name
        super("User");
        // We can test here the id of the user submitting the request - if it's an admin user we can allow for admin actions

        this.userID = userID;
    }

    public SetAlgorithmAccuracy(algAccuracy: number) {

    }
    public SetNotificationLevel(notificationLevel: number) {

    }
    public SetEmail(email: string) {

    }
    public AddCourse(course: CourseModel) {

    }
    public RemoveCourse(courseName: string) {
        // The course should be uniquely identifiable by the user id and course name
    }
    public async GetUserDetails(req: Request, res: Response, next: NextFunction, id: number): Promise<any> {
        return await DbClient.connect()
        .then((db) => {
            console.log("Getting user details from table User");
            return db!.collection(this.tableName).find({StudentID: id}).toArray();

        })
        .catch((err) => {
            console.log("Returning no user details: ");
            console.log(err.message);

            return [];
        });
    }
    public GetAlgorithmAccuracy() {

    }
    public GetCourses() {

    }

}
