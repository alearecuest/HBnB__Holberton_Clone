import { AppDataSource } from "../ormconfig";
import { Place } from "../entities/Place";
import { PlacePhoto } from "../entities/PlacePhoto";
import { User } from "../entities/User";

const demoPhotos = [
  "/uploads/your-photo1.jpg", 
  "/uploads/your-photo2.jpg",
  "/uploads/your-photo3.jpg",
  "/uploads/your-photo4.jpg",
  "/uploads/your-photo5.jpg",
];

async function seed() {
  await AppDataSource.initialize();

  let user = await AppDataSource.manager.findOne(User, { where: { email: "demo@realestate.com" } });
  if (!user) {
    user = AppDataSource.manager.create(User, {
      email: "demo@realestate.com",
      password: "123456",
      firstName: "Demo",
      lastName: "Agent"
    });
    await AppDataSource.manager.save(user);
  }

  for (let i = 0; i < 3; i++) {
    const pl = AppDataSource.manager.create(Place, {
      title: ["Cozy Apartment Downtown", "Modern Studio with Balcony", "Luxury Penthouse with View"][i],
      description: [
        "Bright apartment conveniently located near everything.",
        "Studio with all amenities and great neighborhood.",
        "High-end penthouse with panoramic city view."
      ][i],
      price: 120 + i * 50,
      latitude: -34.9 + Math.random() * 0.2,
      longitude: -56.1 + Math.random() * 0.2,
      owner: user
    });
    const place = await AppDataSource.manager.save(pl);
    for (let j = 0; j <= i + 2; j++) {
      const photo = AppDataSource.manager.create(PlacePhoto, {
        url: demoPhotos[j % demoPhotos.length],
        place
      });
      await AppDataSource.manager.save(photo);
    }
  }
  console.log("Demo places seeded!");
  process.exit();
}

seed();