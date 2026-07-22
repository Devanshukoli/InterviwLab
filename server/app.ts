import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestTracing, traceContext } from './observability';
import { authenticateJWT } from './middleware/jwt.middleware';
import { apiRouter } from './api';
import { notFoundHandler, globalErrorHandler } from './middleware/error_handling';

export const app = express();

// Security Middlewares using Helmet and CORS
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Trace-Id'],
}));

// Enable JSON parser and text parser
app.use(express.json());
app.use(express.text());

// Attach OpenTelemetry Tracing
app.use(requestTracing);
app.use(traceContext);

// Attach Application-wide JWT Authentication Middleware
app.use(authenticateJWT);

// Mount Master Modular API Router under /api
app.use('/api', apiRouter);

// Catch-all 404 handler for unmatched API routes
app.use('/api/*', notFoundHandler);

// Centralized Application-Wide Error Handler Middleware
app.use(globalErrorHandler);
