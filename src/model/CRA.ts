import { ForbiddenException } from "@nestjs/common";
import { Absence } from "./Absence";
import { Activity } from "./Activity";
import { HolidayAdapter } from "./HolidayAdapter";

export class CRA {

    private _holidays: any[] = [];
    private _holidayAdapter: HolidayAdapter;
    private _absences: Absence[] = [];
    private _activites: Activity[] = [];
    private _month: number;
  private _year: number;

  constructor(month: number, year: number) {
    this._month = month;
    this._year = year;
    this._holidayAdapter = new HolidayAdapter();
  }

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

    public get activites(): Activity[] {
        return this._activites;
    }

    public get absences(): Absence[] {
        return this._absences;
    }


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

    addAbsence(absence: Absence) {
        if(!this.verifyDateNotInCRA(absence.date,absence.matin))
        {
            throw new Error('full day');
        }
        const today=new Date();
        let beforeFiveDays = new Date(); //fel CRA
        beforeFiveDays.setDate(today.getDate()-5);
        
        if ( (absence.date.getMonth()!=today.getMonth() && beforeFiveDays.getMonth() != absence.date.getMonth()))

            throw new ForbiddenException();
            const y=absence.date.getFullYear();
            const m=absence.date.getMonth()+1;
    
    
            if(y!=this._year || m!=this._month)
        throw new Error('not in the same month');
        this._absences.push(absence);
    }



    verifyTotalDays(): boolean {
        
        const totalHolidays = this._holidays.length;
        const totalAbsences = this._absences.length;
        const totalActivities = this._activites.length;
        const totalDaysInCRA = totalHolidays + totalAbsences + totalActivities;

        const totalBusinessDays = this.calculateBusinessDays(this._year, this._month);

        return totalDaysInCRA === totalBusinessDays;
    }

    public get holidays():any[]{
        return this._holidays;
    }



     verifyDateNotInCRA(date: Date, periode:boolean): boolean {

        const formattedDate = this.formatDate(date); 

        const hasActivity = this._activites.filter(activity => this.formatDate(activity.date) === formattedDate);
  
        const hasAbsence = this._absences.filter(absence => this.formatDate(absence.date) === formattedDate);

        const hasHoliday = this._holidays.filter(holiday => this.formatDate(holiday.date) === formattedDate);
      
        const num=hasActivity.length + hasAbsence.length;
        if (hasHoliday.length>0)
        {
            return false;
        }
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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      

}