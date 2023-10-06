import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportService } from '../domain/service/export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('/v1/:month/:year')
  @ApiOperation({
    summary: 'Exporter en Excel',
    description:
      "Exporte les données des comptes rendus d'activité (CRA) au format Excel pour un mois et une année donnés.",
  })
  async exportToExcel(
    @Res() res: Response,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    try {
      const buffer = await this.exportService.generateExcel(month, year);
      const filename = 'Recap_Du_Mois.xlsx';

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error generating Excel file' });
    }
  }

  @Get('/v2/:month/:year')
  @ApiOperation({
    summary: 'Exporter en Excel',
    description:
      "Exporte les données des comptes rendus d'activité (CRA) au format Excel pour un mois et une année donnés.",
  })
  async exportToExcel2(
    @Res() res: Response,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    try {
      const buffer = await this.exportService.generateExcel2(month, year);
      const filename = 'Recap_Du_Mois.xlsx';

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error generating Excel file' });
    }
  }
}
