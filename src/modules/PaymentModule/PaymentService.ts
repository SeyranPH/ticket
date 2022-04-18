import { Ticket, TicketStatus } from "../TicketModule/ticket";
import { User } from "../UserModule/user";
import { Payment, PaymentStatus } from "./payment";
import { TicketService } from "../TicketModule/TicketService";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../../errors/HTTPError";

import { Brackets, Repository } from "typeorm";
import { AppDataSource } from "../../DataSource";

export class PaymentService {
  private ticketRepository: Repository<Ticket>;
  private paymentRepository: Repository<Payment>;
  private userRepository: Repository<User>;

  constructor() {
    this.ticketRepository = AppDataSource.getRepository(Ticket);
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.userRepository = AppDataSource.getRepository(User);
  }

  //Payment simulation for testing purposes, change failure rate if needed
  private async simulatePurchase(): Promise<boolean>{
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const failureRate = 0.5;
    if (Math.random() < failureRate) {
      throw new ForbiddenError("Simulated payment error");
    }
    return true;
  }

  public async purchaseTickets(
    paymentId: string,
    userId: string
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const payment = await this.paymentRepository.createQueryBuilder("payment")
      .leftJoinAndSelect("payment.tickets", "ticket")
      .leftJoinAndSelect("payment.user", "user")
      .where("payment.id = :paymentId", { paymentId })
      .andWhere("user.id = :userId", { userId })
      .getOne();

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }
    if (payment.status === PaymentStatus.sold) {
      throw new ConflictError("Payment already used");
    }
    if (payment.expiry && payment.expiry < new Date()) {
      throw new ConflictError("Payment expired");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.simulatePurchase();
      await queryRunner.manager.update(Payment, payment.id, {
        status: PaymentStatus.sold,
        expiry: null
      });
      await queryRunner.commitTransaction();
      return payment.tickets;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
