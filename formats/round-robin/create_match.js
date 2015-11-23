module.exports = function() {
  var counter = 1

  this.create = function(players, options) {
    options = options || {}

    var match = {
      id: "m_" + counter,
      number: counter++,

      players: players,

      result: {},

      state: "Scheduled"
    }

    if (options.round) {
      match.round = options.round
    }

    return match
  }
}