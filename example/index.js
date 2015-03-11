var Daffodil = require('../')

document.addEventListener('click', onclick.bind(this))

var daffodil = new Daffodil({broadcasterId: '0', k: 3})
var peerNodes = daffodil.root
var peerCanvasCoords = {}

function onclick (evt) {
  switch (evt.target.id) {
    case 'remove-btn':
      var listenerId = document.getElementById('listener-id').value
      daffodil.removeListener(listenerId)
      break
    case 'nodeMap':
      var newListenerId = generateNewId()
      daffodil.addListener(newListenerId)
      peerCanvasCoords[newListenerId] = {id: newListenerId, x: evt.pageX, y: evt.pageY}
      break
  }
  clearMap()
  drawMap()
}

function generateNewId () {
  return Math.random().toString(36).substr(2, 4)
}

function clearMap () {
  var canvas = document.getElementById('nodeMap')
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawMap () {
  for (var peerNodeId in peerNodes.downstreamPeers) {
    drawNode(peerNodes.downstreamPeers[peerNodeId])
  }
}

function drawNode (peerNode) {
  var peerCanvasCoord = peerCanvasCoords[peerNode.id]
  if (!peerCanvasCoord) {
    return
  }

  var ctx = document.getElementById('nodeMap').getContext('2d')

  ctx.beginPath()
  ctx.arc(peerCanvasCoord.x, peerCanvasCoord.y, 10, 0, 2 * Math.PI)
  ctx.stroke()

  ctx.font = '20px Georgia'
  ctx.fillText(peerCanvasCoord.id, peerCanvasCoord.x - 15, peerCanvasCoord.y - 15)

  // recursively draw all the downstream peer nodes
  for (var peerNodeId in peerNode.downstreamPeers) {
    drawNode(peerNode.downstreamPeers[peerNodeId])
  }
}
