import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to return an user profile", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    });

    const userProfile = await showUserProfileUseCase.execute(`${user.id}`);

    expect(userProfile).toHaveProperty("email");
  });
});
