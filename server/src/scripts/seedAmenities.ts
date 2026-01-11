import { AppDataSource } from "../../ormconfig";
import { Amenity } from "../entities/Amenity";

async function seedAmenities() {
  await AppDataSource.initialize();

  const amenities = [
    { name: "Wi-Fi", description: "Wireless internet" },
    { name: "TV", description: "HD television" },
    { name: "Kitchen", description: "Equipped kitchen" },
    { name: "Air conditioning", description: "AC available" },
    { name: "Parking", description: "Parking spot" },
    { name: "Pets allowed", description: "Pets are welcome" },
    { name: "Pool", description: "Swimming pool" },
  ];

  for (const data of amenities) {
    const exists = await AppDataSource.manager.findOneBy(Amenity, { name: data.name });
    if (!exists) {
      const amenity = AppDataSource.manager.create(Amenity, data);
      await AppDataSource.manager.save(amenity);
      console.log(`Inserted amenity: ${data.name}`);
    } else {
      console.log(`Amenity already exists: ${data.name}`);
    }
  }

  await AppDataSource.destroy();
  process.exit(0);
}

seedAmenities().catch(e => {
  console.error(e);
  process.exit(1);
});