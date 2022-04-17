import { Ticket, TicketStatus } from "./ticket";
import { Event } from "../EventModule/event";
import { User } from "../UserModule/user";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../../errors/HTTPError";

import { Brackets, createQueryBuilder, Repository } from "typeorm";
import { AppDataSource } from "../../DataSource";

export class TicketService {
  private ticketRepository: Repository<Ticket>;
  private eventRepository: Repository<Event>;
  private userRepository: Repository<User>;

  constructor() {
    this.ticketRepository = AppDataSource.getRepository(Ticket);
    this.eventRepository = AppDataSource.getRepository(Event);
    this.userRepository = AppDataSource.getRepository(User);
  }

  private sortBySeat(
    a: { raw: number; column: number },
    b: { raw: number; column: number }
  ) {
    if (a.raw !== b.raw) {
      throw new ForbiddenError("Raw numbers must be equal");
    }
    if (a.column < b.column) {
      return -1;
    }
    if (a.column > b.column) {
      return 1;
    }
    throw new ForbiddenError("column number must be different");
  }

  private validateReservation(
    ticketPlaces: Array<{ raw: number; column: number }>
  ) {
    if (ticketPlaces.length === 0) {
      throw new ForbiddenError("Ticket places must be not empty");
    }
    if (ticketPlaces.length % 2 === 1) {
      throw new ForbiddenError("Ticket places must be even");
    }
    const orderedPlaces = ticketPlaces.sort(this.sortBySeat);
    const startPlace = orderedPlaces[0].column;
    for (let i = 1; i < orderedPlaces.length; i++) {
      const currentPlace = orderedPlaces[i].column;
      if (currentPlace - startPlace !== i) {
        throw new ForbiddenError("Ticket places must be sequential");
      }
    }
    return;
  }

  public async makeReservation(
    ticketPlaces: Array<{ raw: number; column: number }>,
    eventName: string,
    userId: string
  ) {
    this.validateReservation(ticketPlaces);
    const event = await this.eventRepository.findOne({
      where: {
        name: eventName,
      },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    ticketPlaces.forEach(async ({ raw, column }) => {
      const ticketExists = await this.ticketRepository.findOne({
        where: {
          raw,
          column,
          event,
        },
      });
      if (
        ticketExists &&
        (ticketExists.status === TicketStatus.sold ||
          ticketExists.expiry > new Date())
      ) {
        throw new ConflictError("Ticket already exists");
      }
      const expiryTime = 1000 * 60 * 15; //15 minutes
      const ticket = new Ticket({
        raw,
        column,
        event,
        user,
        status: TicketStatus.reserved,
        expiry: new Date(Date.now() + expiryTime),
      });
      await this.ticketRepository.save(ticket);
    });
  }

  public async getEventAvailability(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    const unavailableTickets = await this.ticketRepository
      .createQueryBuilder("Ticket")
      .select("Ticket.raw", "raw")
      .addSelect("Ticket.column", "column")
      .where("Ticket.event = :event", { event })
      .andWhere(new Brackets(qb => {
        qb.where("Ticket.expiry > :now", { now: new Date() })
        qb.orWhere("Ticket.status = :status", { status: TicketStatus.sold })
      }))
      .getMany();
    return unavailableTickets;
  }

  public async getUserAvailability(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const unavailableTickets = await this.ticketRepository
      .createQueryBuilder("Ticket")
      .select("Ticket.raw", "raw")
      .addSelect("Ticket.column", "column")
      .where("Ticket.user = :user", { user })
      .andWhere(new Brackets(qb => {
        qb.where("Ticket.expiry > :now", { now: new Date() })
        qb.orWhere("Ticket.status = :status", { status: TicketStatus.sold })
      }))
      .getMany();
    return unavailableTickets;
  }
}
