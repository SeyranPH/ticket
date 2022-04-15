import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
