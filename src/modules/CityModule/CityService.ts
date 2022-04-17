import { City } from "./city";
import { Repository } from "typeorm";
import { AppDataSource } from "../../DataSource";

export class CityService {
    private cityRepository: Repository<City>;

    constructor() {
        this.cityRepository = AppDataSource.getRepository(City);
    }

    public async create(name: string): Promise<City> {
        const city = new City({ name, halls: [] });
        return await this.cityRepository.save(city);
    }
}