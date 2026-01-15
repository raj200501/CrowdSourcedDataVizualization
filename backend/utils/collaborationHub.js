const createCollaborationHub = () => {
    const clients = new Set();

    const addClient = (res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });
        res.write('\n');
        clients.add(res);
        res.on('close', () => {
            clients.delete(res);
        });
    };

    const broadcast = (event, payload) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
        for (const client of clients) {
            client.write(message);
        }
    };

    return {
        addClient,
        broadcast,
        clientCount: () => clients.size,
    };
};

module.exports = { createCollaborationHub };
