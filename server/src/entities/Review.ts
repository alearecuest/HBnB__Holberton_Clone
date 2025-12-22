import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Place } from "./Place";

@Entity("reviews")
export class Review extends BaseEntity {
    @Column({ type: "int" })
    rating!: number;

    @Column({ type: "varchar", length: 500 })
    comment!: string;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
    user!: User;

    @Column()
    placeId!: string;

    @ManyToOne(() => Place, (place) => place.reviews, { onDelete: "CASCADE" })
    @JoinColumn({ name: "placeId" }) 
    place!: Place;
}