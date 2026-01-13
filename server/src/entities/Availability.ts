import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";

@Entity("availabilities")
export class Availability extends BaseEntity {
  @Column({ type: "date" })
  from!: string;

  @Column({ type: "date" })
  to!: string;

  @ManyToOne(() => Place, (place) => place.availabilities, { onDelete: "CASCADE" })
  place!: Place;
}