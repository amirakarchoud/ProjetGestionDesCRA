"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRA = void 0;
const common_1 = require("@nestjs/common");
const etat_enum_1 = require("./etat.enum");
class CRA {
    constructor(id, month, year, collab, date, etat) {
        this._holidays = [];
        this._absences = [];
        this._activites = [];
        this._etat = etat_enum_1.Etat.unsubmitted;
        this._id = id;
        this._month = month;
        this._year = year;
        this._date = date;
        this._collab = collab;
        this._holidays = [];
        this._etat = etat;
    }
    get etat() {
        return this._etat;
    }
    set etat(etat) {
        this._etat = etat;
    }
    checkActivityOrAbsenceExists(date, matin) {
        const existingActivity = this._activites.find((activity) => this.formatDate(activity.date) === this.formatDate(date) && activity.matin === matin);
        console.log('existingActivity= ' + existingActivity);
        if (existingActivity) {
            console.log('found activity');
            return true;
        }
        const existingAbsence = this._absences.find((absence) => this.formatDate(absence.date) === this.formatDate(date) && absence.matin === matin);
        console.log('existingAbsence= ' + existingAbsence);
        if (existingAbsence) {
            console.log('found absence');
            return true;
        }
        const activities = this._activites.filter((activity) => this.formatDate(activity.date) === this.formatDate(date));
        const absences = this._absences.filter((absence) => this.formatDate(absence.date) === this.formatDate(date));
        if (activities.length + absences.length > 1) {
            return true;
        }
        return false;
    }
    calculateBusinessDays(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        let businessDays = 0;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return businessDays;
    }
    get activities() {
        return this._activites;
    }
    get absences() {
        return this._absences;
    }
    set absences(abs) {
        this._absences = abs;
    }
    set activities(act) {
        this._activites = act;
    }
    set holidays(holidays) {
        this._holidays = holidays;
    }
    addActivity(activity) {
        const dateAct = new Date(activity.date);
        this.holidays.forEach(element => {
            if (this.formatDate(element.date) == this.formatDate(activity.date)) {
                throw Error('it is a holiday :' + element.name);
            }
        });
        if (this.checkActivityOrAbsenceExists(dateAct, activity.matin)) {
            throw new Error('FULL day or period');
        }
        const today = new Date();
        let beforeFiveDays = new Date();
        beforeFiveDays.setDate(today.getDate() - 5);
        if ((dateAct.getMonth() != today.getMonth() && beforeFiveDays.getMonth() != dateAct.getMonth())) {
            throw new common_1.ForbiddenException();
        }
        this._activites.push(activity);
    }
    addAbsence(absence) {
        const dateAbs = new Date(absence.date);
        this.holidays.forEach(element => {
            if (this.formatDate(element.date) == this.formatDate(dateAbs)) {
                throw Error('it is a holiday :' + element.name);
            }
        });
        if (this.checkActivityOrAbsenceExists(dateAbs, absence.matin)) {
            throw new Error('FULL day or period');
        }
        const today = new Date();
        let beforeFiveDays = new Date();
        beforeFiveDays.setDate(today.getDate() - 5);
        const absDate = new Date(absence.date);
        if ((absDate.getMonth() != today.getMonth() && beforeFiveDays.getMonth() != absDate.getMonth())) {
            throw new common_1.ForbiddenException();
        }
        this._absences.push(absence);
    }
    calculateEmptyDays() {
        const totalHolidays = this._holidays.length;
        const totalAbsences = this._absences.length;
        const totalActivities = this._activites.length;
        const totalBusinessDays = this.calculateBusinessDays(this._year, this._month);
        return totalBusinessDays - (totalHolidays + (totalAbsences + totalActivities) * 0.5);
    }
    verifyTotalDays() {
        if (this.calculateEmptyDays() == 0)
            return true;
        return false;
    }
    get id() {
        return this._id;
    }
    get holidays() {
        return this._holidays;
    }
    get month() {
        return this._month;
    }
    get year() {
        return this._year;
    }
    get date() {
        return this._date;
    }
    get collab() {
        return this._collab;
    }
    verifyDateNotInCRA(date, periode) {
        const formattedDate = this.formatDate(new Date(date));
        const hasActivity = this._activites.filter(activity => this.formatDate(activity.date) === formattedDate);
        const hasAbsence = this._absences.filter(absence => this.formatDate(absence.date) === formattedDate);
        const num = hasActivity.length + hasAbsence.length;
        if (num === 0) {
            return true;
        }
        else if (num > 1) {
            return false;
        }
        else {
            const existingItem = hasActivity[0] || hasAbsence[0];
            const existingBoolean = existingItem.matin;
            return existingBoolean !== periode;
        }
    }
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    deleteAbsence(date, matin) {
        this.absences.forEach((abs, index) => {
            if (this.formatDate(abs.date) === this.formatDate(date) && abs.matin === matin) {
                this.absences.splice(index, 1);
            }
        });
    }
    deleteActivity(date, matin) {
        this.activities.forEach((act, index) => {
            if (this.formatDate(act.date) === this.formatDate(date) && act.matin === matin) {
                this.activities.splice(index, 1);
            }
        });
    }
    getAvailableDatesOfCra() {
        const startDate = new Date(this.year, this.month - 1, 1);
        const endDate = new Date(this.year, this.month, 0);
        const availableDates = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const isWeekend = this.isWeekend(currentDate);
            const isHoliday = this.checkDateIsHoliday(currentDate);
            const isActivityOrAbsenceExists = this.checkDayIsFull(currentDate);
            if (!isWeekend && !isHoliday && !isActivityOrAbsenceExists) {
                availableDates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return availableDates;
    }
    isWeekend(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    }
    checkDateIsHoliday(date) {
        this.holidays.forEach(hol => {
            if (this.formatDate(hol.date) == this.formatDate(date)) {
                return true;
            }
        });
        return false;
    }
    checkDayIsFull(date) {
        const existingActivity = this.activities.filter((activity) => this.isSameDate(activity.date, date));
        if (existingActivity.length > 1) {
            return true;
        }
        const existingAbsence = this.absences.filter((absence) => this.isSameDate(absence.date, date));
        if (existingAbsence.length > 1) {
            return true;
        }
        if (existingAbsence.length + existingActivity.length > 1) {
            return true;
        }
        return false;
    }
    isSameDate(date1, date2) {
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();
        return year1 === year2 && month1 === month2 && day1 === day2;
    }
    SubmitCra() {
        if (this.getAvailableDatesOfCra().length > 0) {
            return false;
        }
        this._etat = etat_enum_1.Etat.submitted;
        return true;
    }
}
exports.CRA = CRA;
//# sourceMappingURL=CRA.js.map