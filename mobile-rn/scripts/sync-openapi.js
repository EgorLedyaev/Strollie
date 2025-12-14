#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable */
// Sync OpenAPI spec into docs/api-docs.json. Supports --check to only compare.
// Env:
//   API_SPEC_URL - full URL to OpenAPI JSON (preferred)
//   EXPO_PUBLIC_ROUTES_API_BASE_URL - base URL; '/openapi.json' is appended if API_SPEC_URL not set.

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const outIndex = args.indexOf('--out');
const customOut = outIndex !== -1 ? args[outIndex + 1] : null;

// Default spec: основной API по адресу 92.246.141.61:8081 (/v3/api-docs)
const DEFAULT_API_SPEC_URL = 'http://185.246.222.56:8081/v3/api-docs';

const apiSpecUrl =
    process.env.API_SPEC_URL ||
    (process.env.EXPO_PUBLIC_ROUTES_API_BASE_URL
        ? `${process.env.EXPO_PUBLIC_ROUTES_API_BASE_URL.replace(/\/$/, '')}/openapi.json`
        : DEFAULT_API_SPEC_URL);

if (!apiSpecUrl) {
    console.error(
        '[sync-openapi] Не задан API_SPEC_URL и EXPO_PUBLIC_ROUTES_API_BASE_URL. Укажите путь к OpenAPI JSON.',
    );
    process.exit(1);
}

const targetPath = customOut
    ? path.resolve(process.cwd(), customOut)
    : path.join(__dirname, '..', 'docs', 'api-docs.json');

async function main() {
    console.log(`[sync-openapi] Fetching spec from ${apiSpecUrl}`);
    const { data } = await axios.get(apiSpecUrl, { timeout: 15000 });

    const nextJson = JSON.stringify(data, null, 2);
    let prevJson = '';
    if (fs.existsSync(targetPath)) {
        prevJson = fs.readFileSync(targetPath, 'utf8');
    }

    if (checkOnly) {
        if (prevJson && prevJson.trim() === nextJson.trim()) {
            console.log('[sync-openapi] Spec is up to date.');
            return;
        }
        console.error('[sync-openapi] Spec drift detected. Run `npm run api:sync` to update.');
        process.exit(1);
    }

    fs.writeFileSync(targetPath, `${nextJson}\n`, 'utf8');
    console.log(`[sync-openapi] Updated ${targetPath}`);
}

main().catch(error => {
    console.error('[sync-openapi] Failed to sync OpenAPI spec:', error.message);
    process.exit(1);
});
