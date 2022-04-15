import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Hall } from "../HallModule/hall";

@Entity()
export class City {
  constructor(city: Partial<City>) {
    Object.assign(this, city);
  }
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name!: string;

  @OneToMany(() => Hall, (hall) => hall.city)
  halls!: Hall[];
}
