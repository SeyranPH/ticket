import { Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Ticket } from "../TicketModule/ticket";

@Entity()
export class Payment {
  constructor(payment: Partial<Payment>) {
    Object.assign(this, payment);
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Ticket, (ticket) => ticket.payment)
  ticket!: Payment;
}
