const assert = require('assert');
const sinon = require('sinon');
const EwelinkApi = require('./../src/ewelink-api');

describe('Ewelink api specs', () => {

    it('Creating an instance without passing arguments should throw an error', () => {
        assert.throws(() => {
            const ewelink = new EwelinkApi();
        }, Error, 'Invalid login credentials');
    });

    it('Passed email should be processed correctly', () => {
        const ewelink = new EwelinkApi({
            login: 'user@gmail.com',
            password: 'xxxxxxxxxx'
        });

        const {oAuth: {email, password, phoneNumber}} = ewelink;

        assert.equal(email, 'user@gmail.com');
        assert.equal(password, 'xxxxxxxxxx');
        assert.equal(phoneNumber, null);
    });

    it('Passed phone number should be processed correctly', () => {
        const ewelink = new EwelinkApi({
            login: '+380999999999',
            password: 'xxxxxxxxxx'
        });

        const {oAuth: {email, password, phoneNumber}} = ewelink;

        assert.equal(email, null);
        assert.equal(password, 'xxxxxxxxxx');
        assert.equal(phoneNumber, '+380999999999');
    });

    it('Method getCredentials should handle successful responses', async () => {
        const ewelink = new EwelinkApi({
            login: 'user@gmail.com',
            password: 'xxxxxxxxxx'
        });
        const request = sinon.stub(ewelink, 'request').returns(Promise.resolve({
            at: 'xxx',
            user: 'yyy',
            region: 'cn'
        }));
        const credentials = await ewelink.getCredentials();
        const {oAuth: {at, user}} = ewelink;


        assert.ok(request.calledOnce);
        assert.equal(at, 'xxx');
        assert.equal(user, 'yyy');
        assert.equal(ewelink.region, 'cn');
    });

    it('Method getCredentials should handle failed responses', async () => {
        const ewelink = new EwelinkApi({
            login: 'user@gmail.com',
            password: 'xxxxxxxxxx'
        });
        
        const request = sinon.stub(ewelink, 'request').returns(Promise.reject({
          "error": 404,
          "msg": "user is not exit",
        }));

        try {
            const credentials = await ewelink.getCredentials();
        } catch(e) {
           assert.ok(e.error);
        }

        assert.ok(request.calledOnce);
    });

    it('Method getCredentials should return cached credential', async () => {
        const ewelink = new EwelinkApi({
            at: 'xxx',
            user: {
                apikey: 'yyy',
                appId: 'zzz'                
            }
        });
        
        const request = sinon.stub(ewelink, 'request').returns(Promise.resolve({}));

        const credentials = await ewelink.getCredentials();

        assert.equal(request.called, false);
    });
});
