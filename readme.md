# daffodil
Implementation of a complete k-ary tree. It begins with a broadcaster node, and the first listener node connects directly to the broadcaster. New listener nodes will connect to the broadcaster until the number of listeners reaches k, and then the broadcaster node will be considered full. The next listener that tries to connect will then be redirected to one of the existing listener nodes than isn't yet full.

When a listener node is disconnected, any other listening nodes that were dependent on that node will be reconnect to another listener node with an available connection.

When a broadcaster node becomes disconnected, it doesn't need to be resilient since the source is now gone.

This is just a data structure at this point, the actual passing of data between nodes is left up to you.

## Example
`npm run example`

The canvas starts out with a single root broadcaster node. Click on the canvas to add a new node to the tree. Click on any existing node to remove it. As you add and remove nodes, it will visualize the re-routing of upstream/downstream connections beteen peers.

## License
MIT
