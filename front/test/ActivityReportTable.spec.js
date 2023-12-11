import { ActivityReport } from '../src/Components/models/ActivityReport';
import { LocalDate } from '@js-joda/core';

describe('Activity Report ActivityReportTable', () => {
  it('Get the Monday of the week for a given date', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    expect(report.localDate).toBeDefined();
    expect(report.getMonday).toBeDefined();
    let monday = report.getMonday();
    // Then
    expect(monday).toEqual(LocalDate.of(2023, 10, 30));
  });

  it('A week has 5 days', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.week).toBeDefined();
    let week = report.week();
    // Then
    expect(week).toHaveLength(5);
  });

  it('Should return Friday for the current report', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    expect(report.week).toBeDefined();
    expect(report.week()[4]).toBeDefined();
    let day = report.week()[4];
    // Then
    expect(day).toEqual(LocalDate.of(2023, 11, 3));
  });

  it('Can switch to next week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    expect(report.nextWeek).toBeDefined();
    report.nextWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 11, 6));
  });

  it('Can switch to previous week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    expect(report.previousWeek).toBeDefined();
    report.previousWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 10, 23));
  });

  it('Add an activity', () => {
    // Given
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.addActivity).toBeDefined();
    report.addActivity('Project','project 123', localDate, 25);
    report.addActivity('Project','project 123', localDate.plusDays(1), 75);
    report.addActivity('Project','project 456', localDate.plusDays(2), 100);
    report.addActivity('Absence','cp', localDate.plusDays(4), 50);
    // Then
    expect(report.activities).toBeDefined();
    let map = report.groupByProject();
    expect(map.get('project 123')).toHaveLength(2);
    expect(report.activities).toHaveLength(4);
  });

  it('Add an activity with same project and date update the value', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.addActivity).toBeDefined();
    report.addActivity('Project', 'project A', localDate, 25);
    report.addActivity('Project', 'project A', localDate, 75);
    report.addActivity('Project', 'project A', localDate, 50);
    // Then
    expect(report.activities).toBeDefined();
    let activity = report.getByActivityNameAndDate('project A', localDate);
    expect(activity.percent).toEqual(50);
  });

  it('The sum of activities percents must be equal to 100 for the same day', () => {
    // Given
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.addActivity).toBeDefined();
    report.addActivity('Project', 'project 123', localDate, 25);
    report.addActivity('Project', 'project 123', localDate.plusDays(1), 100);
    report.addActivity('Project', 'project 456', localDate.plusDays(1), 0);
    report.addActivity('Absence', 'cp', localDate, 75);
    report.addActivity('Project', 'project 456', localDate.plusDays(2), 50);
    report.addActivity('Absence', 'cp', localDate.plusDays(2), 50);
    // Then
    expect(report.getSumActivityForGivenDay).toBeDefined();
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    const activityForGivenDay1 = report.getSumActivityForGivenDay(
      localDate.plusDays(1),
    );
    const activityForGivenDay2 = report.getSumActivityForGivenDay(
      localDate.plusDays(2),
    );
    expect(activityForGivenDay).toEqual(100);
    expect(activityForGivenDay1).toEqual(100);
    expect(activityForGivenDay2).toEqual(100);
  });

  it('not > 100', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.addActivity).toBeDefined();
    report.addActivity('Project', 'project 123', localDate, 25);
    report.addActivity('Project', 'project 12', localDate, 75);
    // Then
    expect(report.getSumActivityForGivenDay).toBeDefined();
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeGreaterThan(100);
  });

  it('not < 100', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    expect(report.addActivity).toBeDefined();
    report.addActivity('Project', 'project 123', localDate, 25);
    report.addActivity('Project', 'project 12', localDate, 75);
    // Then
    expect(report.getSumActivityForGivenDay).toBeDefined();
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeLessThan(100);
  });

  it('An activity has 5 days, for each days has project(s) AND/OR absences', () => {
    // Given
    // When
    // Then
  });

  it('should return activities for the week', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);

    report.addActivity('Project', 'project 123', localDate, 25);
    report.addActivity('Project', 'project 12', localDate.plusDays(10), 75);

    expect(report.weekActivities()).toHaveLength(1);
  });

  it('should return projects for the week', () => {

  });

  it('should return absences for the week', () => {

  });
});
