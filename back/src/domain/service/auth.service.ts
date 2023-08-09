import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRepoCollab } from '../IRepository/IRepoCollab';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('IRepoCollab') private readonly repoCollab: IRepoCollab,
  ) {}

  async signIn(username, pass) {
    const user = await this.repoCollab.findById(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
