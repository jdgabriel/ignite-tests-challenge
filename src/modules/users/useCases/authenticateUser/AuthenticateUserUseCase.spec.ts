import authConfig from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    authConfig.jwt.secret = "secret_pass";
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    });

    const authUser = await authenticateUseCase.execute({
      email: user.email,
      password: "password_test",
    });

    expect(authUser).toHaveProperty("token");
  });
});
