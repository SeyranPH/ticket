import { Hall } from "./hall";
import { City } from "../CityModule/city";
import { Repository, getRepository } from "typeorm";
import { NotFoundError } from "../../errors/HTTPError";

export class HallService {
  private hallRepository: Repository<Hall>;
  private cityRepository: Repository<City>;

  constructor() {
    this.hallRepository = getRepository(Hall);
    this.cityRepository = getRepository(City);
  }

  public async create({
    name,
    rawCount,
    columnCount,
    cityName,
  }: {
    name: string;
    rawCount: number;
    columnCount: number;
    cityName: string;
  }): Promise<Hall> {
    const city = await this.cityRepository.findOne({
        where: { name: cityName },
    });
    if (!city) {
        throw new NotFoundError("City not found");
    }
    const hall = new Hall({ name, rawCount, columnCount, events: [], city });
    return await this.hallRepository.save(hall);
  }
}
