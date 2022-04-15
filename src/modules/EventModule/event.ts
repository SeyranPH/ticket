import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Hall } from "../HallModule/hall";
import { Ticket } from "../TicketModule/ticket";

@Entity()
export class Event {
  [x: string]: any;
  constructor(event: Partial<Event>) {
    Object.assign(this, event);
  }
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Hall, (hall) => hall.events)
  hall!: Hall;

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets!: Ticket[];
}
