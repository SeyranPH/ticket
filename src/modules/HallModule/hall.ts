import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { City } from "../CityModule/city";
import { Event } from "../EventModule/event";

@Entity()
export class Hall {
  constructor(hall: Partial<Hall>) {
    Object.assign(this, hall);
  }
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  rawCount!: number;

  @Column()
  columnCount!: number;

  @ManyToOne(() => City, (city) => city.halls)
  city!: City;

  @OneToMany(() => Event, (event) => event.hall)
  events!: Event[];
}
