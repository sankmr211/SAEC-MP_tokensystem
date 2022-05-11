'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Hapi = require('@hapi/hapi');
const faker = require('faker');
const Dotenv = require('dotenv');
Dotenv.config({
    path: __dirname + `/../server/.env`
});

const lab = exports.lab = Lab.script();
const { experiment, test } = lab;
const { expect } = Code;


const mob_gen = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

const testData = {
    tid: "santhoshkumar_new",
    created_by: "amar",
    phone_number: mob_gen(9000000000, 9999999999)
}

const server = new Hapi.Server();
const mongoURL = 'mongodb://' + process.env.MONGO_DB_HOST + '/' + testData.tid;
server.register({ plugin: require('../lib'), options: { mongoURI: mongoURL } });

//create
experiment('1 block create ', () => {
    test('1 blocklist add with payload with 10 digit', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: `${testData.phone_number}`,
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
    })
    test('2 blocklist add with payload with 8 digit', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: `${mob_gen(60000000, 99999999)}`,
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
    })
    test('3 blocklist already exist phone_number with payload with 10 digit', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: `9212563319`, //change to existed number
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(409);
    })
    test('4 blocklist already exist phone_number with payload with 8 digit', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: `89234837`,
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(409);
    })

    test('5 blocklist phone_number less then 8 digt with payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: '9042136',
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
    test('6 blocklist phone_number greater then 10 digt with payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: '90421364001',
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
    test('7 blocklist phone_number 9 digt with payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: '904213640',
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
    test('8 blocklist without phone_number with payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: '',
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
    test('9 blocklist without tid payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: '',
                phone_number: '9042136400',
                created_by: "amar"
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
    test('10 blocklist without created_by in payload ', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/create',
            payload: {
                tid: testData.tid,
                phone_number: '9042136400',
                created_by: ""
            }
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    })
})

//fetch
experiment('2 block fetch ', () => {

    test('11 Fetch data by tid', async () => {

        const injectOptions = {
            method: 'get',
            url: `/blocklist/fetch?tid=${testData.tid}`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
    });
    test('12 Fetch data by tid and phone_number', async () => {

        const injectOptions = {
            method: 'get',
            url: `/blocklist/fetch?tid=${testData.tid}&phone_number=9212563319`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.length).to.equal(1)
    });
    test('13 Fetch data by tid and phone_number not existing data', async () => {

        const injectOptions = {
            method: 'get',
            url: `/blocklist/fetch?tid=${testData.tid}&phone_number=9212563310`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.length).to.equal(0)
    });
    test('14 Fetch data by tid, skip and take', async () => {

        const injectOptions = {
            method: 'get',
            url: `/blocklist/fetch?tid=${testData.tid}&skip=0&take=5`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.length).to.equal(5)
    });
});


//delete
experiment('blocklist Delete ', () => {

    test('15 Delete data by valid ID', async () => {

        const injectOptions = {
            method: 'delete',
            url: `/blocklist/delete/${testData.tid}/61caa633b42a450fb4af781e` //object id change
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(202);
    });
    test('16 Delete data by without object id', async () => {

        const injectOptions = {
            method: 'delete',
            url: `/blocklist/delete/${testData.tid}`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(404);
    });
    test('17 Delete data by without tid and object id', async () => {

        const injectOptions = {
            method: 'delete',
            url: `/blocklist/delete`
        };
        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(404);
    });
});


//upload
experiment('blocklist upload ', () => {
    test.only('upload file', async () => {
        const injectOptions = {
            method: 'post',
            url: '/blocklist/upload',
            payload: {
                tid: 'santhoshkumar_new',
                created_by: 'ragul',
                file: {
                  path: 'C:\\Users\\ASUS\\AppData\\Local\\Temp\\1640844519238-21508-0defcacd479f9da0',
                  bytes: 112,
                  filename: 'source.csv',
                  headers: {
                    'content-disposition': 'form-data; name="file"; filename="source.csv"',
                    'content-type': 'multipart/form-data'
                  }
                }
            },
            headers: { 'content-type': 'multipart/form-data; boundary:--------------------------206035824918680209558960' }
        };
        const response = await server.inject(injectOptions);

    });

});


