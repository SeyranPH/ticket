import { Hall } from "../HallModule/hall";
import { Event } from "./event";
import { Repository, getRepository } from "typeorm";
import { NotFoundError } from "../../errors/HTTPError";

export class EventService {
  private hallRepository: Repository<Hall>;
  private eventRepository: Repository<Event>;

  constructor() {
    this.hallRepository = getRepository(Hall);
    this.eventRepository = getRepository(Event);
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
