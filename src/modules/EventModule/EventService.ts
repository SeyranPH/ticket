import { Event } from "./event";
import { Hall } from "../HallModule/hall";
import { AppDataSource } from "../../DataSource";
import { NotFoundError } from "../../errors/HTTPError";

import { Repository } from "typeorm";

export class EventService {
  private hallRepository: Repository<Hall>;
  private eventRepository: Repository<Event>;

  constructor() {
    this.hallRepository = AppDataSource.getRepository(Hall);
    this.eventRepository = AppDataSource.getRepository(Event);
  }

  public async create({
    name,
    hallName,
  }: {
    name: string;
    hallName: string;
  }): Promise<Event> {
    const hall = await this.hallRepository.findOne({
        where: { name: hallName },
    });
    if (!hall) {
        throw new NotFoundError("Hall not found");
    }
    const event = new Event({ name, hall, tickets: [] });
    return await this.eventRepository.save(event);
  }
}
