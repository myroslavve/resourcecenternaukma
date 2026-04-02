import express, { Request, Response } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createHandler } from 'graphql-http/lib/use/express';
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
import { graphqlRoot, graphqlSchema } from './schema';

export const graphqlApp = express();

initEmailService();

graphqlApp.use(securityHeaders);
graphqlApp.use(corsOptions);

graphqlApp.use(express.json({ limit: '10mb' }));
graphqlApp.use(express.urlencoded({ limit: '10mb', extended: true }));

graphqlApp.use(
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

graphqlApp.use(sanitizeInput);

graphqlApp.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

graphqlApp.use('/api/auth', authRoutes);

graphqlApp.all(
  '/api/graphql',
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlRoot,
    context: (request) => {
      const req = request.raw as Request;
      return {
        userId: req.session?.userId,
        user: req.session?.user,
      };
    },
  }),
);

graphqlApp.use(
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      error: 'Маршрут не знайдено',
    });
  }),
);

graphqlApp.use(errorHandler);

export default graphqlApp;
