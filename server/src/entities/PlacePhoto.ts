import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";

@Entity("place_photos")
export class PlacePhoto extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  url!: string;

  @ManyToOne(() => Place, (place) => place.photos, { onDelete: "CASCADE" })
  place!: Place;
}