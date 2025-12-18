import { userRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

export class UserService {
    static async create(userData: Partial<User>): Promise<User> {
        const user = userRepository.create(userData);
        return userRepository.save(user);
    }

    static async findByEmail(email: string): Promise<User | null> {
        return userRepository.findOneBy({ email });
    }

}