import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { AdminActionType } from '../../../audit/domain/enums/admin-action-type.enum';

export class TakeModerationActionRequestDto {
  @IsUUID('4', { message: 'Report ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Report ID is required.' })
  reportId: string;

  @IsUUID('4', { message: 'Admin ID must be a valid UUID.' })
  @IsNotEmpty({ message: 'Admin ID is required.' })
  adminId: string;

  @IsEnum(AdminActionType, {
    message: `Action must be one of the following values: ${Object.values(
      AdminActionType,
    ).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Action is required.' })
  action: AdminActionType;

  @IsString({ message: 'Reason must be a string.' })
  @MaxLength(1000, {
    message: 'Reason cannot be longer than 1000 characters.',
  })
  @IsOptional()
  reason?: string;

  @ValidateIf((o) => o.action === AdminActionType.SUSPEND_USER)
  @IsNotEmpty({
    message: 'Suspension duration is required when suspending a user.',
  })
  @IsNumber({}, { message: 'Suspension duration must be a number.' })
  @Min(3600, {
    message: 'Suspension duration must be at least 1 hour (3600 seconds).',
  })
  suspensionDurationSeconds?: number;
}

export class TakeModerationActionResponseDto {
  success: boolean;
  message: string;
}