import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Place } from "./Place";

@Entity("reservations")
export class Reservation extends BaseEntity {
  @Column({ type: "date" })
  from!: string;

  @Column({ type: "date" })
  to!: string;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Place, { eager: true, onDelete: "CASCADE" })
  place!: Place;
}