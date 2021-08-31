//Entrypoint for docker and local debug

const { Runner } = require("moleculer");

const runner = new Runner();

runner.start(process.argv);