import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementRepository
    );
  });

  it("should be able to create a new statement.", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    });

    const statement = await createStatementUseCase.execute({
      user_id: `${user.id}`,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "farra",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement with non existing user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "not-found-user",
        type: OperationType.DEPOSIT,
        amount: 50000,
        description: "Salary",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with insufficient founds", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: `${user.id}`,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "PC Gamer",
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
