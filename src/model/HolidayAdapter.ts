import axios, { AxiosResponse } from 'axios';

export class HolidayAdapter {
  private apiUrl: string;

  constructor() {
    const today =new Date();
    this.apiUrl = 'https://calendrier.api.gouv.fr/jours-feries/metropole/'+today.getFullYear().toString()+'.json';
  }

  public async getHolidays(): Promise<any> {
    //const today =new Date();
    const params = {
    };

    try {
      const response: AxiosResponse = await axios.get(this.apiUrl, { params });
      if (response.status === 200) {
        const holidays = response.data;
      const formattedHolidays: any[] = [];

      // Convert the object 
      for (const [date, name] of Object.entries(holidays)) {
        formattedHolidays.push({ date, name });
      }

      return formattedHolidays;
      } else {
        console.log('Error: Failed to retrieve holidays.');
      }
    } catch (error) {
      console.log('Error: Failed to connect to the API.');
    }

    return [];
  }
}
