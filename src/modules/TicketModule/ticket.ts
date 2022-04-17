import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Event } from "../EventModule/event";
import { Payment } from "../PaymentModule/payment";
import { User } from "../UserModule/user";

export enum TicketStatus {
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
  raw!: number;

  @Column()
  column!: number;

  @Column({
    type: "enum",
    enum: TicketStatus
  })
  status!: TicketStatus;

  @Column({
    type: "timestamp"
  })
  expiry!: Date;

  @ManyToOne(() => User, (user) => user.tickets)
  user!: User;

  @ManyToOne(() => Event, (event) => event.tickets)
  event!: Event;

  @OneToOne(() => Payment, (payment) => payment.ticket)
  payment!: Payment;
}


