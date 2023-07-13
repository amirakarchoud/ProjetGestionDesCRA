"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoHoliday = void 0;
const holiday_entity_1 = require("../dataModel/holiday.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const https = require("https");
const Holiday_1 = require("../../domain/model/Holiday");
const environment_1 = require("../../environment/environment");
const schedule_1 = require("@nestjs/schedule");
let RepoHoliday = exports.RepoHoliday = class RepoHoliday {
    constructor(holidayRepository) {
        this.holidayRepository = holidayRepository;
    }
    async fetchAndStoreHolidays() {
        console.log("fetching holidays");
        await this.holidayRepository.clear();
        const year = new Date().getFullYear();
        const url = `${environment_1.environment.apiUrl}${year}.json`;
        console.log(url);
        try {
            const data = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data);
                    });
                }).on('error', (error) => {
                    reject(error);
                });
            });
            const holidaysData = JSON.parse(data);
            const holidays = [];
            let i = 0;
            for (const [dateStr, name] of Object.entries(holidaysData)) {
                const date = new Date(dateStr);
                const namehol = name;
                const existingHoliday = await this.holidayRepository.findOne({ where: { date } });
                if (!existingHoliday) {
                    i++;
                    const holiday = new holiday_entity_1.HolidayDB();
                    holiday.date = date;
                    holiday.name = name;
                    console.log("holiday= " + holiday.name);
                    holidays.push(holiday);
                }
            }
            console.log("i= " + i);
            const savedHolidays = await this.holidayRepository.save(holidays);
            console.log("done fetching holidays");
            return savedHolidays;
        }
        catch (error) {
            console.error("Error fetching holidays:", error);
            throw error;
        }
    }
    async findByDate(date) {
        console.log("date in find holiday " + date);
        const holiday = await this.holidayRepository.find({ where: { date } });
        let returnedHoliday = [];
        console.log("find done");
        if (holiday) {
            holiday.forEach(element => {
                returnedHoliday.push(new Holiday_1.Holiday(element.id, element.date, element.name));
            });
            return returnedHoliday;
        }
        return null;
    }
    async findForCra(month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const holidays = await this.holidayRepository.find({
            where: {
                date: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        if (holidays) {
            const returnedHoliday = holidays.map((holiday) => new Holiday_1.Holiday(holiday.id, holiday.date, holiday.name));
            return returnedHoliday;
        }
        return [];
    }
    async checkDateIsHoliday(date) {
        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        const holiday = await this.holidayRepository.findOne({ where: {
                date: (0, typeorm_2.Between)(startDate, endDate),
            }, });
        return !!holiday;
    }
};
__decorate([
    (0, schedule_1.Cron)('33 14 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RepoHoliday.prototype, "fetchAndStoreHolidays", null);
exports.RepoHoliday = RepoHoliday = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(holiday_entity_1.HolidayDB)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RepoHoliday);
//# sourceMappingURL=RepoHoliday.js.map