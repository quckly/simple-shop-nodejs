import { Request } from 'express';
import { QSession } from './QSession';

export interface QRequest extends Request {
    session: QSession;
    services: any;
}
