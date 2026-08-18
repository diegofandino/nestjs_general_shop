import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

interface UserClient {
    [id: string]: {
        socket: Socket,
        user: User
    };
};

@Injectable()
export class MessagesWsService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService
    ) { }

    private clients: UserClient = {};

    registerClient(client: Socket, user: User) {
        this.clients[client.id] = {
            socket: client,
            user: user ?? null
        }
    };

    removeClient(client: Socket) {
        delete this.clients[client.id]
    };

    getConnectedClients(): string[] {
        return Object.keys(this.clients);
    }

    getCurrentName(id: string): string | null {
        const client = this.clients[id];
        return client?.user.fullName || null;
    }

    async checkJwtToken(client: Socket): Promise<User> {
        const token = client.handshake.headers['x-token'] as string;

        if (!token) throw new Error('No token provided');

        try {

            const payload = this.jwtService.verify(token);
            const user = await this.authService.searchUserById(payload.id);

            if (user) {
                const existingClient = this.getClientByUserId(user.id);
                console.log(existingClient)
                existingClient?.socket.disconnect();
            }

            if (!user) throw new UnauthorizedException('User not found');
            if (!user.isActive) throw new UnauthorizedException('User is not active');

            return user;
        } catch (error) {

            throw new UnauthorizedException('Invalid token');
        }
    }

    private getClientByUserId(userId: string) {
        return Object.values(this.clients).find(
            client => client.user.id === userId,
        );
    }

}
