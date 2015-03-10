module.exports = Listener

function Listener (id, broadcasterId) {
  this.id = id
  this.broadcasterId = broadcasterId
  this.outgoingStreams = null // this will eventually be set to a nodecollection
}
