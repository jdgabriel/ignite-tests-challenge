import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it("should be able to list all balances.", async () => {
    const user: User = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password_test",
    });

    const statement = await statementRepository.create({
      user_id: `${user.id}`,
      type: OperationType.DEPOSIT,
      amount: 150,
      description: "Beer",
    });

    const statement2 = await statementRepository.create({
      user_id: `${user.id}`,
      type: OperationType.DEPOSIT,
      amount: 150,
      description: "Beer",
    });

    const statement3 = await statementRepository.create({
      user_id: `${user.id}`,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Beer",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: `${user.id}`,
    });

    expect(balance).toStrictEqual({
      statement: expect.arrayContaining([statement, statement2, statement3]),
      balance: 250,
    });
  });

  it("should not be able to list a balance with non existing user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "uset_not_found",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
