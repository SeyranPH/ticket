import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Payment } from "../PaymentModule/payment";
import { Ticket } from "../TicketModule/ticket";

@Entity()
export class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  username!: string;

  @Column({select: false})
  password!: string;
  
  @OneToMany(() => Payment, (payment) => payment.user, {cascade: true})
  payments!: Payment[];
}
