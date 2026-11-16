<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Process graph layout dependency

`dagre.js` contains the browser distribution of **@dagrejs/dagre 1.1.8**, including
**@dagrejs/graphlib 2.2.4**, both MIT licensed, copyright 2012–2014 Chris Pettitt.
The full notices are in `LICENSE.dagre` and `LICENSE.graphlib`, and in an
`@license` comment retained in the built JavaScript.

Source: <https://github.com/dagrejs/dagre/tree/v1.1.8> and
<https://github.com/dagrejs/graphlib/tree/v2.2.4>.

Dagre npm tarball: <https://registry.npmjs.org/@dagrejs/dagre/-/dagre-1.1.8.tgz>.
Integrity: `sha512-5SEDlndt4W/LaVzPYJW+bSmSEZc9EzTf8rJ20WCKvjS5EAZAN0b+x0Yww7VMT4R3Wootkg+X9bUfUxazYw6Blw==`.

The distribution's UMD loader is replaced with a local factory and ESM default
export; the layout and Graphlib implementation are unchanged. The narrow local
TypeScript declaration describes only the API used by the settings component.
Vendoring keeps the dependency confined to the authorized settings tree and
avoids adding any package to the host import map.
