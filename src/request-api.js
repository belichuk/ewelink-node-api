const https = require('https');

module.exports = class ApiRequest {
    constructor()
    {
        this.connectionOpts = {
            agent: https.globalAgent,
            timeout: 10000,
            followRedirect: false
        };
    }

    setConnection(options = {}) {
        Object.assign(this.connectionOpts, options);

        return this;
    }

    getHostname() {
        return 'cn-api.coolkit.cc';
    }

    async request(path, {method = 'GET', headers = {}, body = ''}) {
        const {agent, timeout, followRedirect} = this.connectionOpts;

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: this.getHostname(),
                port: 8080,
                path: path,
                method: method,
                agent: agent,
                timeout: timeout,
                followRedirect: followRedirect,
                headers: Object.assign({
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }, headers)
            }, (res) => {
                let data = '';

                res.on('data', buff => {data += buff.toString()});

                res.on('end', () => {
                    try {
                        let response = JSON.parse(data);
                        resolve(response);
                    } catch(e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.write(body);
            req.end();
        });
    }
};