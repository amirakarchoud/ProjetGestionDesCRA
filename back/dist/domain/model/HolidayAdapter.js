"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayAdapter = void 0;
const axios_1 = require("axios");
class HolidayAdapter {
    constructor() {
        const today = new Date();
        this.apiUrl = 'https://calendrier.api.gouv.fr/jours-feries/metropole/' + today.getFullYear().toString() + '.json';
    }
    async getHolidays() {
        const params = {};
        try {
            const response = await axios_1.default.get(this.apiUrl, { params });
            if (response.status === 200) {
                const holidays = response.data;
                const formattedHolidays = [];
                for (const [date, name] of Object.entries(holidays)) {
                    formattedHolidays.push({ date, name });
                }
                return formattedHolidays;
            }
            else {
                console.log('Error: Failed to retrieve holidays.');
            }
        }
        catch (error) {
            console.log('Error: Failed to connect to the API.');
        }
        return [];
    }
}
exports.HolidayAdapter = HolidayAdapter;
//# sourceMappingURL=HolidayAdapter.js.map