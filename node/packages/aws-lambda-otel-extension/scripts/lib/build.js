'use strict';

const path = require('path');
const fsp = require('fs').promises;
const unlink = require('fs2/unlink');
const AdmZip = require('adm-zip');
const mkdir = require('fs2/mkdir');
const spawn = require('child-process-ext/spawn');
const ensureNpmDependencies = require('./ensure-npm-dependencies');
const { version } = require('../../package');

const rootDir = path.resolve(__dirname, '../../');
const esbuildFilename = path.resolve(rootDir, 'node_modules/.bin/esbuild');
const externalDir = path.resolve(rootDir, 'external');
const externalProtoRelativeDirname = 'otel-extension-external/proto';
const externalRuntimeAgnosticDir = path.resolve(rootDir, 'external-runtime-agnostic');
const internalDir = path.resolve(rootDir, 'internal');

module.exports = async (distFilename, options = {}) => {
  if (!options) options = {};
  const mode = options.mode || 3; // 1: internal, 2: external
  const zip = new AdmZip();

  await Promise.all([
    unlink(distFilename, { loose: true }),
    mkdir(path.dirname(distFilename), { intermediate: true, silent: true }),
    (async () => {
      if (mode & 2) {
        ensureNpmDependencies('external/otel-extension-external');
        if (mode === 2) {
          zip.addLocalFile(
            path.resolve(externalRuntimeAgnosticDir, 'extensions/otel-extension'),
            'extensions'
          );
          zip.addLocalFile(
            path.resolve(externalRuntimeAgnosticDir, 'otel-extension-external/node'),
            'otel-extension-external'
          );
        } else {
          zip.addLocalFile(path.resolve(externalDir, 'extensions/otel-extension'), 'extensions');
        }
        zip.addFile(
          'otel-extension-external/index.js',
          (
            await spawn(esbuildFilename, [
              path.resolve(path.resolve(externalDir, 'otel-extension-external/index.js')),
              '--bundle',
              '--platform=node',
              '--external:./version',
              '--external:/var/runtime/node_modules/aws-sdk',
            ])
          ).stdoutBuffer
        );
        for (const relativeFilename of await fsp.readdir(
          path.resolve(externalDir, externalProtoRelativeDirname)
        )) {
          zip.addLocalFile(
            path.resolve(externalDir, externalProtoRelativeDirname, relativeFilename),
            externalProtoRelativeDirname
          );
        }
        zip.addFile(
          'otel-extension-external/version.json',
          Buffer.from(JSON.stringify(version), 'utf8')
        );
      }
      if (mode & 1) {
        ensureNpmDependencies('internal/otel-extension-internal-node');
        zip.addFile(
          'otel-extension-internal-node/index.js',
          (
            await spawn(esbuildFilename, [
              path.resolve(path.resolve(internalDir, 'otel-extension-internal-node/index.js')),
              '--bundle',
              '--platform=node',
            ])
          ).stdoutBuffer
        );
        zip.addLocalFile(
          path.resolve(internalDir, 'otel-extension-internal-node/exec-wrapper.sh'),
          'otel-extension-internal-node'
        );
        zip.addLocalFile(
          path.resolve(internalDir, 'otel-extension-internal-node/wrapper.js'),
          'otel-extension-internal-node'
        );
      }
    })(),
  ]);
  zip.writeZip(distFilename);
};
