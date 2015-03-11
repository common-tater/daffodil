var Daffodil = require('../')

document.addEventListener('click', onclick.bind(this))

var daffodil = new Daffodil({broadcasterId: '0', k: 3})

// draw the first node as the broadcaster
drawNode(10, 10, '-1')

function onclick (evt) {
  switch (evt.target.id) {
    case 'remove-btn':
      var listenerId = document.getElementById('listener-id').value
      daffodil.removeListener(listenerId)
      break
    case 'nodeMap':
      var newListenerId = generateNewId()
      daffodil.addListener(newListenerId)
      drawNode.call(this, evt.pageX, evt.pageY, newListenerId)
      break
  }
}

function generateNewId () {
  return Math.random().toString(36).substr(2, 4)
}

function drawNode (x, y, newListenerId) {
  var ctx = document.getElementById('nodeMap').getContext('2d')

  ctx.beginPath()
  ctx.arc(x, y, 10, 0, 2 * Math.PI)
  ctx.stroke()

  ctx.font = '20px Georgia'
  ctx.fillText(newListenerId, x - 15, y - 15)
}
