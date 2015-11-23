var _ = require("underscore")

var createTournament = function(options, changes) {
  options = _.extend({
    players: [],
    keepScore: false,
    ties: false
  }, options || {})

  changes = changes || []

  var matches = []
  var players = {}

  var generators = {
    player: new (require("./create_player")),
    match: new (require("./create_match"))
  }

  var tracking = false

  var trackChange = function(action, params) {
    if (tracking) {
      changes.push({
        action: action,
        params: params
      })
    }
  }

  var replayChange = function(change) {
    tournament[change.action].apply(tournament, change.params)
  }

  var tournament = {

    serialize: function() {
      return {
        options: options,
        changes: changes
      }
    },

    standings: function() {
      return _.chain(players)
        .sortBy("id")
        .value()
    },

    fixtures: function() {
      return _.chain(matches)
        .value()
    },

    addPlayer: function(name) {
      var player = generators.player.create(name, options)
      players[player.id] = player

      trackChange("addPlayer", arguments)

      return player
    },

    addMatch: function(player_1, player_2) {
      var match = generators.match.create([player_1, player_2], options)
      matches.push(match)
      players[player_1].matches.push(match.id)
      players[player_2].matches.push(match.id)

      trackChange("addMatch", arguments)

      return match
    },

    setResult: function(match_id, result) {
      var match = _.find(matches, function(match){
        return (match.id === match_id)
      })

      if (!match) {
        return false
      }

      match.result = result
      match.state = "Completed"
      
      match.players.forEach(function(player_id){
        var player = players[player_id]
        var matchResult = result.players[player_id]
        
        player.record[matchResult.outcome]++

        if (options.keepScore) {
          player.record.pf += (matchResult.pf || 0)
          player.record.pa += (matchResult.pa || 0)
        }
      })

      trackChange("setResult", arguments)

      return match
    }

  }

  options.players.forEach(tournament.addPlayer)
  changes.forEach(replayChange)
  tracking = true

  return tournament
}

var _create = function(options) {
  return createTournament(options)
}

var _deserialize = function(serialized) {
  return createTournament(serialized.options, serialized.changes)
}

module.exports = {
  create: _create,
  deserialize: _deserialize
}