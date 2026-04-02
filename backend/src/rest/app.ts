import express, { Request, Response } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from '../config/config';
import {
  corsOptions,
  securityHeaders,
  sanitizeInput,
} from '../middleware/security';
import { errorHandler } from '../middleware/errorHandler';
import { asyncHandler } from '../utils/asyncHandler';
import { initEmailService } from '../utils/email';

import authRoutes from '../routes/auth';
import bookRoutes from '../routes/books';
import categoryRoutes from '../routes/categories';

export const restApp = express();

initEmailService();

restApp.use(securityHeaders);
restApp.use(corsOptions);

restApp.use(express.json({ limit: '10mb' }));
restApp.use(express.urlencoded({ limit: '10mb', extended: true }));

restApp.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: config.mongoUri,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    name: 'library.sid',
  }),
);

restApp.use(sanitizeInput);

restApp.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

restApp.use('/api/auth', authRoutes);
restApp.use('/api/books', bookRoutes);
restApp.use('/api/categories', categoryRoutes);

restApp.use(
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      error: 'Маршрут не знайдено',
    });
  }),
);

restApp.use(errorHandler);

export default restApp;
