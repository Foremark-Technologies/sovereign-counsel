import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  @IsNotEmpty()
  matterId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @IsNumber()
  @Min(0)
  hourlyRate!: number;

  @IsDateString()
  billableDate!: string;
}
