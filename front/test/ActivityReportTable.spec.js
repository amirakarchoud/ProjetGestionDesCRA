import { ActivityReport } from '../src/Components/models/ActivityReport';
import { DateTimeFormatter, LocalDate } from '@js-joda/core';
import {
  Absences,
  ActivityTypeValues,
} from '../src/Components/const/ActivityReport.constant';
import NotificationsHandler from '../src/Services/handlers/NotificationsHandler';

const ProjectsTest = Object.freeze({
  a: 'Project A',
  b: 'Project B',
});

describe('Activity Report ActivityReportTable', () => {
  it('Get the Monday of the week for a given date', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], localDate, {}, {});
    // When
    let monday = report.getMonday();
    // Then
    expect(monday).toEqual(LocalDate.of(2023, 10, 30));
  });

  it('A week has 5 days', () => {
    // Given
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    let week = report.week();
    // Then
    expect(week).toHaveLength(5);
  });

  it('should return the week as iso string date', () => {
    // Given
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    let week = report.week();
    // Then
    expect(report.isoWeek()).toHaveLength(5);
    expect(report.isoWeek()[0]).toEqual(
      week[0].format(DateTimeFormatter.ISO_LOCAL_DATE),
    );
  });

  it('should return holidays as iso string date', () => {
    // Given
    const holidays = [
      {
        name: '1er janvier',
        percentage: 100,
        date: LocalDate.parse('2024-01-01'),
        type: ActivityTypeValues.Holiday,
      },
    ];
    const report = new ActivityReport(
      [],
      [],
      holidays,
      LocalDate.now(),
      {},
      {},
    );
    // When
    let isoHolidaysDates = report.isoHolidaysDates();
    // Then
    expect(isoHolidaysDates[0]).toEqual('2024-01-01');
  });

  it('Should return Friday for the current report', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], localDate, {}, {});
    // When
    let day = report.week()[4];
    // Then
    expect(day).toEqual(LocalDate.of(2023, 11, 3));
  });

  it('Can switch to next week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], localDate, {}, {});
    // When
    report.nextWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 11, 6));
  });

  it('Can switch to previous week', () => {
    // Given
    let localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], localDate, {}, {});
    // When
    report.previousWeek();
    // Then
    expect(report.getMonday()).toEqual(LocalDate.of(2023, 10, 23));
  });

  it('Add an activity', () => {
    // Given
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(1),
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(2),
      ProjectsTest.b,
      100,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(4),
      Absences.Rtt,
      25,
      ActivityTypeValues.Absence,
    );
    // Then
    let weekProjects = report.weekProjects();
    expect(weekProjects[ProjectsTest.a]).toHaveLength(2);
    expect(report.activities).toHaveLength(4);
  });

  it('Add an activity with same project and date update the value', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      50,
      ActivityTypeValues.Project,
    );
    // Then
    let activity = report.getByActivityNameAndDate(ProjectsTest.a, localDate);
    expect(activity.percentage).toEqual(50);
  });

  it('The sum of activities percents must be equal to 100 for the same day', () => {
    // Given
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(1),
      ProjectsTest.a,
      100,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(1),
      ProjectsTest.b,
      0,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ActivityTypeValues.Absence,
      localDate,
      Absences.Rtt,
      75,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(2),
      ProjectsTest.b,
      50,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(2),
      Absences.Rtt,
      50,
      ActivityTypeValues.Absence,
    );
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
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.b,
      75,
      ActivityTypeValues.Project,
    );
    // Then
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeGreaterThan(100);
  });

  it('not < 100', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate,
      ProjectsTest.b,
      75,
      ActivityTypeValues.Project,
    );
    // Then
    const activityForGivenDay = report.getSumActivityForGivenDay(localDate);
    expect(activityForGivenDay).not.toBeLessThan(100);
  });

  it('should return activities for the week', () => {
    const localDate = LocalDate.of(2023, 11, 1);
    const report = new ActivityReport([], [], [], localDate, {}, {});

    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(10),
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );

    expect(report.weekActivities()).toHaveLength(1);
  });

  it('should return projects for the week', () => {
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(1),
      ProjectsTest.b,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusWeeks(1),
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(1),
      Absences.Rtt,
      50,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusDays(2),
      Absences.Maladie,
      100,
      ActivityTypeValues.Absence,
    );
    // Then
    expect(report.weekProjects()).toEqual({
      [ProjectsTest.a]: [
        {
          code: ProjectsTest.a,
          date: localDate,
          name: ProjectsTest.a,
          percentage: 25,
          type: ActivityTypeValues.Project,
        },
      ],
      [ProjectsTest.b]: [
        {
          code: ProjectsTest.b,
          date: localDate.plusDays(1),
          name: ProjectsTest.b,
          percentage: 75,
          type: ActivityTypeValues.Project,
        },
      ],
    });
  });

  it('should return absences for the week', () => {
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    // When
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(1),
      ProjectsTest.b,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusWeeks(1),
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(1),
      Absences.Rtt,
      50,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusDays(2),
      Absences.Maladie,
      100,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusWeeks(2),
      Absences.Maladie,
      100,
      ActivityTypeValues.Absence,
    );
    // Then
    expect(report.weekAbsences()).toEqual({
      [Absences.Maladie]: [
        {
          code: Absences.Maladie,
          date: localDate.plusDays(2),
          name: Absences.Maladie,
          percentage: 100,
          type: ActivityTypeValues.Absence,
        },
      ],
      [Absences.Rtt]: [
        {
          code: Absences.Rtt,
          date: localDate.plusDays(1),
          name: Absences.Rtt,
          percentage: 50,
          type: ActivityTypeValues.Absence,
        },
      ],
    });
  });

  it('select the activity for a given name and date', () => {
    // Given
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    // Then
    expect(report.addActivity).toBeDefined();
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(1),
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(2),
      ProjectsTest.a,
      25,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      75,
      ActivityTypeValues.Project,
    );
    // Then
    expect(report.getByActivityNameAndDate(ProjectsTest.a, localDate)).toEqual({
      code: ProjectsTest.a,
      date: localDate,
      name: ProjectsTest.a,
      percentage: 75,
      type: ActivityTypeValues.Project,
    });
  });

  // only for an absence activity
  it('should delete an activity for the current week', () => {
    // Given
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    // When
    report.addActivity(
      Absences.Maladie,
      localDate,
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusDays(1),
      Absences.Maladie,
      75,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusDays(2),
      Absences.Maladie,
      100,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusWeeks(1),
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusWeeks(1).plusDays(1),
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Maladie,
      localDate.plusWeeks(1).plusDays(2),
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Maladie]).toHaveLength(3);
    expect(report.activities).toHaveLength(6);
    report.deleteWeekActivity(Absences.Maladie);
    weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Maladie]).toBeUndefined();
    expect(report.activities).toHaveLength(3);
  });

  // only for an absence activity
  it('should update an activity name/reason for the current week', () => {
    // Given
    const report = new ActivityReport(
      [],
      [],
      [],
      LocalDate.now(),
      {},
      NotificationsHandler,
    );
    const localDate = report.getMonday();
    // When
    report.addActivity(
      Absences.Maladie,
      localDate,
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(1),
      Absences.Rtt,
      75,
      ActivityTypeValues.Absence,
    );
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Maladie]).toHaveLength(1);
    expect(weekAbsences[Absences.Rtt]).toHaveLength(1);

    report.updateActivityCode(
      Absences.Rtt,
      Absences.CongesPayes,
      ActivityTypeValues.Absence,
    );
    weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Rtt]).toBeUndefined();
    expect(weekAbsences[Absences.Maladie]).toHaveLength(1);
    expect(weekAbsences[Absences.CongesPayes]).toHaveLength(1);
  });

  // only for an absence activity
  it('should not update an activity name/reason as it already exists for the current week', () => {
    // Given
    const report = new ActivityReport(
      [],
      [],
      [],
      LocalDate.now(),
      {},
      NotificationsHandler,
    );
    const localDate = report.getMonday();
    // When
    report.addActivity(
      Absences.Maladie,
      localDate,
      Absences.Maladie,
      25,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      Absences.Rtt,
      localDate.plusDays(1),
      Absences.Rtt,
      75,
      ActivityTypeValues.Absence,
    );
    // Then
    let weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Maladie]).toHaveLength(1);
    expect(weekAbsences[Absences.Rtt]).toHaveLength(1);

    // same expectation as you can not rename for an already existing name in the week
    report.updateActivityCode(
      Absences.Maladie,
      Absences.Rtt,
      ActivityTypeValues.Absence,
    );
    weekAbsences = report.weekAbsences();
    expect(weekAbsences[Absences.Maladie]).toHaveLength(1);
    expect(weekAbsences[Absences.Rtt]).toHaveLength(1);
  });

  it('should delete an activity', () => {
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();

    report.addActivity(
      ProjectsTest.a,
      localDate,
      ProjectsTest.a,
      100,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(1),
      ProjectsTest.b,
      75,
      ActivityTypeValues.Project,
    );

    expect(report.weekActivities()).toHaveLength(2);
    const activity = {
      code: ProjectsTest.b,
      date: localDate.plusDays(1),
      name: ProjectsTest.b,
      percentage: 75,
      type: ActivityTypeValues.Project,
    };
    report.deleteActivity(activity);
    expect(report.weekActivities()).toHaveLength(1);
  });

  it('should remove activities with percentage equals to 0 for the week', () => {
    const report = new ActivityReport([], [], [], LocalDate.now(), {}, {});
    const localDate = report.getMonday();
    report.addActivity(
      Absences.Rtt,
      localDate,
      Absences.Rtt,
      75,
      ActivityTypeValues.Absence,
    );
    report.addActivity(
      ProjectsTest.a,
      localDate.plusDays(1),
      ProjectsTest.a,
      100,
      ActivityTypeValues.Project,
    );
    report.addActivity(
      ProjectsTest.b,
      localDate.plusDays(2),
      ProjectsTest.b,
      0,
      ActivityTypeValues.Project,
    );

    expect(report.weekActivities()).toHaveLength(3);
    report.cleanWeekActivity();
    expect(report.weekActivities()).toHaveLength(2);
  });
});
