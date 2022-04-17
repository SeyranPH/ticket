import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
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

  @Column()
  password!: string;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets!: Ticket[];
}
