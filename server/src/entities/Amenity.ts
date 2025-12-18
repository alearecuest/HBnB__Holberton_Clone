import { Entity, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";

@Entity("amenities")
export class Amenity extends BaseEntity {
    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 255 })
    description!: string;

    @ManyToMany(() => Place, (place) => place.amenities)
    places!: Place[];
}