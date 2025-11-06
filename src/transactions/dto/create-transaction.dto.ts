import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['income', 'expense'])
  transactionType: string;
}
