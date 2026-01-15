const parseParams = (pattern, pathname) => {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) {
        return null;
    }
    const params = {};
    for (let i = 0; i < patternParts.length; i += 1) {
        const patternPart = patternParts[i];
        const pathPart = pathParts[i];
        if (patternPart.startsWith(':')) {
            params[patternPart.slice(1)] = decodeURIComponent(pathPart);
        } else if (patternPart !== pathPart) {
            return null;
        }
    }
    return params;
};

const createRouter = () => {
    const routes = [];
    const add = (method, pattern, handler) => {
        routes.push({ method, pattern, handler });
    };
    const match = (method, pathname) => {
        for (const route of routes) {
            if (route.method !== method) {
                continue;
            }
            const params = parseParams(route.pattern, pathname);
            if (params) {
                return { handler: route.handler, params };
            }
        }
        return null;
    };
    return { add, match };
};

module.exports = {
    createRouter,
};
