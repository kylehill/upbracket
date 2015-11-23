var seedrandom = require("seedrandom")
var _ = require("underscore")

var shuffle = function(array, rng) {
  var clonedArray = _.clone(array)
  var outbound = []

  while (clonedArray.length) {
    var index = Math.floor(rng() * clonedArray.length)
    var item = clonedArray.splice(index, 1)
    outbound.push(item[0])
  }

  return outbound
}

var buildRound = function(playerIds, offset, matchGenerator) {
  var players = _.clone(playerIds)
  if (players.length % 2) {
    players.push(false)
  }

  var first = players.shift()

  _.times(offset, function(){
    players.push(players.shift())
  })
  players.unshift(first)

  var matches = []
  _.times(players.length / 2, function(i){
    var home = players[i]
    var away = players[(players.length - (i + 1))]

    if (home && away) {
      matches.push(matchGenerator.create([home, away], {
        round: (offset + 1)
      }))
    }
  })

  return matches
}

var buildRounds = function(playerIds) {
  var matchGenerator = new (require("./create_match"))

  var numberOfRounds = (Math.ceil(playerIds.length / 2) * 2) - 1

  var rounds = []
  _.times(numberOfRounds, function(i){
    rounds.push(buildRound(playerIds, i, matchGenerator))
  })

  return rounds
}

module.exports = function(options) {
  options = options || {}
  var iterations = 0

  return {
    shuffle: function(playerIds) {
      var rng = seedrandom((options.created_at || 0) + (iterations++))
      return shuffle(playerIds, rng)
    },

    create: function(playerIds) {
      var rng = seedrandom((options.created_at || 0) + (iterations++))
      
      var matchGenerator = new (require("./create_match"))
      var numberOfRounds = (Math.ceil(playerIds.length / 2) * 2) - 1

      var players = shuffle(playerIds, rng)

      return _.flatten(_.map(_.range(numberOfRounds), function(i){
        return buildRound(players, i, matchGenerator)
      }))
    }
  }
}