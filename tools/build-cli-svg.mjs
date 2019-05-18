import fs from 'fs';

import ansiToSVG from 'ansi-to-svg';
import commandLineUsage from 'command-line-usage';

import {cliSections} from '../src/optionDefinitions.mjs';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const {promises: {writeFile}} = fs;

const ansiText = commandLineUsage(cliSections);

(async () => {
await writeFile(
  new URL('../cli.svg', import.meta.url).pathname,
  ansiToSVG(ansiText)
);
})();
