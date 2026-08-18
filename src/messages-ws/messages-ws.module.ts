import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [MessagesWsGateway, MessagesWsService, AuthService],
  imports: [AuthModule]
})
export class MessagesWsModule { }
