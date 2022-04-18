import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Column, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Ticket } from "../TicketModule/ticket";
import { User } from "../UserModule/user";

export enum PaymentStatus {
  reserved = "reserved",
  sold = "sold",
}
@Entity()
export class Payment {
  constructor(payment: Partial<Payment>) {
    Object.assign(this, payment);
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column( {
    type: "enum",
    enum: PaymentStatus
  })
  status!: PaymentStatus;

  @Column({ type: 'timestamptz', nullable: true })
  expiry?: Date | null;

  @Column({
    nullable: true,
  })
  userId?: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Ticket, (ticket) => ticket.payment, {cascade: true})
  tickets!: Ticket[];
}
