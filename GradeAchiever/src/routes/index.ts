
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

import {SessionController} from "../controllers/SessionController";

/**
 * / route
 *
 * @class IndexRoute
 */
export class IndexRoute extends BaseRoute {

    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        //log
        console.log("[IndexRoute::create] Creating index route.");
        let path = require('path');
        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
        
        router.get("/stylesheets/style.css", (req: Request, res: Response, next: NextFunction) =>
        {
            console.log("CSS requested")
            res.sendFile(path.join(__dirname + "../../../public/stylesheets/style.css"));
        });

    }

    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * The login page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public index(req: Request, res: Response, next: NextFunction) {
        //The index page should be default be the login page
        //Create a SessionController to get a list of all users
        //Populate page with users from SessionController
        let session = new SessionController();


        //set custom title
        this.title = "Grade Achiever";
        
        session.RequestUsers(req,res,next)
        .then((mess) => {
            console.log(mess);
            //set message
            let options: Object = {
                "users": mess
            };
            return options;
        })
        .catch((err) => {
            console.log(err.message);
        })
        .then((options: any)=>{
            //console.log("I'm doing the thing: "+options);
            //res.send(options);
            //render template
            this.render(req, res, "index", options);
        });
    }
}
