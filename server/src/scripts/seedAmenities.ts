import { AppDataSource } from "../ormconfig";
import { Amenity } from "../entities/Amenity";

async function seedAmenities() {
  await AppDataSource.initialize();

  const amenities = [
    { name: "Wi-Fi", description: "Wireless internet", icon: "FaWifi" },
    { name: "TV", description: "HD television", icon: "FaTv" },
    { name: "Kitchen", description: "Equipped kitchen", icon: "GiCookingPot" },
    { name: "Air conditioning", description: "Air conditioning available", icon: "MdOutlineAcUnit" },
    { name: "Parking", description: "Parking spot", icon: "FaParking" },
    { name: "Pets allowed", description: "Pets are welcome", icon: "MdPets" },
    { name: "Pool", description: "Swimming pool", icon: "FaSwimmer" },
    { name: "Barbecue", description: "Barbecue grill available", icon: "GiBarbecue" }
  ];

  for (const data of amenities) {
    const exists = await AppDataSource.manager.findOneBy(Amenity, { name: data.name });
    if (!exists) {
      const amenity = AppDataSource.manager.create(Amenity, data);
      await AppDataSource.manager.save(amenity);
      console.log(`Inserted amenity: ${data.name}`);
    } else {
      exists.icon = data.icon;
      exists.description = data.description;
      await AppDataSource.manager.save(exists);
      console.log(`Amenity updated: ${data.name}`);
    }
  }

  await AppDataSource.destroy();
  process.exit(0);
}

seedAmenities().catch(e => {
  console.error(e);
  process.exit(1);
});