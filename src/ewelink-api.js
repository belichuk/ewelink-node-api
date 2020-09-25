const APP_ID = 'YzfeftUVcZ6twZw1OoVKPRFYTrGEg01Q';
const APP_SECRET = '4G91qSoboqYO4Y0XJ0LPPKIsq8reHdfa';
const RequestApi = require('./request-api');
const getDeviceType = require('./helpers/device-type');
const assert = require('assert').strict;
const querystring = require('querystring');

const crypto = require("crypto");
const nonce = n => crypto.randomBytes(n).toString('hex');
const authSign = data => crypto.createHmac('sha256', APP_SECRET).update(data).digest('base64');

module.exports = class EwelinkApi extends RequestApi {
    constructor({...args})
    {
        super();

        const {login, password, at, region} = args;

        this.region = region || 'eu';

        if (at) {
            this.oAuth = {at};
        } else {
            assert.ok(login, "Invalid login credentials");
            assert.ok(password, "Password can't be blank");

            const email = ~login.indexOf('@') ? login : null;

            this.oAuth = {
                email: email,
                phoneNumber: !email ? login : null,
                password: password
            };
        }
    }

    async apiRequest(urlPath, options = {}) {
        const {oAuth} = this;

        if (oAuth.at) {
            return this.request(urlPath, {
                ...options,
                headers: {'Authorization': `Bearer ${oAuth.at}`}
            });
        }

        const body = JSON.stringify({
            ...oAuth,
            appid: APP_ID,
            ts: Math.floor(new Date() / 1000),
            nonce: nonce(4),
            version: 8
        });

        return this.request('/api/user/login', {
            body: body,
            method: 'POST',
            headers: {'Authorization': `Sign ${authSign(body)}`}
        }).then((oAuth) => {
            const {at, region, rt, user} = oAuth;

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

        return this.apiRequest(`/api/user/device/${deviceId}?${qs}`)
            .catch(e => Promise.reject({error: !0, msg: (e.error == 404 ? 'Device not found' : e.msg)}));
    }

    async setDevicePowerState(deviceId, state ='off', channel = 1) {
        const [err, device] = await this.getDevice(deviceId)
            .then(data => [null, data], err => [err, null]);

        if (err)
        {
            return {error: !0, msg: err.msg};
        }

        const {uiid, params: deviceParams} = device;
        const {channels} = getDeviceType(uiid);

        if (!channels) {
            return {error: !0, msg: `Device doesn't support switch power`};
        } else if (channel < 0 || channel > channels) {
            return {error: !0, msg: `Invalid device channel parameter specified`};
        }

        let status = deviceParams.switch;
        let stateToSwitch = '';
        const params = {};
        const switches = deviceParams.switches;

        if (switches) {
            // Multiple chanels
            status = switches[channel - 1].switch;
            stateToSwitch = state == 'toggle' ? (status == 'off' ? 'on' : 'off') : state;
            switches[channel - 1].switch = stateToSwitch;
            params.switches = switches;
        } else {
            // Single channel device
            stateToSwitch = state == 'toggle' ? (status == 'off' ? 'on' : 'off') : state;
            params.switch = stateToSwitch;
        }

        const body = JSON.stringify({
            deviceid: deviceId,
            params,
            appid: APP_ID,
            ts: Math.floor(new Date() / 1000),
            version: 8
        });

        return this.apiRequest(`/api/user/device/status`, {method: 'POST', body})
            .then(resp => ({error: !1, state: stateToSwitch, channel}))
            .catch(e => ({error: !0, msg: e.msg || `Unable to set device power state`}));
    }

};