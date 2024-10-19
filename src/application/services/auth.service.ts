import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserJsonRepository } from '../../infrastructure/persistence/user.json.repository';
import { User } from '../../models/user/user.interface';

export class AuthService {
  constructor(private userRepository: UserJsonRepository) {}

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return this.generateToken(user);
  }

  async register(userData: Partial<User>): Promise<User> {
    if (!userData.username || !userData.password || !userData.email) {
      throw new Error('Username, password, and email are required');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: Omit<User, 'id'> = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      isAdmin: false 
    };
    
    return await this.userRepository.save(newUser);
  }

  async resetPassword(username: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
    return true;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  }

  verifyToken(token: string): User | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as User;
    } catch (error) {
      return null;
    }
  }
}