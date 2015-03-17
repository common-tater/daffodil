var PeerNode = require('./peernode')

module.exports = Daffodil

var DEFAULT_ROOT_NODE_ID = 'DEFAULT_ROOT_NODE'

function Daffodil (opts) {
  if (!(this instanceof Daffodil)) {
    return new Daffodil(opts)
  }
  if (!opts.k) {
    console.error('must include k as args')
  }
  // this should still work if the broadcasterId is
  // not known yet, and is null at this point. Daffodil
  // must be able to build up its tree of listeners even
  // before the broadcaster has connected
  this.broadcasterId = opts.broadcasterId ? opts.broadcasterId : DEFAULT_ROOT_NODE_ID
  this.k = opts.k
  this.listeners = {}

  // the root will be the original broadcaster
  this.root = new PeerNode(this.broadcasterId, null)
}

Daffodil.prototype.setBroadcaster = function (broadcasterId) {
  var existingRoot = this.root
  // if this is the first time there is a broadcaster
  // being set, then just set the id on the blank node
  // that was already created and return
  if (existingRoot.id === DEFAULT_ROOT_NODE_ID) {
    existingRoot.id = broadcasterId
    return
  }

  // if there is no change, just return
  if (existingRoot.id === broadcasterId) {
    return
  }

  // otherwise, there is an existing broadcaster that is different
  // than this new one, so remove the existing one and replace
  // it with the new
  var newRoot = this.listeners[broadcasterId]
  // if the new broadcaster is already a listener,
  // remove them from the list of listeners, remove the
  // link to its upstream peer, and the link from its
  // upstream peer to it
  if (newRoot) {
    delete this.listeners[newRoot.id]
    delete newRoot.upstreamPeer.downstreamPeers[broadcasterId]
    newRoot.upstreamPeer = null
  } else {
    // if the caller is setting the broadcaster to be an id
    // we haven't seen before, create a new node for them
    newRoot = new PeerNode(broadcasterId, null)
  }

  existingRoot.upstreamPeer = newRoot
  newRoot.downstreamPeers[existingRoot.id] = existingRoot
  // the existing root is now a listener,
  // so now add them to the list of listeners
  this.listeners[existingRoot.id] = existingRoot

  this.root = newRoot

  this.broadcasterId = broadcasterId
}

Daffodil.prototype.addListener = function (listenerId) {
  var peerNode = findPeerWithAvailableSlot.call(this, this.root)
  // remember them globally
  this.listeners[listenerId] = new PeerNode(listenerId, peerNode)
  // add them to the peer with available slot's list
  peerNode.downstreamPeers[listenerId] = this.listeners[listenerId]
  return this.listeners[listenerId]
}

Daffodil.prototype.removeListener = function (listenerId) {
  var listenerNode = this.listeners[listenerId]
  if (!listenerNode) {
    return
  }

  // find a replacement upstream peer for each of this listener's
  // downstream peers
  for (var downstreamPeerId in listenerNode.downstreamPeers) {
    var downstreamPeer = listenerNode.downstreamPeers[downstreamPeerId]
    var peerWithAvailableSlot = findPeerWithAvailableSlot.call(this, this.root, downstreamPeer.id, listenerId)
    peerWithAvailableSlot.downstreamPeers[downstreamPeerId] = downstreamPeer
    downstreamPeer.upstreamPeer = peerWithAvailableSlot
  }
  // remove the listener from it's upstream node
  delete listenerNode.upstreamPeer.downstreamPeers[listenerId]

  // remove the node from the overall listener map
  delete this.listeners[listenerId]
}

function findPeerWithAvailableSlot (currentNode, peerIdToBeAdded, peerIdToBeRemoved) {
  // if this is part of a removal, the new routing can't involve either of the
  // peers that are involved in the removal or adding, so just return null
  if (currentNode.id === peerIdToBeAdded || currentNode.id === peerIdToBeRemoved) {
    return null
  }

  // if we're not full yet, and if we're not in the process of
  // removing a peer and in the situation of finding ourself,
  // then return this one
  if (currentNode.getNumDownstreamPeers() < this.k) {
    return currentNode
  }

  // if we're full, go through this node's list of downstream peers
  // and check them for available slots
  for (var node in currentNode.downstreamPeers) {
    var availablePeer = findPeerWithAvailableSlot.call(this, currentNode.downstreamPeers[node], peerIdToBeAdded, peerIdToBeRemoved)
    // if we found one that will do, return it, otherwise continue
    // on iterating over the next downstream peer
    if (availablePeer) {
      return availablePeer
    }
  }

  // if for any other reason no available peer was found, return null.
  // it should never get to this state, and if so something else is out
  // of whack
  return null
}
