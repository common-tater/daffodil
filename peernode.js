module.exports = PeerNode

function PeerNode (id, upstreamPeer) {
  this.id = id
  this.downstreamPeers = {}
  this.upstreamPeer = upstreamPeer
}

PeerNode.prototype.getNumDownstreamPeers = function () {
  return Object.keys(this.downstreamPeers).length
}
