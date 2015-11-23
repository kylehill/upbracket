var expect = require("chai").expect
var subject = require("../../../formats/pickup")

describe("pickup", function(){

  it("should be an object", function(){
    expect(subject).to.be.an("object")
    expect(subject).to.have.keys([ "create", "deserialize" ])
  })

  it("should create tournaments", function(){
    expect(subject.create()).to.be.an("object")
    expect(subject.create()).to.have.keys([
      "serialize",
      "standings",
      "fixtures",
      "addPlayer",
      "addMatch",
      "setResult"
    ])
  })

  it("should serialize an instance", function(){
    var t = subject.create()

    expect(t.serialize()).to.be.an("object")
    expect(t.serialize()).to.deep.equal({
      options: {
        keepScore: false,
        ties: false,
        players: []
      },
      changes: []
    })
  })

  it("should add players", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")
    t.addPlayer("third")

    expect(t.standings().length).to.equal(3)
  })

  it("should make changes when adding players", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")
    t.addPlayer("third")

    expect(t.serialize().changes.length).to.equal(3)
  })

  it("should add matches", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")

    t.addMatch("p_1", "p_2")

    expect(t.fixtures().length).to.equal(1)
    expect(t.standings()[0].matches).to.deep.equal([ "m_1" ])
  })

  it("should make changes when adding matches", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")

    t.addMatch("p_1", "p_2")

    expect(t.serialize().changes.length).to.equal(3)
  })

  it("should set results", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")
    t.addMatch("p_1", "p_2")

    var result = {
      winner: "p_1",
      players: {
        p_1: {
          outcome: "win"
        },
        p_2: {
          outcome: "loss"
        }
      }
    }
    t.setResult("m_1", result)

    expect(t.fixtures()[0].state).to.equal("Completed")
    expect(t.fixtures()[0].result).to.deep.equal(result)
    
    expect(t.standings()[0]).to.deep.equal({
      id: "p_1",
      name: "first",
      record: { win: 1, loss: 0 },
      matches: [ "m_1" ]
    })
  })

  it("should allow players in the options", function(){
    var t = subject.create({ players: [
      "alpha",
      "beta",
      "charlie",
      "delta"
    ]})

    expect(t.standings().length).to.equal(4)
    expect(t.serialize().changes.length).to.equal(0)
  })

  it("should allow ties", function(){
    var t = subject.create({ ties: true })

    t.addPlayer("first")
    t.addPlayer("second")
    t.addMatch("p_1", "p_2")

    var result = {
      winner: "tie",
      players: {
        p_1: {
          outcome: "tie"
        },
        p_2: {
          outcome: "tie"
        }
      }
    }
    t.setResult("m_1", result)

    expect(t.standings()[0]).to.deep.equal({
      id: "p_1",
      name: "first",
      record: { win: 0, loss: 0, tie: 1 },
      matches: [ "m_1" ]
    })
  })

  it("should allow keeping score", function(){
    var t = subject.create({ keepScore: true })

    t.addPlayer("first")
    t.addPlayer("second")
    t.addMatch("p_1", "p_2")

    var result = {
      winner: "p_1",
      players: {
        p_1: {
          outcome: "win",
          pf: 10,
          pa: 7
        },
        p_2: {
          outcome: "loss",
          pf: 7,
          pa: 10
        }
      }
    }
    t.setResult("m_1", result)

    expect(t.standings()[0]).to.deep.equal({
      id: "p_1",
      name: "first",
      record: { win: 1, loss: 0, pf: 10, pa: 7 },
      matches: [ "m_1" ]
    })
  })

  it("should deserialize correctly", function(){
    var t = subject.create({ ties: true })
    t.addPlayer("first")
    t.addPlayer("second")
    t.addPlayer("third")

    t.addMatch("p_1", "p_2")
    t.addMatch("p_1", "p_3")
    t.addMatch("p_2", "p_3")

    t.setResult("m_2", {
      winner: "p_3",
      players: {
        p_1: {
          outcome: "loss"
        },
        p_3: {
          outcome: "win"
        }
      }
    })

    t.setResult("m_1", {
      winner: "tie",
      players: {
        p_1: {
          outcome: "tie"
        },
        p_2: {
          outcome: "tie"
        }
      }
    })

    var serialized = t.serialize()
    expect(serialized.options).to.deep.equal({
      ties: true,
      keepScore: false,
      players: []
    })

    expect(serialized.changes.length).to.equal(8)
    
    var d = subject.deserialize(serialized)

    expect(d.fixtures().length).to.equal(3)
    expect(d.fixtures()[0].state).to.equal("Completed")
    expect(d.fixtures()[2].state).to.equal("Scheduled")
    expect(d.standings().length).to.equal(3)
    
    expect(d.standings()[0]).to.deep.equal({
      id: "p_1",
      name: "first",
      matches: [ "m_1", "m_2" ],
      record: {
        win: 0,
        loss: 1,
        tie: 1
      }
    })

    expect(d.serialize().changes.length).to.equal(8)

  })

})
