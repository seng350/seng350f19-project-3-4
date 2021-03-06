
import { NextFunction, Request, Response, Router } from "express";
import {CourseController} from "../controllers/CourseController";
import {OverviewController} from "../controllers/OverviewController";
import {SessionController} from "../controllers/SessionController";
import {PDFParser} from "../Modules/PDFParser";
import { BaseRoute } from "./route";
const fileupload = require("express-fileupload");
const bodyParser =  require("body-parser");

export class SessionRoute extends BaseRoute {
    public static create(router: Router) {

        router.use(fileupload());
        router.use(bodyParser.urlencoded({extended: true}));
        console.log("[SessionRoute::create] Creating user homepage route.");
        router.post("/overview", (req: Request, res: Response, next: NextFunction) => {
            new SessionRoute().Session(req, res, next, Number(req.body.user));
        });

        router.post("/newUser", (req: Request, res: Response, next: NextFunction) => {
            const b = req as any;
            console.log(b.body.messages);
            new SessionRoute().createUser(req, res,  req.body.name, req.body.email);
        });

        router.post("/pdfparse", (req: Request, res: Response, next: NextFunction) => {
            const b = req as any;
            new SessionRoute().ParsePDF(req, res, next, b);
        });
        router.post("/createcourse", (req: Request, res: Response, next: NextFunction) => {
            new SessionRoute().createCourse(req, res, next);
        });

    }

    public async createCourse(req: Request, res: Response, next: NextFunction) {
        const course = req.body;
        // console.log(course.GradableItems);
        const courseController = new CourseController();
        courseController.createCourse(course)
        .then((details) => {
            // RIGHT HERE THIS SHOULD APPEND VALUE TO USER OBJECT
            // console.log(course.studentId);
            // this.Session(req, res, next, Number(course.studentId));
            res.redirect(307, "/overview");
        })
        .catch((error) => {
            console.log(error);
            this.render(req, res, "error", error);
        });
    }

    public async ParsePDF(req: Request, res: Response, next: NextFunction, b: any) {
        const parser = new PDFParser();
        // console.log(b.files.file);
        let courseDetails: any = {};
        try {
            courseDetails = await parser.parse(b.files.file, "heat");

        } catch (e) {
            // console.log("No file?");
            courseDetails.GradableItems = {};
        }
        const options: object = {
            courseDetails,
            studentID : b.body.studentid,
        };
        this.render(req, res, "createcourse", options);
    }

    public async Session(req: Request, res: Response, next: NextFunction, id: number) {

        const session = new SessionController();
        // First, verify if user is valid (currently always true)
        if (!await session.VerifyUser(req, res, next, id)) {
            this.render(req, res, "error");
            return;
        }
        // Then, populate the overview page
        const overviewCtrl = new OverviewController();
        this.title = "Home";
        overviewCtrl.RequestUser(id)
        .then((details) => {
            /*Details is an array of length 3 with the following fields -
                details[0] = studentDetails (Name, id, email, list of courses etc
                details[1] = courseDetails (CourseName,CourseID,list of gradable items etc)
                details[1] = gradableItemDetails (CourseName,CourseID,list of gradable items etc);
            */
            console.log(details[2]);
            const options: object = {
                studentDetails: details[0],
                courseDetails: details[1],
                gradableItemDetails: details[2],
                thisID: id,
            };
            this.render(req, res, "userhome", options);
        })
        .catch((error) => {
            console.log(error);
            this.render(req, res, "error", error);
        });
    }

    /**
     * Signs up a new user by creating them in db and then loads their homepage
     */
    public async createUser(req: Request, res: Response, name: string, email: string) {
        const sessionCtrl = new SessionController();
        this.title = "CreateUser";
        sessionCtrl.CreateUser(String(name), String(email))
        .then((resp) => {
            // If adding a new user failed, return to login page
            if (resp.insertedCount === 0) {
                res.redirect("/");
            } else {
                // Loads overview page for new user
                this.Session(req, res, {} as NextFunction, resp.ops[0].StudentID);
            }
        })
        .catch((error) => {
            console.log(error);
            this.render(req, res, "error", error);
        });

    }

}
