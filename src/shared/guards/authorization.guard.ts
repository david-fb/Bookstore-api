import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['authorization'];
    const expectedApiKey = this.configService.get<string>('API_KEY');

    if (!apiKeyHeader || apiKeyHeader !== expectedApiKey) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }

    return true;
  }
}
