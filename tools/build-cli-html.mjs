import fs from 'fs';
import commandLineUsage from 'command-line-usage';
import AnsiToHTML from 'ansi-to-html/lib/ansi_to_html.js';
import {cliSections} from '../src/optionDefinitions.mjs';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const {promises: {writeFile}} = fs;

const ansiToHTML = new AnsiToHTML({newline: true, space: true});

const ansiText = commandLineUsage(cliSections);
// console.log('a', ansiText.replace(/\u001B/gu, '<esc>'));

(async () => {
await writeFile(
  new URL('../cli.html', import.meta.url).pathname,
  `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <link href="data:image/x-icon;," type="image/x-icon" rel="shortcut icon" />
    <title>Git Utilities CLI docs</title>
    <style>
    body {
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        font-family: monospace;
    }
    </style>
  </head>
  ${ansiToHTML.toHtml(ansiText.replace(/\\/gu, '\\'))}
  </body>
  </html>
`
);
})();
