const APP_ID = 'YzfeftUVcZ6twZw1OoVKPRFYTrGEg01Q';
const APP_SECRET = '4G91qSoboqYO4Y0XJ0LPPKIsq8reHdfa';
const RequestApi = require('./request-api');
const assert = require('assert').strict;
const querystring = require('querystring');

const crypto = require("crypto");
const nonce = n => crypto.randomBytes(n).toString('hex');
const authSign = data => crypto.createHmac('sha256', APP_SECRET).update(data).digest('base64');

module.exports = class EwelinkApi extends RequestApi {
    constructor({...args})
    {
        super(args);

        const {login, password, region} = args;

        assert.ok(login, "Invalid login credentials");
        assert.ok(password, "Password can't be blank");

        const email = ~login.indexOf('@') ? login : null;
        const phoneNumber = !email ? login : null;

        this.region = region || 'eu';

        this.oAuth = {
            email: email,
            phoneNumber: phoneNumber,
            password: password
        };
    }

    async apiRequest(urlPath, options = {}) {
        debugger;
        const {oAuth} = this;

        if (oAuth.at) {
            return this.request(urlPath, {
                options,
                headers: {'Authorization': `Bearer ${oAuth.at}`}
            });
        }

        const body = JSON.stringify({
            ...oAuth,
            appid: APP_ID,
            ts: Math.floor(new Date() / 1000),
            version: 8,
            nonce: nonce(4),
        });

        return this.request('/api/user/login', {
            body: body,
            method: 'POST',
            headers: {'Authorization': `Sign ${authSign(body)}`}
        }).then((oAuth) => {
            const {at, region, rt, user} = oAuth;
            debugger;
            if (!at) {
                throw new Error('No AuthToken value');
            }

            this.region = region || this.region;
            this.oAuth = {at, rt, user};

            return this.apiRequest(urlPath, options);
        });
    }

    getHostname() {
        return `${this.region}-api.coolkit.cc`;
    }

    async getDevices() {
        const qs = querystring.stringify({
            lang: 'en',
            appid: APP_ID,
            ts: Math.floor(new Date() / 1000),
            version: 8,
            getTags: 1
        });

        return this.apiRequest(`/api/user/device?${qs}`);
    }

    async getDevice(deviceId) {
        const qs = querystring.stringify({
            deviceid: deviceId,
            lang: 'en',
            appid: APP_ID,
            ts: Math.floor(new Date() / 1000),
            version: 8,
            getTags: 1
        });

        return this.apiRequest(`/api/user/device/${deviceId}?${qs}`);
    }
};