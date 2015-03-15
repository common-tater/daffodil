module.exports = Graph

var Node = require('./node')
var hat = require('hat')
var isRetina = window.devicePixelRatio > 1

function Graph (daffodil) {
  this.daffodil = daffodil
  this.el = document.querySelector('.graph')
  this.nodesEl = this.el.querySelector('.nodes')
  this.canvas = this.el.querySelector('canvas')
  this.context = this.canvas.getContext('2d')
  this.nodes = {}

  this.setRoot(new Node(this, this.daffodil.root))

  if (isRetina) {
    this.context.scale(2, 2)
  }

  this.nodesEl.addEventListener('click', this._onclick.bind(this))
  window.addEventListener('resize', this.render.bind(this))
}

Graph.prototype.render = function () {
  this.width = window.innerWidth
  this.height = window.innerHeight

  this.canvas.width = isRetina ? this.width * 2 : this.width
  this.canvas.height = isRetina ? this.height * 2 : this.height
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

  var root = this.root = this.nodes[this.daffodil.root.id]
  // if this is the first time any root is being shown, set
  // its x and y position to the center. If it's an existing
  // root, it should already have those properties set
  if (!root.x || !root.y) {
    root.x = this.width / 2
    root.y = this.height / 2
  }

  for (var i in this.nodes) {
    var node = this.nodes[i]

    if (!node.el.parentNode) {
      this.nodesEl.appendChild(node.el)
    }

    node.render()
  }
}

Graph.prototype.add = function () {
  var peer = this.daffodil.addListener(hat(24))
  var node = new Node(this, peer)
  this.nodes[node.id] = node
  return node
}

Graph.prototype.remove = function (node) {
  this.daffodil.removeListener(node.id)
  delete this.nodes[node.id]
}

Graph.prototype.setRoot = function (node) {
  if (this.root && this.root !== node) {
    this.root.el.classList.remove('root')
  }

  this.root = node
  node.el.classList.add('root')
  if (!this.nodes[node.id]) {
    this.nodes[node.id] = node
  }
  this.daffodil.setBroadcaster(node.id)
  this.render()
}

Graph.prototype._onclick = function (evt) {
  if (evt.target !== this.nodesEl) return

  var node = this.add()
  node.x = evt.x
  node.y = evt.y

  this.render()
}
