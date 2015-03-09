# daffodil
Scalable and resilient data broadcasting between peers, implemented using a complete k-ary tree. It begins with a broadcaster node, and the first listener node connects directly to the broadcaster. New listener nodes will connect to the broadcaster until the number of listeners reaches k, and then the broadcaster node will be considered full. The next listener that tries to connect will then be redirected to one of the existing listener nodes than isn't yet full.

When a listener node is disconnected, any other listening nodes that were dependent on that node will be reconnect to another listener node with an available connection.

When a broadcaster node becomes disconnected, it doesn't need to be resilient since the source is now gone.

## Note
Just a prototype for the moment!

## License
MIT
