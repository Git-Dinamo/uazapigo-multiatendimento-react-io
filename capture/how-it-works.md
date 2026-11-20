# How it works

Deep mode: what the site's JavaScript is made of and what its start page did while we watched.

## Its JavaScript

Analysed 163 script(s) from https://uazapigo-multiatendimento.bubbleapps.io/: 161 module(s), 168 endpoint(s), 0 route(s), bundled with esbuild/tsc.

Evidence ev_be1eeb7ffcec67afedd9cc0c09bc652ccf0e436d3725c4d41a70392cfe4affe7.

```json
{
  "api_operations": [],
  "app_kind": "unknown",
  "bundlers": [
    "esbuild",
    "tsc"
  ],
  "edges": [
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#_byteLength@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#byteLength@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#encodeChunk@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#fromByteArray@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#getLens@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#toByteArray@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#tripletToBase64@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#exports.read@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#exports.write@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/process/browser.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#get@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/base64-js/index.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/ieee754/index.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "requires",
      "to": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/helpers/esbuild/shim.js"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.alloc@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.allocUnsafe@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.allocUnsafeSlow@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.compare@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.concat@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.from@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.isBuffer@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.isEncoding@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.prototype.compare@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.prototype.copy@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.prototype.equals@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.prototype.fill@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#Buffer3.prototype.includes@21"
    },
    {
      "from": "bundle-module:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js#node_modules/node-stdlib-browser/node_modules/buffer/index.js",
      "kind": "defines",
      "to": "fn:uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de
```

## Ten seconds of it

Watched https://uazapigo-multiatendimento.bubbleapps.io/ for 10000ms: 0 request outline(s), 7 console entr(y/ies).

Evidence ev_73ba7cb40274f66145ea7ae3ae5cbfa0dda9726501f99a256ffc6afece45468f.

