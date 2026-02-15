import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";

@Entity("availabilities")
export class Availability extends BaseEntity {
  @Column({ type: "date" })
  date!: string;

  @Column({ default: true })
  blocked!: boolean;

  @ManyToOne(() => Place, (place) => place.availabilities, { onDelete: "CASCADE" })
  place!: Place;
}