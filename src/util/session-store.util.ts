import { Session } from './session.util';
import { User } from 'src/models/user.model';

class SessionStore {
  private sessions: { [key: string]: Session };

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }
}

export const sessionStore = new SessionStore();
