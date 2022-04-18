import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
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
    nullable: true,
  })
  userId?: string;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Event, (event) => event.tickets)
  event!: Event;

  @ManyToOne(() => Payment, (payment) => payment.tickets)
  payment!: Payment;
}


