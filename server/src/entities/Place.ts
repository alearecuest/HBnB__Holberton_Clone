import {
	Entity,
	Column,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToMany,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Amenity } from "./Amenity";
import { Review } from "./Review";
import { PlacePhoto } from "./PlacePhoto";
import { Availability } from "./Availability";

@Entity("places")
export class Place extends BaseEntity {
	@Column({ type: "varchar", length: 100 })
	title!: string;

	@Column({ type: "text" })
	description!: string;

	@Column({ type: "float" })
	price!: number;

	@Column({ type: "float" })
	latitude!: number;

	@Column({ type: "float" })
	longitude!: number;

	@ManyToOne(() => User, (user) => user.places, { onDelete: "CASCADE" })
	owner!: User;

	@ManyToMany(() => Amenity, (amenity) => amenity.places)
	@JoinTable({
			name: "place_amenities",
			joinColumn: { name: "place_id", referencedColumnName: "id" },
			inverseJoinColumn: { name: "amenity_id", referencedColumnName: "id" },
	})
	amenities!: Amenity[];

	@OneToMany(() => Review, (review) => review.place)
	
	reviews!: Review[];

	@OneToMany(() => PlacePhoto, (photo) => photo.place, { cascade: true })
	photos!: PlacePhoto[];

	@OneToMany(() => Availability, (availability) => availability.place)
	availabilities!: Availability[];
}