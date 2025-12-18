import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Place } from "./Place";
import { Review } from "./Review";

@Entity("users")
export class User extends BaseEntity {
    @Column({ type: "varchar", length: 100 })
    firstName!: string;

    @Column({ type: "varchar", length: 100 })
    lastName!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: false })
    isAdmin!: boolean;

    @OneToMany(() => Place, (place) => place.owner)
    places!: Place[];

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];
}