const WebSocket = require('ws');

module.exports = function(callback, {url, auth, heartbeat = 60000, ...options}) {
    const ws = new WebSocket(url, options);
    const on = ws.addListener.bind(ws);
    const off = ws.removeListener.bind(ws);
    const noop = () => {};

    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping(noop);
        } else if (ws.readyState !== WebSocket.CONNECTING) {
            clearInterval(interval);
        }
    }, heartbeat);

    on('open', () => ws.send(JSON.stringify(auth)));
    on('close', (...data) => clearInterval(interval));

    on('message', data => {
        try {
            const message = JSON.parse(data);

            callback(message);
        } catch (e) {
            ws.emit('error', e);
        }
    });
    
    const getWebSocket = () => ws;
    const dispose = () => ws.terminate();
    const isDisposed = () => ws.readyState === WebSocket.CLOSED;

    return {on, off, getWebSocket, isDisposed, dispose};
}