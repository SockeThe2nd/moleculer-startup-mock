# moleculer-startup-mock

Mocks moleculer-nodes into a local redis instance. Use index.js to launch a local empty node. This node can be profiled using clinic.js or other tools.

The namespace of all generated nodes is `test`.

## Mock nodes

`mockNodes.js` can be used to generate heartbeat and info packages in a local redis instance. The starting moleculer-node will see these as actual remote services.

```
  Usage: mockNodes.js [options] [command]

  Commands:
    help     Display help
    version  Display version

  Options:
    -c, --clean            Removes all keys before adding new nodes (disabled by default)
    -d, --disableNotepack  Serializes entries using default json (disabled by default)
    -h, --help             Output usage information
    -n, --nodes <n>        Number of mocked moleculer nodes (defaults to 500)
    -s, --services <n>     Number of services per node (defaults to 20)
    -v, --version          Output the version number
```

### Usage examples

- `node mockNodes.js -c -n 200 -s 20` 
  - Removes all keys from redis and adds 200 nodes with 20 services each.
- `node mockNodes.js -d`
  - Adds 500 nodes with 20 services each in json format. Does not remove old nodes
