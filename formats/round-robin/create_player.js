module.exports = function() {
  var counter = 1

  this.create = function(name, options) {
    options = options || {}

    var player = {
      id: "p_" + (counter++),
      name: name,

      record: {
        win: 0,
        loss: 0
      },

      matches: []
    }

    if (options.keepScore) {
      player.record.pf = 0
      player.record.pa = 0
    }

    if (options.ties) {
      player.record.tie = 0
    }

    return player
  }
}