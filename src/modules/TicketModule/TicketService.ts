import { Ticket, TicketStatus } from "./ticket";
import { Event } from "../EventModule/event";
import { User } from "../UserModule/user";
import { Payment, PaymentStatus } from "../PaymentModule/payment";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../../errors/HTTPError";

import { Brackets, Repository } from "typeorm";
import { AppDataSource } from "../../DataSource";
import moment from "moment-timezone";

export class TicketService {
  private ticketRepository: Repository<Ticket>;
  private eventRepository: Repository<Event>;
  private userRepository: Repository<User>;
  private paymentRepository: Repository<Payment>;

  constructor() {
    this.ticketRepository = AppDataSource.getRepository(Ticket);
    this.eventRepository = AppDataSource.getRepository(Event);
    this.userRepository = AppDataSource.getRepository(User);
    this.paymentRepository = AppDataSource.getRepository(Payment);
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

  private async checkTicketAvailability(ticketPlaces: Array<{ raw: number; column: number }>, event: Event) {
    for (let ticket of ticketPlaces) {
      const ticketExists = await this.ticketRepository.createQueryBuilder("Ticket")
        .where("Ticket.raw = :raw", { raw: ticket.raw })
        .andWhere("Ticket.column = :column", { column: ticket.column })
        .andWhere("Ticket.event = :event", { event: event.id })
        .getOne();

      if (ticketExists && 
          (ticketExists.payment.status === PaymentStatus.sold || 
          (ticketExists.payment.expiry && ticketExists.payment.expiry > new Date()))) {
        return false;
      }
    };
    return true;
  }
  
  public validateReservationPlaces(
    ticketPlaces: Array<{ raw: number; column: number }>,
    totalRaws: number,
    totalColumns: number
  ) {
    if (ticketPlaces.length === 0) {
      throw new ForbiddenError("Ticket places must be not empty");
    }
    if (ticketPlaces.length % 2 === 1) {
      throw new ForbiddenError("Ticket places must be even");
    }
    const orderedPlaces = ticketPlaces.sort(this.sortBySeat);
    if (orderedPlaces[0].raw > totalRaws) {
      throw new ForbiddenError(
        "Ticket places' raws must be less than total raws"
      );
    }
    const startPlace = orderedPlaces[0].column;
    const endPlace = orderedPlaces[orderedPlaces.length - 1];
    if (endPlace.column > totalColumns) {
      throw new ForbiddenError(
        "Ticket places' columns must be less than total columns"
      );
    }
    for (let i = 1; i < orderedPlaces.length; i++) {
      const currentPlace = orderedPlaces[i].column;
      if (currentPlace - startPlace !== i) {
        throw new ForbiddenError("Ticket places must be sequential");
      }
    }
    return;
  }

  public async makeReservation(ticketPlaces: Array<{ raw: number; column: number }>,  eventId: string,  userId: string) {
    //check event exists
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
      join: {
        alias: "Event",
        leftJoinAndSelect: {
          hall: "Event.hall",
        },
      },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    //check user exists
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    //validate ticket places meet requirements
    const {rawCount, columnCount} = await event.hall;
    this.validateReservationPlaces(ticketPlaces, rawCount, columnCount);

    const ticketsAvailable = await this.checkTicketAvailability(ticketPlaces, event);
    if (!ticketsAvailable) {
      throw new ConflictError("Tickets are not available");
    }

    const tickets: Array<Ticket> = await Promise.all(ticketPlaces.map(async (ticketPlace) => {
      return new Ticket({
        raw: ticketPlace.raw,
        column: ticketPlace.column,
        event,
        user
      });
    }
    ));
    const expiryTime = 15; // minutes
    const payment = new Payment({
      status: PaymentStatus.reserved,
      expiry: moment().add(expiryTime, 'minutes').toDate(),
      user,
      tickets,
    });
    await this.paymentRepository.save(payment);
    return payment.id;
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
      .where("Ticket.event = :event", { event: eventId })
      .leftJoinAndSelect("Ticket.payment", "Payment")
      .andWhere(
        new Brackets((qb) => {
          qb.where("Payment.expiry > :now", { now: moment().toISOString() });
          qb.orWhere("Payment.status = :status", { status: TicketStatus.sold });
        })
      )
      .select(['Ticket.raw', 'Ticket.column'])
      .getMany();

    return unavailableTickets;
  }

  public async getUserReservations(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const reservedTickets = await this.ticketRepository
      .createQueryBuilder("Ticket")
      .where("Ticket.user = :user", { user: userId })
      .leftJoinAndSelect("Ticket.payment", "Payment")
      .andWhere("Payment.expiry > :now", { now: moment().toISOString() })
      .select(['Ticket.raw', 'Ticket.column', 'Ticket.event'])
      .getMany();
    return reservedTickets;
  }
}
