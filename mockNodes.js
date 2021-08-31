#!/usr/bin/env node

const args = require("args");
const ioredis = require("ioredis");

const { hostname } = require("os");
const { readFileSync } = require("fs");
const path = require("path");
const uuid = require("uuid");
const notepack = require("notepack.io");

const Handlebars = require("handlebars");

const serviceString = readFileSync(path.resolve(__dirname, "./templates/serviceBase.json"), { encoding: "utf8" });
const serviceTemplate = Handlebars.compile(serviceString);

const heartbeatString = readFileSync(path.resolve(__dirname, "./templates/heartbeatBase.json"), { encoding: "utf8" });
const heartbeatTemplate = Handlebars.compile(heartbeatString);

const infoString = readFileSync(path.resolve(__dirname, "./templates/infoBase.json"), { encoding: "utf8" });
const infoTemplate = Handlebars.compile(infoString);

const host = hostname();

args
    .option('nodes', 'Number of mocked moleculer nodes', 500)
    .option('services', 'Number of services per node', 20)
    .option('disableNotepack', 'Serializes entries using default json', false)
    .option('clean', 'Removes all keys before adding new nodes', false);


const flags = args.parse(process.argv);

let client = new ioredis();

const nodeCount = flags.nodes;
const serviceCount = flags.services;

const serialize = (flags.disableNotepack) ? JSON.stringify : notepack.encode;


let infos = [];
let beats = [];

function run() {
    for (var i = 0; i < nodeCount; i++) {
        let info = mockInfo(serviceCount);
        infos.push(info);
        beats.push(mockHeartbeat(info.id));
    }

    let cleanUpPromise;

    if (flags.clean) {
        console.log('Flushing DB.')
        cleanUpPromise = client.flushdb();
    } else {
        cleanUpPromise = Promise.resolve();
    }

    cleanUpPromise.then(() => {
        console.log(`Mocking ${nodeCount} nodes with ${serviceCount} services each.`);
        const promises = [];
        infos.forEach(info => {
            promises.push(client.set(info.key, info.value, "EX", 5000));
        });

        beats.forEach(beat => {
            promises.push(client.set(beat.key, beat.value, "EX", 5000));
        });

        return Promise.all(promises)
    }).catch(err => {
        console.log(err);
        return;
    }).finally(() => {
        console.log('DONE')
        client.disconnect();
    });
}

function mockInfo(serviceCount) {
    const id = uuid.v4();

    const key = `MOL-test-DSCVR-INFO:${id}`

    const localInfo = JSON.parse(infoTemplate({ id, host }));

    for (var cnt = 0; cnt < serviceCount; cnt++) {
        localInfo.services.push(mockService());
    }

    return {
        id,
        key,
        value: serialize(localInfo)
    }
}

function mockHeartbeat(id) {
    const key = `MOL-test-DSCVR-BEAT:${id}|${id.split('-')[0]}|2`;

    const localBeat = JSON.parse(heartbeatTemplate({ id }));

    return {
        id,
        key,
        value: serialize(localBeat)
    }
}

function mockService() {
    const name = uuid.v4();

    return JSON.parse(serviceTemplate({
        name
    }));
}

run();