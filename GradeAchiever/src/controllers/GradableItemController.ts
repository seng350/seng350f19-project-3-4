<<<<<<< HEAD
import { GradableItemModel } from "../models/GradableItemModel";
=======
import { GradableItemModel} from "../models/GradableItemModel";
import { CourseModel }      from "../models/CourseModel";
import { Algorithm }        from "../algorithm/Algorithm"
>>>>>>> 03756b8... Just need someone who understands how the models work

export class GradableItemController {
    private gradableItemModel = new GradableItemModel();

    constructor() {
    }

    /*Gets gradable item details by  */
    public async RequestGradableItem(gradableItemID: number) {
        return this.gradableItemModel.GetGradableItemDetails(gradableItemID)
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }

    /*Creates gradable item*/
    public async CreateItem(gradableItem: IGradableItem) {
        return this.gradableItemModel.CreateItem(gradableItem);
            /*
        .catch ((error)=> {
            console.log(error);
            return [];
        })*/
    }

    /*
    This one... currently it goes and just sets the field to the new value, probably needs to grab the current value and sum it and then putit in.
    there's also the function below which takes in two integer values...
    */
    public async EditStudyTime(id: number, hours: number) {
        return this.gradableItemModel.AddStudyTime(id, hours)
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }

    public async EditDueDate(id: number, dueDate: Date) {
        return this.gradableItemModel.EditDueDate(id, dueDate.toString())
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }
<<<<<<< HEAD

    public async EditItemGrade(id: number, grade: number) {
        return this.gradableItemModel.EditGradableItemGrade(id, grade)
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }
    public async EditGradableItemWeight(id: number, weight: number) {
        return this.gradableItemModel.EditGradableItemWeight(id, weight)
        .catch((error) => {
            console.log(error);
            return [];
        });
    }
    public async EditItemName(id: number, name: string) {
        return this.gradableItemModel.EditGradableItemName(id, name)
        .catch ((error) => {
            console.log(error);
            return [];
        });
=======
    public async EditGradableItem(id: number, name: string, duedate: Date, hours: number, grade: number) {
        const gradableItemModel = new GradableItemModel();
        try {
            await gradableItemModel.AddStudyTime(Number(id), Number(hours));
            await gradableItemModel.EditDueDate(Number(id), duedate.toString());
            await gradableItemModel.EditGradableItemGrade(Number(id), Number(grade));
            await gradableItemModel.EditGradableItemName(Number(id), name);
        } catch (error) {
            return false;
        }
        if (grade) {
          let gradableItem = gradableItemModel.GetGradableItemDetails(id);
          const courseID: any = gradableItem.CourseID;
          const hoursRecommended = gradableItem.RecommendedTime;
          const hoursSpent = gradableItem.StudiedTime;
          const courseModel = new CourseModel();
          const gradeGoalCourse = courseModel.GetCourseDetails( courseID );
          const gradeGoal = gradeGoalCourse.GradeGoal;
          const algorithm = new Algorithm();
          const itemRatio = algorithm.item_completed_calculation(gradeGoal, hoursSpent, hoursRecommended, grade);

        try {
          await gradableItemModel.AddGItemAccuracy(Number(id), Number(itemRatio));
        } catch (error) {
            return false;
        }
        const gradableItems = gradeGoalCourse.GradableItems;
        let i = 0;
        let itemRatios = [];
        let percentageWorth = [];
        let percentageAchieved = [];
        for (let val of gradableItems) {
          if (val.CurrentGrade!= 0) {
            itemRatios[i] = val.GItemAccuracy;
            percentageWorth[i] = val.Weight;
            percentageAchieved[i] = val.CurrentGrade;
            i++;
          }
        }
        const courseCalResults = algorithm.course_calculation(itemRatios, percentageWorth, percentageAchieved, gradeGoal)
        const courseRatio = courseCalResults[0];
        const percentageDone = courseCalResults[1];
        const newCourseGoal = courseCalResults[2];
        const courseGrade = courseCalResults[3];
        try {
          await courseModel.EditCurrentGrade(Number(courseID), Number( courseGrade ));
          await courseModel.EditGradeNeeded(Number(courseID), Number( newCourseGoal ));
          await courseModel.EditPercentageDone(Number(courseID), Number( percentageDone ));
          await courseModel.EditCourseRatio(Number(courseID), Number( courseRatio ));
        }
        catch (error) {
            return false;
        }
        i = 0;
        const difficulty = gradeGoalCourse.PerceivedDifficulty;
        let weight = 0;
        let itemHours = 0;
        let itemID = 0;
        for (let val of gradableItems) {
          weight = val.Weight;
          if (weight>0) {
            itemHours = algorithm.new_item_calculation(courseRatio, percentageDone, difficulty, newCourseGoal, weight);
            itemID = val.GradableItemID;
            try {
              await val.EditRecommendedTime(Number(itemID), Number(itemHours));
            }
            catch (error) {
                return false;
            }
          }
        }
      }
        return true;
>>>>>>> 03756b8... Just need someone who understands how the models work
    }

    // public async EditGradableItem(id: number, name: string, duedate: Date, hours: number, grade: number) {
    //     try {
    //         await this.gradableItemModel.AddStudyTime(Number(id), Number(hours));
    //         await this.gradableItemModel.EditDueDate(Number(id), duedate.toString());
    //         await this.gradableItemModel.EditGradableItemGrade(Number(id), Number(grade));
    //         await this.gradableItemModel.EditGradableItemName(Number(id), name);
    //         return true;
    //     } catch (error) {
    //         return false;
    //     }

    // }
    /* Edits gradable item's name*/
    public async editGradableItemName(gradableItemID: number, newName: string) {
        return this.gradableItemModel.EditGradableItemName(Number(gradableItemID), String(newName))
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }

    /* Adds study time to a gradable item*/
    public async LogStudyTime(gradableItemID: number, prevtime: number, newtime: number) {
        const totalTime: number = Number(prevtime) + Number(newtime);
        return this.gradableItemModel.AddStudyTime(Number(gradableItemID), totalTime)
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }

    public async deleteGradableItem(gradableItemID: number) {
        return this.gradableItemModel.DeleteGradableItem(gradableItemID)
        .catch ((error) => {
            console.log(error);
            return [];
        });
    }

}
