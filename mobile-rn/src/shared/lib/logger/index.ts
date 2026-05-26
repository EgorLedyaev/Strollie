// Lightweight pluggable logger (FSD: shared/lib/logger)
// Can be later wired to Sentry/Bugsnag etc.

export interface LogContext {
	// Используем unknown вместо any для повышения строгости
	[k: string]: unknown;
}

interface Transport {
	error: (msg: string, ctx?: LogContext) => void;
	warn: (msg: string, ctx?: LogContext) => void;
	info: (msg: string, ctx?: LogContext) => void;
	debug: (msg: string, ctx?: LogContext) => void;
}

let transport: Transport = {
	error: (m, c) => console.error(`[ERR ] ${m}`, c ?? ''),
	warn: (m, c) => console.warn(`[WARN] ${m}`, c ?? ''),
	info: (m, c) => console.log(`[INFO] ${m}`, c ?? ''),
	debug: (m, c) => {
		if (__DEV__) console.log(`[DBG ] ${m}`, c ?? '');
	},
};

let globalContext: LogContext = {};
let inited = false;

export interface LoggerConfig {
	level?: 'debug' | 'info' | 'warn' | 'error';
	defaultContext?: LogContext;
	customTransport?: Partial<Transport>;
}

const levelOrder: Record<string, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
};
let currentLevel: keyof typeof levelOrder = 'debug';

export function initLogger(cfg: LoggerConfig = {}) {
	if (inited) return;
	if (cfg.customTransport) {
		transport = { ...transport, ...cfg.customTransport };
	}
	if (cfg.defaultContext) globalContext = cfg.defaultContext;
	if (cfg.level) currentLevel = cfg.level;
	inited = true;
}

function shouldLog(l: keyof typeof levelOrder) {
	return levelOrder[l] >= levelOrder[currentLevel];
}

function mergeCtx(ctx?: LogContext): LogContext | undefined {
	if (!ctx) return globalContext;
	return { ...globalContext, ...ctx };
}

export function logError(err: unknown, ctx?: LogContext) {
	const message = (err as { message?: string })?.message || String(err);
	const stack = (err as { stack?: string })?.stack;
	const context = mergeCtx({ ...ctx, stack });
	if (shouldLog('error')) transport.error(message, context);
}
export function logWarn(message: string, ctx?: LogContext) {
	if (shouldLog('warn')) transport.warn(message, mergeCtx(ctx));
}
export function logInfo(message: string, ctx?: LogContext) {
	if (shouldLog('info')) transport.info(message, mergeCtx(ctx));
}
export function logDebug(message: string, ctx?: LogContext) {
	if (shouldLog('debug')) transport.debug(message, mergeCtx(ctx));
}

// Helper to bind feature context
export function bindLogger(feature: string) {
	return {
		error: (e: unknown, ctx?: LogContext) =>
			logError(e, { feature, ...ctx }),
		info: (m: string, ctx?: LogContext) => logInfo(m, { feature, ...ctx }),
		warn: (m: string, ctx?: LogContext) => logWarn(m, { feature, ...ctx }),
		debug: (m: string, ctx?: LogContext) =>
			logDebug(m, { feature, ...ctx }),
	};
}
