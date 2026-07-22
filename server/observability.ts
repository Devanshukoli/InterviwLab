import { Request, Response, NextFunction } from 'express';

// Define structures for internal trace monitoring to display in our preview
export interface TelemetrySpan {
  id: string;
  traceId: string;
  name: string;
  service: string;
  durationMs: number;
  status: 'OK' | 'ERROR';
  timestamp: string;
  attributes: Record<string, string | number | boolean>;
}

// Global simulation store for previewing traces in the UI
export const localTelemetryStore: TelemetrySpan[] = [
  {
    id: 'span-auth-01',
    traceId: 'trace-user-login-102',
    name: 'POST /api/auth/login',
    service: 'interviewops-api',
    durationMs: 42,
    status: 'OK',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    attributes: { 'http.status_code': 200, 'auth.role': 'user' }
  },
  {
    id: 'span-db-01',
    traceId: 'trace-user-login-102',
    name: 'SELECT FROM users',
    service: 'supabase-postgresql',
    durationMs: 12,
    status: 'OK',
    timestamp: new Date(Date.now() - 299900).toISOString(),
    attributes: { 'db.system': 'postgresql', 'db.name': 'interviewops' }
  },
  {
    id: 'span-resume-01',
    traceId: 'trace-resume-analysis-948',
    name: 'POST /api/interview/upload-resume',
    service: 'interviewops-api',
    durationMs: 1420,
    status: 'OK',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    attributes: { 'http.status_code': 200, 'file.size_bytes': 148200 }
  },
  {
    id: 'span-resume-agent-01',
    traceId: 'trace-resume-analysis-948',
    name: 'resume-agent:parseAndExtract',
    service: 'resume-agent',
    durationMs: 980,
    status: 'OK',
    timestamp: new Date(Date.now() - 119500).toISOString(),
    attributes: { 'ai.provider': 'gemini', 'ai.model': 'gemini-1.5-flash' }
  }
];

export function addLocalTrace(span: Omit<TelemetrySpan, 'id' | 'timestamp'>) {
  const newSpan: TelemetrySpan = {
    ...span,
    id: 'span-' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  localTelemetryStore.unshift(newSpan);
  if (localTelemetryStore.length > 50) {
    localTelemetryStore.pop();
  }
  return newSpan;
}

// OpenTelemetry Node SDK Initialization stub (Ready for future SigNoz import)
export const initOpenTelemetry = () => {
  console.log('📡 [OpenTelemetry] Initializing tracer provider...');
  console.log('📡 [OpenTelemetry] Exporter configured for SigNoz endpoint (placeholder)');
  console.log('📡 [OpenTelemetry] Tracing, Metrics, and Logger initialized.');
};

/**
 * Custom Tracer helper to make service instrumentation seamless
 */
export const tracer = {
  startSpan: (name: string, traceId?: string) => {
    const tid = traceId || 'trace-' + Math.random().toString(36).substr(2, 9);
    const startTime = Date.now();
    return {
      traceId: tid,
      end: (status: 'OK' | 'ERROR' = 'OK', attributes: Record<string, string | number | boolean> = {}) => {
        const duration = Date.now() - startTime;
        addLocalTrace({
          traceId: tid,
          name,
          service: 'interviewops-api',
          durationMs: duration,
          status,
          attributes
        });
      },
      recordException: (err: Error) => {
        const duration = Date.now() - startTime;
        addLocalTrace({
          traceId: tid,
          name,
          service: 'interviewops-api',
          durationMs: duration,
          status: 'ERROR',
          attributes: { 'error.message': err.message, 'error.stack': err.stack || '' }
        });
      }
    };
  }
};

/**
 * requestTracing middleware tracks incoming Express requests
 */
export function requestTracing(req: Request, res: Response, next: NextFunction) {
  const traceId = (req.headers['x-trace-id'] as string) || 'trace-' + Math.random().toString(36).substr(2, 9);
  req.headers['x-trace-id'] = traceId;
  
  const startTime = Date.now();
  
  // Attach end observer
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    const duration = Date.now() - startTime;
    const status = res.statusCode >= 400 ? 'ERROR' : 'OK';
    
    addLocalTrace({
      traceId,
      name: `${req.method} ${req.originalUrl || req.url}`,
      service: 'interviewops-api',
      durationMs: duration,
      status,
      attributes: {
        'http.status_code': res.statusCode,
        'http.method': req.method,
        'http.url': req.originalUrl || req.url,
        'http.user_agent': req.headers['user-agent'] || 'unknown'
      }
    });

    return originalEnd.call(this, chunk, encoding, callback);
  } as any;

  next();
}

/**
 * Context tracker helper
 */
export function traceContext(req: Request, res: Response, next: NextFunction) {
  // Simple context propagation middleware
  res.setHeader('X-Trace-Id', (req.headers['x-trace-id'] as string) || '');
  next();
}
