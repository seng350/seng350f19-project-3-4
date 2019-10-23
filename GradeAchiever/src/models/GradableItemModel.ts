import DbClient = require("../DbClient");
import { BaseModel } from "./BaseModel";
export class GradableItemModel extends BaseModel {

    /*
        Gradable Item Model Fields:
        		○ GradableItemID (auto-generated,auto-increment,int)
                ○ CourseID
                ○ GradableItemName (string)
                ○ DueDate (Date)
                ○ Weight (float? Int?) (Constraint: Item weights must add to 100)
                GItemAlgorithmAccuracy (float?)
     */
    constructor() {
        super("GradableItem");
    }
    public SetDate(gradableItemID: number, date: string) {
        // ensure this is a valid date first
    }
    public SetWeight(gradableItemID: number, weight: number) {
        // ensure that sum of all weights for a course is 100
    }
    public SetAlgAccuracy(gradableItemID: number, accuracy: number) {
        // Ensure between 0.5-2
    }
    public async GetGradableItemDetails(gradableItemID: number) {
        // Returns gradableItem name, id, course id, due date, weight
        return await DbClient.connect()
        .then((db) => {
            return db!.collection(this.tableName).find({GradableItemID: gradableItemID}).toArray();
        })
        .catch((err) => {
            console.log(err.message);
            return [];
        });
    }
    public GetAlgorithmAccuracy(gradableItemID: number) {

    }

}
