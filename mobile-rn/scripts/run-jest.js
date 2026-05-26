#!/usr/bin/env node

const path = require('path');

const polyfillPath = path.resolve(__dirname, 'jest-localstorage-polyfill');
const nodeOptions = process.env.NODE_OPTIONS?.trim();
const requireFlag = `--require=${polyfillPath}`;

process.env.NODE_OPTIONS = nodeOptions
    ? `${nodeOptions} ${requireFlag}`
    : requireFlag;

require(polyfillPath);

require('jest/bin/jest');
