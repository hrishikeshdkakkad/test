import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId: user.id,
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(
    user: User,
    skip: number = 0,
    limit: number = 100,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { userId: user.id },
      skip,
      take: limit,
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, user);

    Object.assign(transaction, updateTransactionDto);

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number, user: User): Promise<void> {
    const transaction = await this.findOne(id, user);
    await this.transactionRepository.remove(transaction);
  }

  async getStats(user: User): Promise<any> {
    const transactions = await this.findAll(user, 0, 10000);

    const totalIncome = transactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpense;

    return {
      total_income: totalIncome,
      total_expense: totalExpense,
      balance,
      transaction_count: transactions.length,
    };
  }
}
