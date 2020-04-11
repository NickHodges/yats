import { Session } from './session.util';
import { User } from 'src/models/user.model';

class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  findUserBySessionId(sessionId: string): User | undefined {
    const session = this.sessions[sessionId];
    return this.isSessionValid(sessionId) ? session.user : undefined;
  }

  isSessionValid(sessionId: string): boolean {
    const session: Session = this.sessions[sessionId];
    return session && session.isValid();
  }
}

export const sessionStore = new SessionStore();
