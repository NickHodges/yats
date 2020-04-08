import * as crypto from 'crypto';
import * as util from 'util';

export const randomBytes = util.promisify(crypto.randomBytes);
