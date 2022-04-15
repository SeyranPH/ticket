import { Event } from "../EventModule/event";
import { Ticket } from "./ticket";
import { Repository, getRepository } from "typeorm";

export class TicketService {
  private ticketRepository: Repository<Ticket>;

  constructor() {
    this.ticketRepository = getRepository(Ticket);
  }

}
