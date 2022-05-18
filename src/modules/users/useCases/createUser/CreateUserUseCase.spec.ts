import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    };

    const userAdded = await createUserUseCase.execute(user);
    expect(userAdded).toHaveProperty("id");
  });

  it("should not be able to create a new user with existent email", async () => {
    const user = {
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    };
    await createUserUseCase.execute(user);
    await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(
      CreateUserError
    );
  });
});
