var Daffodil = require('../')

document.addEventListener('click', onclick.bind(this))

var daffodil = new Daffodil({broadcasterId: '-1'})

function onclick (evt) {
  var newListenerId = generateNewId()
  daffodil.joinAsListener(newListenerId)
  drawNode.call(this, evt.pageX, evt.pageY, newListenerId)
}

function generateNewId () {
  return Math.random().toString(36).substr(2, 9)
}

function drawNode (x, y, listenerId) {
  var ctx = document.getElementById('nodeMap').getContext('2d')

  ctx.beginPath()
  ctx.arc(x, y, 10, 0, 2 * Math.PI)
  ctx.stroke()
}
