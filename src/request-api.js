const https = require('https');

module.exports = class ApiRequest {
    constructor(options)
    {
        this.connOptions = {
            agent: https.globalAgent,
            timeout: 10000,
            followRedirect: false,
            ...options
        };
    }

    getApiUrl() {
        return 'cn-api.coolkit.cc';
    }

    async request(path, {method = 'GET', headers = {}, body = ''}) {
        const {agent, timeout, followRedirect} = this.connOptions;

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: this.getApiUrl(),
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

                        if (response.error) {
                            return reject(response);
                        }

                        return resolve(response);
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