```json
{
  "accessibility": null,
  "console": {
    "count": 7,
    "entries": [
      {
        "level": "log",
        "source": "console-api"
      },
      {
        "level": "log",
        "source": "console-api"
      },
      {
        "level": "log",
        "source": "console-api"
      },
      {
        "level": "error",
        "source": "console-api"
      },
      {
        "level": "log",
        "source": "console-api"
      },
      {
        "level": "log",
        "source": "console-api"
      },
      {
        "level": "warning",
        "source": "other"
      }
    ],
    "has_text": false
  },
  "dom": {
    "attribute_names": [
      "alt",
      "async",
      "charset",
      "class",
      "content",
      "crossorigin",
      "data-icon-set",
      "data-outline",
      "height",
      "href",
      "http-equiv",
      "id",
      "lang",
      "name",
      "placeholder",
      "property",
      "rel",
      "src",
      "style",
      "tabindex",
      "target",
      "title",
      "translate",
      "type",
      "viewbox",
      "width"
    ],
    "elements_by_name": {
      "a": 1,
      "body": 1,
      "button": 9,
      "div": 116,
      "h4": 1,
      "head": 1,
      "html": 1,
      "img": 3,
      "input": 2,
      "link": 6,
      "meta": 22,
      "script": 42,
      "strong": 3,
      "style": 4,
      "svg": 9,
      "title": 1,
      "use": 9
    },
    "text_nodes": 42,
    "total_nodes": 284,
    "truncated": false
  },
  "dropped_events": 0,
  "frame_origins": [
    "https://uazapigo-multiatendimento.bubbleapps.io"
  ],
  "network": {
    "request_count": 0,
    "requests": []
  },
  "origin": "https://uazapigo-multiatendimento.bubbleapps.io/",
  "resources": [
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://unpkg.com/@popperjs/core@2"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"
    },
    {
      "mime_type": "image/gif",
      "type": "Image",
      "url": "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/pre_run_jquery_js/dee903a9e36db713e4c86d0cdd96d921e37be0c1293ed8dee29e2e4d7713b9ff/pre_run_jquery.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/early_js/05ae9fe83d6b755291132aab9d325d70918aafd336da1bd91a41a31c8b25734b/early.js"
    },
    {
      "mime_type": "text/javascript",
      "type": "Script",
      "url": "https://unpkg.com/mic-recorder-to-mp3@2.2.2/dist/index.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/static_js/6d53825a1faa22c0ccc6afa5e0de98682d31a7f6c8750ba5204ec599eb4b8ed9/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/xfalse/static.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/run_js/13915f71479be563a816e4ccf1f0fa080be697c64ee6e36efbbe4a12ba5a5f5c/xfalse/x29/run.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"
    },
    {
      "mime_type": "image/avif",
      "type": "Image",
      "url": "https://848eb58a091c96824743e97cb9bb3b38.cdn.bubble.io/cdn-cgi/image/f=auto,w=384,h=384,fit=contain,dpr=1/f1680709943042x969204118780854700/Furore%5B1%5D.png"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Image",
      "url": "https://a3f482aa37473c68f97b76bd2e4a3782.cdn.bubble.io/f1585607370503x914556455591480200/banner-icon.svg"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Other",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/static/icon_libraries/material-icons-4.0.0-outlined.svg"
    },
    {
      "mime_type": "font/woff2",
      "type": "Font",
      "url": "https://fonts.gstatic.com/s/opensans/v44/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2"
    },
    {
      "mime_type": "application/javascript",
      "type": "Script",
      "url": "https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.8/push.min.js"
    },
    {
      "mime_type": "image/svg+xml",
      "type": "Other",
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/static/icon_libraries/material-icons-4.0.0-filled.svg"
    }
  ],
  "scripts": [
    {
      "length": 69,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/"
    },
    {
      "length": 24222,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/early_js/05ae9fe83d6b755291132aab9d325d70918aafd336da1bd91a41a31c8b25734b/early.js"
    },
    {
      "length": 89795,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/pre_run_jquery_js/dee903a9e36db713e4c86d0cdd96d921e37be0c1293ed8dee29e2e4d7713b9ff/pre_run_jquery.js"
    },
    {
      "length": 4265691,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/run_js/13915f71479be563a816e4ccf1f0fa080be697c64ee6e36efbbe4a12ba5a5f5c/xfalse/x29/run.js"
    },
    {
      "length": 1223374,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/static_js/6d53825a1faa22c0ccc6afa5e0de98682d31a7f6c8750ba5204ec599eb4b8ed9/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/xfalse/static.js"
    },
    {
      "length": 1491388,
      "source_map_url": null,
      "url": "https://uazapigo-multiatendimento.bubbleapps.io/package/dynamic_js/b86b6028307528a17106871519348a9a8de67d20af22d82d537f1a4804726d32/uazapigo-multiatendimento/live/index/xnull/xfalse/xfalse/pt_br/xfalse/xfalse/dynamic.js"
    },
    {
      "length": 12791,
      "source_map_url": "push.min.js.map",
      "url": "https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.8/push.min.js"
    },
    {
      "length": 20122,
      "source_map_url": "popper.min.js.map",
      "url": "https://unpkg.com/@popperjs/core@2"
    },
    {
      "length": 37256,
      "source_map_url": null,
      "url": "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"
    },
    {
      "length": 545207,
      "source_map_url": "index.js.map",
      "url": "https://unpkg.com/mic-recorder-to-mp3@2.2.2/dist/index.js"
    },
    {
      "length": 36137,
      "source_map_url": null,
      "url": "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"
    },
    {
      "length": 2744,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Instance---Create-.js"
    },
    {
      "length": 2484,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Instance---List-.js"
    },
    {
      "length": 3011,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Global-Webhook---Create/Update-.js"
    },
    {
      "length": 2481,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Show-Webhook-Global-.js"
    },
    {
      "length": 2731,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Instance---updateAdminFields-.js"
    },
    {
      "length": 2166,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action------administrator---Server---Instance-Stats-.js"
    },
    {
      "length": 2733,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Text-.js"
    },
    {
      "length": 2794,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Media--audio--image--video--document--sticker--.js"
    },
    {
      "length": 2777,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Location-.js"
    },
    {
      "length": 2942,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Menu--button--list-or-poll--.js"
    },
    {
      "length": 2675,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Contact-.js"
    },
    {
      "length": 1608,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Presence-.js"
    },
    {
      "length": 2679,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Send---Stories/Status-.js"
    },
    {
      "length": 6903,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Message---Search---Realtime-.js"
    },
    {
      "length": 1594,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Message---Reaction-.js"
    },
    {
      "length": 1560,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Message---Delete-for-everyone-.js"
    },
    {
      "length": 1638,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Message---Mark-as-Read-.js"
    },
    {
      "length": 186,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance-12---Message---Edit--.js"
    },
    {
      "length": 1823,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Message---Download-.js"
    },
    {
      "length": 10448,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Search---Realtime-.js"
    },
    {
      "length": 2782,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Edit-Lead--fields-linked-to-chat--.js"
    },
    {
      "length": 1546,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Pin-.js"
    },
    {
      "length": 2047,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Mute-.js"
    },
    {
      "length": 1562,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Archive-.js"
    },
    {
      "length": 1671,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Delete-.js"
    },
    {
      "length": 1644,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Label-.js"
    },
    {
      "length": 1554,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Block-.js"
    },
    {
      "length": 1544,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chat---Block-List-.js"
    },
    {
      "length": 2509,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance-23---Chat---Import-Leads-.js"
    },
    {
      "length": 2733,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Create-.js"
    },
    {
      "length": 2460,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---List-.js"
    },
    {
      "length": 2711,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Details-.js"
    },
    {
      "length": 2617,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Change-Invite-Url-.js"
    },
    {
      "length": 2786,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Modify-Members-.js"
    },
    {
      "length": 2597,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Join-.js"
    },
    {
      "length": 1537,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Leave-.js"
    },
    {
      "length": 2625,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Edit-Name-.js"
    },
    {
      "length": 2629,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Edit-Image-.js"
    },
    {
      "length": 2633,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Edit-Locked-.js"
    },
    {
      "length": 2641,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Edit-Announce-.js"
    },
    {
      "length": 2653,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Edit-description-.js"
    },
    {
      "length": 2597,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Create-Community-.js"
    },
    {
      "length": 1727,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Group---Add/remove-community-group-.js"
    },
    {
      "length": 2632,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---Connect-.js"
    },
    {
      "length": 2760,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---Details--QRCode---Pair-Code--.js"
    },
    {
      "length": 2494,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---Disconnect-.js"
    },
    {
      "length": 1448,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---Delete-.js"
    },
    {
      "length": 2636,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---Change-name-.js"
    },
    {
      "length": 3357,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Instance---update-FieldsMap-.js"
    },
    {
      "length": 3024,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Webhook---Update-.js"
    },
    {
      "length": 2461,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Webhook---List-.js"
    },
    {
      "length": 2477,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Attendant---List-.js"
    },
    {
      "length": 2829,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Attendant---Create/Update-.js"
    },
    {
      "length": 2693,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Check-if-the-number-is-on-WhatsApp-.js"
    },
    {
      "length": 2599,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Profile-image---Name-.js"
    },
    {
      "length": 2457,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Labels---Show-all-.js"
    },
    {
      "length": 2465,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Contacts---List-.js"
    },
    {
      "length": 2476,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Chats---Count-.js"
    },
    {
      "length": 2490,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Quick-Reply---Get-All--.js"
    },
    {
      "length": 2788,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Quick-Reply---Create/Update-.js"
    },
    {
      "length": 2409,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Sender---Simple-Create-.js"
    },
    {
      "length": 1541,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Sender---Edit-Folder-.js"
    },
    {
      "length": 2496,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Sender---List-Folder-.js"
    },
    {
      "length": 2658,
      "source_map_url": null,
      "url": "PLUGIN_1725712298105x455773695640076300/uazapiGO---WhatsApp-API-element_action-----instance---Sender---List-Messages-.js"
    },
    {
      "length": 141
```
