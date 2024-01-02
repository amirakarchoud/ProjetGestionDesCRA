import { ActivityReport } from '../src/Components/models/ActivityReport';
import { LocalDate } from '@js-joda/core';

describe('Activity Report ActivityReportTable', () => {
  it('Get the Monday of the week for a given date', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    let monday = report.getMonday();
    // Then
    expect(monday).toEqual(LocalDate.of(2023, 10, 30));
  });

  it('A week has 5 days', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    // When
    let week = report.week();
    // Then
    expect(week).toHaveLength(5);
  });

  it('Should return Friday for the current report', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    let day = report.week()[4];
    // Then
    expect(day).toEqual(LocalDate.of(2023, 11, 3));
  });

  it('Can switch to next week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    report.nextWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 11, 6));
  });

  it('Can switch to previous week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);
    // When
    report.previousWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 10, 23));
  });

  it('Add an activity', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'project 123', 25, 'project');
    report.addActivity(localDate.plusDays(1), 'project 123', 75, 'project');
    report.addActivity(localDate.plusDays(2), 'project 456', 100, 'project');
    report.addActivity(localDate.plusDays(4), 'rtt', 25, 'absence');
    // Then
    let weekProjects = report.weekProjects();
    expect(weekProjects['project 123']).toHaveLength(2);
    expect(report.activities).toHaveLength(4);
  });

  it('Add an activity with same project and date update the value', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate, 'project A', 75, 'project');
    report.addActivity(localDate, 'project A', 50, 'project');
    // Then
    let activity = report.getByActivityNameAndDate('project A', localDate);
    expect(activity.percentage).toEqual(50);
  });

  it('The sum of activities percents must be equal to 100 for the same day', () => {
    // Given
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(1), 'project A', 100, 'project');
    report.addActivity(localDate.plusDays(1), 'project B', 0, 'project');
    report.addActivity(localDate, 'rtt', 75, 'absence');
    report.addActivity(localDate.plusDays(2), 'project B', 50, 'project');
    report.addActivity(localDate.plusDays(2), 'rtt', 50, 'absence');
    // Then
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
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate, 'project B', 75, 'project');
    // Then
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeGreaterThan(100);
  });

  it('not < 100', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(LocalDate.now());
    // When
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate, 'project B', 75, 'project');
    // Then
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeLessThan(100);
  });

  it('should return activities for the week', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport(localDate);

    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(10), 'project A', 75, 'project');

    expect(report.weekActivities()).toHaveLength(1);
  });

  it('should return projects for the week', () => {
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(1), 'project B', 75, 'project');
    report.addActivity(localDate.plusWeeks(1), 'project A', 75, 'project');
    report.addActivity(localDate.plusDays(1), 'rtt', 50, 'absence');
    report.addActivity(localDate.plusDays(2), 'maladie', 100, 'absence');
    // Then
    expect(report.weekProjects()).toEqual({
      'project A': [
        { date: localDate, name: 'project A', percentage: 25, type: 'project' },
      ],
      'project B': [
        {
          date: localDate.plusDays(1),
          name: 'project B',
          percentage: 75,
          type: 'project',
        },
      ],
    });
  });

  it('should return absences for the week', () => {
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(1), 'project B', 75, 'project');
    report.addActivity(localDate.plusWeeks(1), 'project A', 75, 'project');
    report.addActivity(localDate.plusDays(1), 'rtt', 50, 'absence');
    report.addActivity(localDate.plusDays(2), 'maladie', 100, 'absence');
    report.addActivity(localDate.plusWeeks(2), 'maladie', 100, 'absence');
    // Then
    expect(report.weekAbsences()).toEqual({
      maladie: [
        {
          date: localDate.plusDays(2),
          name: 'maladie',
          percentage: 100,
          type: 'absence',
        },
      ],
      rtt: [
        {
          date: localDate.plusDays(1),
          name: 'rtt',
          percentage: 50,
          type: 'absence',
        },
      ],
    });
  });

  it('select the activity for a given name and date', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // Then
    expect(report.addActivity).toBeDefined();
    report.addActivity(localDate, 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(1), 'project A', 25, 'project');
    report.addActivity(localDate.plusDays(2), 'project A', 25, 'project');
    report.addActivity(localDate, 'project A', 75, 'project');
    // Then
    expect(report.getByActivityNameAndDate('project A', localDate)).toEqual({
      date: localDate,
      name: 'project A',
      percentage: 75,
      type: 'project',
    });
  });

  // only for an absence activity
  it('should delete an activity for the current week', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'maladie', 25, 'absence');
    report.addActivity(localDate.plusDays(1), 'maladie', 75, 'absence');
    report.addActivity(localDate.plusDays(2), 'maladie', 100, 'absence');
    report.addActivity(localDate.plusWeeks(1), 'maladie', 25, 'absence');
    report.addActivity(
      localDate.plusWeeks(1).plusDays(1),
      'maladie',
      25,
      'absence',
    );
    report.addActivity(
      localDate.plusWeeks(1).plusDays(2),
      'maladie',
      25,
      'absence',
    );
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences['maladie']).toHaveLength(3);
    expect(report.activities).toHaveLength(6);
    report.deleteActivity('maladie');
    weekAbsences = report.weekAbsences();
    expect(weekAbsences['maladie']).toBeUndefined();
    expect(report.activities).toHaveLength(3);
  });

  // only for an absence activity
  it('should update an activity name/reason for the current week', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'maladie', 25, 'absence');
    report.addActivity(localDate.plusDays(1), 'rtt', 75, 'absence');
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences['maladie']).toHaveLength(1);
    expect(weekAbsences['rtt']).toHaveLength(1);

    report.updateActivity('rtt', 'congesPayes', 'absence');
    weekAbsences = report.weekAbsences();
    expect(weekAbsences['rtt']).toBeUndefined();
    expect(weekAbsences['maladie']).toHaveLength(1);
    expect(weekAbsences['congesPayes']).toHaveLength(1);
  });

  // only for an absence activity
  it('should not update an activity name/reason as it already exists for the current week', () => {
    // Given
    const report = new ActivityReport(LocalDate.now());
    const localDate = report.getMonday();
    // When
    report.addActivity(localDate, 'maladie', 25, 'absence');
    report.addActivity(localDate.plusDays(1), 'rtt', 75, 'absence');
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences['maladie']).toHaveLength(1);
    expect(weekAbsences['rtt']).toHaveLength(1);

    // same expectation as you can not rename for an already existing name in the week
    report.updateActivity('maladie', 'rtt', 'absence');
    weekAbsences = report.weekAbsences();
    expect(weekAbsences['maladie']).toHaveLength(1);
    expect(weekAbsences['rtt']).toHaveLength(1);
  });
});
