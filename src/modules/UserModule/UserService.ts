import { User } from "./user";
import { Repository } from "typeorm";
import { AppDataSource } from "../../DataSource";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async create({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User> {
    const user = new User({ username, password, tickets: [] });
    return await this.userRepository.save(user);
  }
}
