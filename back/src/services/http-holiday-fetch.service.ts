import https from 'https';
import { Injectable } from '@nestjs/common';
import { HolidayFetchService } from '@app/services/holiday-fetch.service';

@Injectable()
export class HttpHolidayFetchService implements HolidayFetchService {
  public async fetchHolidaysData(url: string) {
    const data = await new Promise<string>((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(data);
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    return JSON.parse(data);
  }
}
