import { Moment } from 'moment';
import { User } from 'src/models/user.model';
import moment = require('moment');

export class Session {
  static readonly VALIDITY_IN_MINUTES = 2;
  validUntil: Moment;

  constructor(public sessionId: string, public user: User) {
    this.validUntil = moment().add(Session.VALIDITY_IN_MINUTES, 'minutes');
  }

  isValid(): boolean {
    return moment().diff(this.validUntil, 'minutes') <= 0;
  }
}
