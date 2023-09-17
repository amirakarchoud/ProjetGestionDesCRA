import { Inject, Injectable } from '@nestjs/common';
import { CRA } from '@app/domain/model/CRA';
import { IRepoCra } from '@app/domain/IRepository/IRepoCra';
import { MongoClientWrapper } from '@app/mongo/mongo.client.wrapper';

const CRAS_COLLECTION = 'CRAs';

@Injectable()
export class CraRepository implements IRepoCra {
  constructor(
    @Inject(MongoClientWrapper)
    private wrapper: MongoClientWrapper,
  ) {}

  async findById(id: string): Promise<CRA> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const doc = await collection.findOne({
      _id: id,
    });

    return CRA.fromJson(doc);
  }

  findByMonthYear(month: number, year: number): Promise<CRA[]> {
    return Promise.resolve([]);
  }

  async findByMonthYearCollab(
    month: number,
    year: number,
    collab: string,
  ): Promise<CRA> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const doc = await collection.findOne({
      _month: month,
      _year: year,
      '_collab._email': collab,
    });

    if (!doc) {
      return undefined;
    }

    return CRA.fromJson(doc);
  }

  findByYearUser(idUser: string, year: number): Promise<CRA[]> {
    return Promise.resolve([]);
  }

  async save(cra: CRA): Promise<void> {
    const collection = this.wrapper.getCollection(CRAS_COLLECTION);
    const count = await collection.countDocuments({
      _month: cra.month,
      _year: cra.year,
      '_collab._email': cra.collab.email,
    });

    if (count === 0) {
      await collection.insertOne(cra.mapToJson());
    } else {
      await collection.replaceOne({ _id: cra.id }, cra.mapToJson());
    }
  }

  // constructor(
  //   @Inject(DataSource) private dataSource: DataSource,
  //   @InjectRepository(CRADB)
  //   private craRepository: Repository<CRADB>,
  //   @InjectRepository(ActivityDB)
  //   private activityRepository: Repository<ActivityDB>,
  //   @InjectRepository(AbsenceDB)
  //   private absenceRepository: Repository<AbsenceDB>,
  //   @Inject('IRepoCollab') private readonly collabRepository: IRepoCollab,
  // ) {}
  // async findByMonthYear(month: number, year: number): Promise<CRA[]> {
  //   const foundcras: CRA[] = [];
  // const cras = await this.craRepository.find({
  //   where: { month, year },
  //   relations: ['collab', 'holidays', 'history'],
  // });
  // for (const cra of cras) {
  //   const foundcra = await this.CraDBToCra(cra);
  //   foundcras.push(foundcra);
  // }
  //   return foundcras;
  // }
  // async findByYearUser(collabid: string, year: number): Promise<CRA[]> {
  //   const foundcras: CRA[] = [];
  //   const cras = await this.craRepository.find({
  //     where: { collab: { email: collabid }, year },
  //     relations: ['collab', 'holidays', 'history'],
  //   });
  //   for (const cra of cras) {
  //     const foundcra = await this.CraDBToCra(cra);
  //     foundcras.push(foundcra);
  //   }
  //   return foundcras;
  // }
  // async findByMonthYearCollab(month: number, year: number, collabid: string) {
  //   const cra = await this.craRepository.findOne({
  //     where: { month, year, collab: { email: collabid } },
  //     relations: ['collab', 'holidays', 'history'],
  //   });
  //   if (cra) {
  //     const foundcra = await this.CraDBToCra(cra);
  //     return foundcra;
  //   }
  //   console.log('returning null');
  //   return null;
  // }
  // private async CraDBToCra(cra: CRADB) {
  //   const user = await this.collabRepository.findById(cra.collab.email);
  // const foundcra = new CRA(
  //   cra.id,
  //   cra.month,
  //   cra.year,
  //   user,
  //   cra.date,
  //   cra.etat,
  //   cra.status,
  // );
  // foundcra.collab.email = user.email;
  // //fill absences
  // const absences = await this.absenceRepository.findBy({
  //   craId: foundcra.id,
  // });
  // const craAbsences: Absence[] = absences.map((abs) => {
  //   const absf = new Absence(foundcra.id, abs.matin, abs.date, abs.raison);
  //   return absf;
  // });
  // foundcra.absences = craAbsences;
  // //fill activities
  // const activities = await this.activityRepository.find({
  //   where: { craId: foundcra.id },
  //   relations: ['project'],
  // });
  // const craActivities: Activity[] = activities.map((abs) => {
  //   const absf = new Activity(
  //     new Project(
  //       abs.project.code,
  //       [],
  //       abs.project.name,
  //       abs.project.client,
  //       new Date(abs.project.date),
  //       abs.project.status,
  //     ),
  //     abs.matin,
  //     abs.date,
  //     foundcra.id,
  //   );
  //   return absf;
  // });
  // foundcra.activities = craActivities;
  // const craholiday: Holiday[] = cra.holidays.map((abs) => {
  //   const absf = new Holiday(abs.id, abs.date, abs.name);
  //   return absf;
  // });
  // foundcra.holidays = craholiday;
  //   const craRegul: Regul[] = cra.history.map((abs) => {
  //     let target = null;
  //     if (abs.target.code != null) {
  //       target = new Activity(
  //         new Project(
  //           abs.target.code,
  //           [],
  //           '',
  //           '',
  //           new Date(),
  //           ProjetStatus.Active,
  //         ),
  //         abs.target.matin,
  //         abs.target.date,
  //         foundcra.id,
  //       );
  //     } else if (abs.target.raison != null) {
  //       target = new Absence(
  //         foundcra.id,
  //         abs.target.matin,
  //         abs.target.date,
  //         abs.target.raison,
  //       );
  //     }
  //     const absf = new Regul(abs.id, abs.date, abs.action, target);
  //     return absf;
  //   });
  //   foundcra.history = craRegul;
  //   return foundcra;
  // }
  // async findById(id: number): Promise<CRA> {
  //   const cra = await this.craRepository.findOne({
  //     where: { id },
  //     relations: ['collab', 'holidays', 'history'],
  //   });
  //   const found = await this.CraDBToCra(cra);
  //   return found;
  // }
  // async save(cra: CRA): Promise<CRA> {
  //   await this.dataSource
  //     .createQueryBuilder()
  //     .delete()
  //     .from(ActivityDB)
  //     .where('craId = :id', { id: cra.id })
  //     .execute();
  //   await this.dataSource
  //     .createQueryBuilder()
  //     .delete()
  //     .from(AbsenceDB)
  //     .where('craId = :id', { id: cra.id })
  //     .execute();
  //   const cradb = await this.CraToCraDB(cra);
  //   await this.craRepository.save(cradb);
  //   return cra;
  // }
  // private async CraToCraDB(cra: CRA) {
  //   const cradb = new CRADB();
  //   cradb.id = cra.id;
  //   cradb.month = cra.month;
  //   cradb.year = cra.year;
  //   cradb.collab = new UserDB();
  //   cradb.collab.email = cra.collab.email;
  //   cradb.date = cra.date;
  //   cradb.etat = cra.etat;
  //   cradb.status = cra.status;
  // const craActivitiesDB: ActivityDB[] = cra.activities.map((activity) => {
  //   const activityDB = new ActivityDB();
  //   activityDB.craId = cra.id;
  //   activityDB.date = activity.date;
  //   activityDB.matin = activity.matin;
  //   activityDB.project = new ProjectDB();
  //   activityDB.project.code = activity.project.code;
  //   activityDB.project.status = activity.project.status;
  //   activityDB.project.date = new Date(activity.project.date);
  //   return activityDB;
  // });
  // await this.activityRepository.save(craActivitiesDB);
  // const craAbsencesDB: AbsenceDB[] = cra.absences.map((abs) => {
  //   const absdb = new AbsenceDB();
  //   absdb.craId = cra.id;
  //   absdb.date = abs.date;
  //   absdb.matin = abs.matin;
  //   absdb.raison = abs.raison;
  //   return absdb;
  // });
  // await this.absenceRepository.save(craAbsencesDB);
  // const holidaydb: HolidayDB[] = cra.holidays.map((hol) => {
  //   const holdb = new HolidayDB();
  //   holdb.id = hol.id;
  //   holdb.date = hol.date;
  //   holdb.name = hol.name;
  //   return holdb;
  // });
  // cradb.holidays = holidaydb;
  //   const regulDB: RegulDB[] = cra.history.map((reg) => {
  //     const regdb = new RegulDB();
  //     regdb.id = reg.id;
  //     regdb.date = reg.date;
  //     regdb.action = reg.action;
  //     regdb.target = new AbsenceInfo();
  //     regdb.target.date = reg.target.date;
  //     regdb.target.matin = reg.target.matin;
  //     if (reg.target instanceof Activity) {
  //       regdb.target.code = reg.target.project.code;
  //     } else if (reg.target instanceof Absence) {
  //       regdb.target.raison = reg.target.raison;
  //     }
  //     return regdb;
  //   });
  //   cradb.history = regulDB;
  //   return cradb;
  // }
  // async findByCollab(collabid: string) {
  //   const foundcras: CRA[] = [];
  //   const cras = await this.craRepository.find({
  //     where: { collab: { email: collabid } },
  //     relations: ['collab', 'holidays', 'history'],
  //   });
  //   if (cras) {
  //     for (const cra of cras) {
  //       const foundcra = await this.CraDBToCra(cra);
  //       foundcras.push(foundcra);
  //     }
  //   }
  //   return foundcras;
  // }
}
