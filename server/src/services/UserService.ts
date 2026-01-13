import { userRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import { hashPassword, comparePassword } from "../utils/password";

export class UserService {
    static async create(userData: Partial<User>): Promise<User> {
        if (!userData.password) throw new Error("Password required");
        userData.password = await hashPassword(userData.password);

        const user = userRepository.create(userData);
        return userRepository.save(user);
    }

    static async findByEmail(email: string): Promise<User | null> {
        return userRepository.findOneBy({ email });
    }

    static async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        console.log("USER FOUND:", user);
        if (!user) return null;
        const valid = await comparePassword(password, user.password);
        console.log("PASSWORD VALID?", valid);
        return valid ? user : null;
    }
}