import { Inject, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { IRepoCra } from '../IRepository/IRepoCra';
import { Raison } from '../model/Raison';
import { IRepoCollab } from '@app/domain/IRepository/IRepoCollab';
import { Month } from '@js-joda/core';

@Injectable()
export class ExportService {
  constructor(
    @Inject('IRepoCra') private readonly repoCra: IRepoCra,
    @Inject('IRepoCollab') private readonly repoCollab: IRepoCollab,
  ) {}
  async generateExcel(month: Month, year: number): Promise<ExcelJS.Buffer> {
    //fetch data to fill
    const craData = await this.repoCra.findByMonthYear(month, year);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recap du mois');

    // headers
    const headerRow = worksheet.addRow([
      'Collaborateur',
      'Période',
      "Nombre d'absences",
      '',
      '',
      '',
      '',
      'Nombre de jours travaillés',
      'Recap',
    ]);
    worksheet.addRow([
      '',
      '',
      'Conges',
      'RTT',
      'Exceptionelle',
      'Formation',
      'Maladie',
      '',
      '',
    ]);
    worksheet.mergeCells('C1:G1');
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('H1:H2');
    worksheet.mergeCells('I1:I2');
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF8ac2d4' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    //size
    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 15;
    worksheet.getColumn('F').width = 15;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('H').width = 25;
    worksheet.getColumn('I').width = 15;
    worksheet.getRow(1).height = 15;
    worksheet.getRow(1).font = {
      bold: true,
      size: 12,
    };

    // data
    for (const item of craData) {
      const absenceCounts = {
        Conges: 0,
        RTT: 0,
        Exceptionnelle: 0,
        Formation: 0,
        Maladie: 0,
      };
      item.absences.forEach((absence) => {
        if (absence.raison === Raison.Conges) absenceCounts.Conges++;
        else if (absence.raison === Raison.RTT) absenceCounts.RTT++;
        else if (absence.raison === Raison.Exceptionnelle)
          absenceCounts.Exceptionnelle++;
        else if (absence.raison === Raison.Formation) absenceCounts.Formation++;
        else if (absence.raison === Raison.Maladie) absenceCounts.Maladie++;
      });

      const collab = await this.repoCollab.findById(item.collab);

      worksheet.addRow([
        `${collab.name} ${collab.lastname}`,
        `${month.value()}/${year}`,
        absenceCounts.Conges / 2,
        absenceCounts.RTT / 2,
        absenceCounts.Exceptionnelle / 2,
        absenceCounts.Formation / 2,
        absenceCounts.Maladie / 2,
        item.activities.length / 2,
        `${(item.absences.length + item.activities.length) / 2}/${
          item.calculateBusinessDays(year, month) - item.holidays.length
        }`,
      ]);
      worksheet.lastRow.height = 20;
    }

    return await workbook.xlsx.writeBuffer();
  }

  async generateExcel2(month: Month, year: number): Promise<ExcelJS.Buffer> {
    //fetch data to fill
    const craData = await this.repoCra.findByMonthYear(month, year);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recap du mois');

    // headers
    const headerRow = worksheet.addRow([
      'Collaborateur',
      'Imputation',
      'Nombre de jours',
    ]);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF8ac2d4' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    //size
    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 15;

    // data
    for (const item of craData) {
      const absenceCounts = {
        Conges: 0,
        RTT: 0,
        Exceptionnelle: 0,
        Formation: 0,
        Maladie: 0,
        SansSolde: 0,
      };
      item.absences.forEach((absence) => {
        if (absence.raison === Raison.Conges) absenceCounts.Conges++;
        else if (absence.raison === Raison.RTT) absenceCounts.RTT++;
        else if (absence.raison === Raison.Exceptionnelle)
          absenceCounts.Exceptionnelle++;
        else if (absence.raison === Raison.Formation) absenceCounts.Formation++;
        else if (absence.raison === Raison.Maladie) absenceCounts.Maladie++;
        else if (absence.raison === Raison.Conges_sans_solde)
          absenceCounts.SansSolde++;
      });

      const collab = await this.repoCollab.findById(item.collab);

      if (absenceCounts.Conges > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'Conges',
          absenceCounts.Conges / 2,
        ]);
      }
      if (absenceCounts.RTT > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'RTT',
          absenceCounts.RTT / 2,
        ]);
      }
      if (absenceCounts.Exceptionnelle > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'Exceptionnelle',
          absenceCounts.Exceptionnelle / 2,
        ]);
      }
      if (absenceCounts.Formation > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'Formation',
          absenceCounts.Formation / 2,
        ]);
      }
      if (absenceCounts.Maladie > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'Maladie',
          absenceCounts.Maladie / 2,
        ]);
      }
      if (absenceCounts.SansSolde > 0) {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          'Conges sans solde',
          absenceCounts.SansSolde / 2,
        ]);
      }
      const activityMap = item.getActivityCountByProject();

      activityMap.forEach((count, project) => {
        worksheet.addRow([
          `${collab.name} ${collab.lastname}`,
          project,
          count / 2,
        ]);
      });
      worksheet.lastRow.height = 20;
    }

    return await workbook.xlsx.writeBuffer();
  }
}
