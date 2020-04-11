import { Session } from './session.util';
import { User } from 'src/models/user.model';

class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  findUserBySessionId(sessionId: string): User | undefined {
    const session = this.sessions[sessionId];
    const isSessionValid = session && session.isValid;
    return isSessionValid ? session.user : undefined;
  }
}

export const sessionStore = new SessionStore();
