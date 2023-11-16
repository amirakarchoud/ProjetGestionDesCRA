import { ExportService } from '@app/domain/service/export.service';
import { MockRepoCra } from './cra.repo.mock';
import * as ExcelJS from 'exceljs';
import { CollabRepoMock } from './collab.repo.mock';
import { Month } from '@js-joda/core';

describe('ExportService', () => {
  let exportService: ExportService;
  let mockRepoCra: MockRepoCra;
  let mockCollabRepo: CollabRepoMock;

  beforeEach(() => {
    mockRepoCra = new MockRepoCra();
    mockCollabRepo = new CollabRepoMock();
    exportService = new ExportService(mockRepoCra, mockCollabRepo);
  });

  it(' generate Excel file with correct data', async () => {
    const month = Month.of(7);
    const year = 2023;
    const excelBuffer = await exportService.generateExcel(month, year);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excelBuffer);

    const worksheet = workbook.getWorksheet('Recap du mois');

    const headerRow = worksheet.getRow(1);
    expect(headerRow.getCell(1).value).toBe('Collaborateur');
    expect(headerRow.getCell(2).value).toBe('Période');
    expect(headerRow.getCell(3).value).toBe("Nombre d'absences");
    const dataRows = worksheet.getRows(3, worksheet.rowCount);
    expect(dataRows[0].getCell(1).value).toBe('amira karchoud');
    expect(dataRows[0].getCell(2).value).toBe('7/2023');
    expect(dataRows[0].getCell(8).value).toBe(1.5);
    expect(dataRows[0].getCell(9).value).toBe('2.5/20');
  });

  it('generates Excel file (format 2) with correct data', async () => {
    const month = Month.of(7);
    const year = 2023;
    const excelBuffer = await exportService.generateExcel2(month, year);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excelBuffer);

    const worksheet = workbook.getWorksheet('Recap du mois');

    const headerRow = worksheet.getRow(1);
    expect(headerRow.getCell(1).value).toBe('Collaborateur');
    expect(headerRow.getCell(2).value).toBe('Imputation');
    expect(headerRow.getCell(3).value).toBe('Nombre de jours');

    const dataRows = worksheet.getRows(2, worksheet.rowCount);
    expect(dataRows[0].getCell(1).value).toBe('amira karchoud');
    expect(dataRows[0].getCell(2).value).toBe('Conges');
    expect(dataRows[0].getCell(3).value).toBe(1);
    expect(dataRows[1].getCell(1).value).toBe('amira karchoud');
    expect(dataRows[1].getCell(2).value).toBe('Project1');
    expect(dataRows[1].getCell(3).value).toBe(5);
    expect(dataRows[2].getCell(1).value).toBe('amira karchoud');
    expect(dataRows[2].getCell(2).value).toBe('Project2');
    expect(dataRows[2].getCell(3).value).toBe(10);
  });
});
