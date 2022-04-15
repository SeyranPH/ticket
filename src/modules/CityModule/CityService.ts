import { City } from "./city";
import { Repository, getRepository } from "typeorm";

export class CityService {
    private cityRepository: Repository<City>;

    constructor() {
        this.cityRepository = getRepository(City);
    }

    public async create(name: string): Promise<City> {
        const city = new City({ name, halls: [] });
        return await this.cityRepository.save(city);
    }
}