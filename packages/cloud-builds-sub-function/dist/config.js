"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const yenv = require('yenv');
const env = yenv('config.yaml');
exports.config = {
    GCP_PROJECT: env.GCP_PROJECT,
};
