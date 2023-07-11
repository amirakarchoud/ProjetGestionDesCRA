import { ForbiddenException } from "@nestjs/common";
import { Absence } from "./Absence";
import { Activity } from "./Activity";
import { HolidayAdapter } from "./HolidayAdapter";
import { Collab } from "./Collab";
import { Etat } from "./etat.enum";
import { Holiday } from "./Holiday";

export class CRA {
   
  private _id:number;
    private _holidays: Holiday[] = [];
    private _holidayAdapter: HolidayAdapter;
    private _absences: Absence[] = [];
    private _activites: Activity[] = [];
    private _month: number;
  private _year: number;
  private _collab:Collab;
  private _date:Date;
  private _etat:Etat;

  constructor(id:number,month: number, year: number,collab:Collab,date:Date) {
    this._id=id;
    this._month = month;
    this._year = year;
    this._date=date;
    this._collab=collab;
    this._holidays=[];
    
  }
  public get etat():Etat{
    return this._etat;
  }
  


  checkActivityOrAbsenceExists(date: Date, matin: boolean):boolean {
    const existingActivity = this._activites.find((activity) => this.formatDate(activity.date) === this.formatDate(date) && activity.matin === matin);
    console.log('existingActivity= '+existingActivity);
    if (existingActivity) {
      console.log('found activity');
      return true;
    }

    const existingAbsence = this._absences.find((absence) => this.formatDate(absence.date) === this.formatDate(date) && absence.matin === matin);
    console.log('existingAbsence= '+existingAbsence);
    if (existingAbsence) {
      console.log('found absence');
      
      return true;
    }


    const activities = this._activites.filter((activity) => this.formatDate(activity.date) === this.formatDate(date) );
    const absences = this._absences.filter((absence) => this.formatDate(absence.date) === this.formatDate(date) );
  if (activities.length+absences.length>1)
  {
    return true;
  }
    return false;
   
}



/*
  async fetchHolidays() {
    try {
      const allHolidays = await this._holidayAdapter.getHolidays();
      this._holidays = allHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        const holidayDayOfWeek = holidayDate.getDay();
        return holidayDate.getFullYear() === this._year && holidayDate.getMonth() + 1 === this._month&& // Month is zero-based in JavaScript's Date object
        holidayDayOfWeek !== 0 && // Exclude Sunday (dayOfWeek 0)
        holidayDayOfWeek !== 6 // Exclude Saturday (dayOfWeek 6);
      });
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    }
  }
  */

    calculateBusinessDays(year: number, month: number): number {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        let businessDays = 0;

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends (Saturday and Sunday)
                businessDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return businessDays;
    }

    public get activities(): Activity[] {
        return this._activites;
    }

    public get absences(): Absence[] {
        return this._absences;
    }
    public set absences(abs:Absence[]){
      this._absences=abs;
    }
    public set activities(act:Activity[]){
      this._activites=act;
    }
    public set holidays(holidays:Holiday[]){
      this._holidays=holidays;
    }

    addActivity(activity: Activity) {
      const dateAbs = new Date(activity.date);
      //check if holiday
      this.holidays.forEach(element => {
        if(this.formatDate(element.date)==this.formatDate(activity.date))
        {
          throw Error('it is a holiday :'+element.name);
        }
        
      });

      // Test if the day is already fully occupied or part of a fully occupied period
      if (this.checkActivityOrAbsenceExists(dateAbs, activity.matin)) //cra
      {
          throw new Error('FULL day or period');
      }

      this._activites.push(activity);
  }


/*
    addActivity(activity: Activity) {
        if(!this.verifyDateNotInCRA(activity.date,activity.matin))
        {
            throw new Error('full day');
        }

        //step 3:check if it is either this month or less than 5days after
        const today = new Date();
        let beforeFiveDays = new Date(); //fel CRA
        beforeFiveDays.setDate(today.getDate() - 5);
        
        if ((activity.date.getMonth() != today.getMonth() && beforeFiveDays.getMonth() != activity.date.getMonth()))

        throw new ForbiddenException();

        const y=activity.date.getFullYear();
        const m=activity.date.getMonth()+1;


        if(y!=this._year || m!=this._month)
        throw new Error('not in the same month');
        this._activites.push(activity);
    }
*/
    addAbsence(absence: Absence) {
      const dateAbs = new Date(absence.date);
      //check if holiday
      this.holidays.forEach(element => {
        if(this.formatDate(element.date)==this.formatDate(dateAbs))
        {
          throw Error('it is a holiday :'+element.name);
        }
        
      });

      // Test if the day is already fully occupied or part of a fully occupied period
      if (this.checkActivityOrAbsenceExists(dateAbs, absence.matin)) //cra
      {
          throw new Error('FULL day or period');
      }
/*
        //to add later
        const today=new Date();
        let beforeFiveDays = new Date(); //fel CRA
        beforeFiveDays.setDate(today.getDate()-5);
        const absDate=new Date(absence.date);
        
        if ( (absDate.getMonth()!=today.getMonth() && beforeFiveDays.getMonth() != absDate.getMonth()))

            {throw new ForbiddenException();}
            */
        this._absences.push(absence);
        
    }

    calculateEmptyDays():number{
      const totalHolidays = this._holidays.length;
      const totalAbsences = this._absences.length;
      const totalActivities = this._activites.length;
      const totalBusinessDays = this.calculateBusinessDays(this._year, this._month);
      return totalBusinessDays-(totalHolidays + (totalAbsences + totalActivities)*0.5);

    }



    verifyTotalDays(): boolean {
      
        if(this.calculateEmptyDays()==0)
        return true;
        return false;
    }

    public get id():number{
      return this._id;
    }

    public get holidays():Holiday[]{
        return this._holidays;
    }

    public get month():number{
      return this._month;
    }
    public get year():number{
      return this._year;
    }

    public get date():Date{
      return this._date;
    }
    public get collab():Collab{
      return this._collab;
    }



     verifyDateNotInCRA(date: Date, periode:boolean): boolean {

        const formattedDate = this.formatDate(new Date(date)); 

        const hasActivity = this._activites.filter(activity => this.formatDate(activity.date) === formattedDate);
  
        const hasAbsence = this._absences.filter(absence => this.formatDate(absence.date) === formattedDate);

       // const hasHoliday = this._holidays.filter(holiday => this.formatDate(holiday.date) === formattedDate);
      
        const num=hasActivity.length + hasAbsence.length;
        
  if (num === 0) {
    return true;
  } else if (num > 1) {
    return false;
  } else {
    const existingItem = hasActivity[0] || hasAbsence[0];
    const existingBoolean = existingItem.matin;

    return existingBoolean !== periode;
  }
      }



       formatDate(date: Date): string {
        //console.log("here format date")
       // console.log("formatdate = "+date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }



      deleteAbsence(date: Date, matin: boolean) {
        this.absences.forEach((abs, index) => {
          if (this.formatDate(abs.date) === this.formatDate(date) && abs.matin === matin) {
            this.absences.splice(index, 1);
          }
        });
      }
      
    
      

}