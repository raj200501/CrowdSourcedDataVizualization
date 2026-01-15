const path = require('path');
const { createDataStore } = require('./storage/dataStore');
const config = require('./config/config');
const { createLogger } = require('./utils/logger');
const { createRouter } = require('./utils/router');
const { createCollaborationHub } = require('./utils/collaborationHub');
const { parseJsonBody, sendJson, sendError, serveStatic, sendText } = require('./utils/http');
const dataService = require('./services/dataService');
const userService = require('./services/userService');

const createApp = async (overrides = {}) => {
    const resolvedConfig = { ...config, ...overrides };
    const store = await createDataStore({ dataDir: resolvedConfig.dataDir });
    const logger = createLogger(resolvedConfig.logLevel);
    const router = createRouter();
    const collaborationHub = createCollaborationHub();

    store.events.on('dataset:created', (dataset) => collaborationHub.broadcast('dataset:created', dataset));
    store.events.on('dataset:updated', (dataset) => collaborationHub.broadcast('dataset:updated', dataset));
    store.events.on('annotation:created', (annotation) => collaborationHub.broadcast('annotation:created', annotation));

    const context = { store, config: resolvedConfig, logger, collaborationHub };

    router.add('GET', '/api/health', async () => ({
        status: 200,
        body: { status: 'ok', timestamp: new Date().toISOString() },
    }));

    router.add('GET', '/api/data', dataService.listDatasets);
    router.add('POST', '/api/data/upload', dataService.uploadData);
    router.add('GET', '/api/data/:id', dataService.getDataset);
    router.add('POST', '/api/data/:id/clean', dataService.cleanDataset);
    router.add('POST', '/api/data/:id/annotations', dataService.addAnnotation);
    router.add('GET', '/api/data/:id/visualization', dataService.visualizationSummary);

    router.add('POST', '/api/users/register', userService.registerUser);
    router.add('POST', '/api/users/login', userService.loginUser);

    const handleApi = async (req, res, pathname) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (pathname === '/api/collaboration/stream' && req.method === 'GET') {
            collaborationHub.addClient(res);
            return;
        }

        const match = router.match(req.method, pathname);
        if (!match) {
            sendJson(res, 404, { message: 'Not found' });
            return;
        }

        try {
            const body = ['POST', 'PUT', 'PATCH'].includes(req.method)
                ? await parseJsonBody(req, resolvedConfig.requestBodyLimit)
                : {};
            const result = await match.handler({
                store,
                params: match.params,
                body,
            });
            sendJson(res, result.status, result.body);
        } catch (error) {
            sendError(res, error);
        }
    };

    const serveFrontend = async (req, res, pathname) => {
        const frontendRoot = path.join(resolvedConfig.repoRoot, 'frontend');
        if (pathname.startsWith('/services/')) {
            const filePath = path.join(frontendRoot, pathname);
            return serveStatic(res, filePath);
        }

        const publicRoot = path.join(frontendRoot, 'public');
        const targetPath = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.join(publicRoot, targetPath);
        if (await serveStatic(res, filePath)) {
            return true;
        }

        return false;
    };

    const handler = async (req, res) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        const startedAt = Date.now();

        try {
            if (pathname.startsWith('/api/')) {
                await handleApi(req, res, pathname);
            } else {
                const served = await serveFrontend(req, res, pathname);
                if (!served) {
                    sendText(res, 404, 'Not found');
                }
            }
        } catch (error) {
            sendError(res, error);
        } finally {
            const durationMs = Date.now() - startedAt;
            logger.info(`${req.method} ${pathname} ${res.statusCode || 200} ${durationMs}ms`);
        }
    };

    return {
        handler,
        context,
    };
};

module.exports = { createApp };
