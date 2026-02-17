import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";
import { hashPassword } from "../utils/password";

if (process.env.NODE_ENV !== "development") {
    console.error("DO NOT run this seed in production or non-development environments.");
    process.exit(1);
}

async function seed() {
  await AppDataSource.initialize();

  const existing = await AppDataSource.getRepository(User).findOne({ where: { email: "user@demo.com" } });
  if (existing) {
      console.log("The demo user already exists; nothing is created.");
      process.exit(0);
  }

  const user = new User();
  user.firstName = "Demo";
  user.lastName = "User";
  user.email = "user@demo.com";
  user.password = await hashPassword("test1234");
  user.isAdmin = true;
  await AppDataSource.getRepository(User).save(user);

  console.log("Demo user created ONLY in development: user@demo.com / test1234");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});