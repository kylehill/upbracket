var _ = require("underscore")

var createTournament = function(options, changes) {
  options = _.extend({
    players: [],
    keepScore: false,
    ties: false,
    created_at: new Date().valueOf()
  }, options || {})

  changes = changes || []

  var matches = []
  var players = {}

  var generators = {
    player: new (require("./create_player"))(options),
    pairings: new (require("./create_pairings"))(options)
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

  var repair = function() {
    var ids = Object.keys(players).sort()
    matches = generators.pairings.create(ids)

    var playerFixtures = matches.reduce(function(memory, game){
      game.players.forEach(function(player){
        memory[player] = memory[player] || []
        memory[player].push(game.id)
      })
      return memory
    }, {})

    players = _.mapObject(players, function(val, key){
      val.matches = playerFixtures[key] || []
      return val
    })
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

      repair()

      trackChange("addPlayer", arguments)

      return player
    },

    resetMatches: function() {
      repair()

      trackChange("resetMatches", arguments)
      return this.fixtures()
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