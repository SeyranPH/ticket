import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Event } from "../EventModule/event";
import { Payment } from "../PaymentModule/payment";

enum TicketStatus {
    available = "available",
    reserved = "reserved",
    sold = "sold",
}

@Entity()
export class Ticket {
  constructor(ticket: Partial<Ticket>) {
    Object.assign(this, ticket);
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  raw!: string;

  @Column()
  column!: number;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.available,
  })
  status!: TicketStatus;

  @ManyToOne(() => Event, (event) => event.tickets)
  event!: Event;

  @OneToOne(() => Payment, (payment) => payment.ticket)
  payment!: Payment;
}


