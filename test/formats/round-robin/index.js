var expect = require("chai").expect
var subject = require("../../../formats/round-robin")

describe("pickup", function(){

  it("should be an object", function(){
    expect(subject).to.be.an("object")
    expect(subject).to.have.keys([ "create", "deserialize" ])
  })

  it("should instantiate", function(){
    expect(subject.create()).to.be.an("object")
    expect(subject.create()).to.have.keys([
      "serialize",
      "standings",
      "fixtures",
      "addPlayer",
      "resetMatches",
      "setResult"
    ])
  })

  it("should serialize an instance", function(){
    var t = subject.create({ created_at: 1 })

    expect(t.serialize()).to.be.an("object")
    expect(t.serialize()).to.deep.equal({
      options: {
        keepScore: false,
        ties: false,
        players: [],
        created_at: 1
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

  it("should automatically create matches", function(){
    var t = subject.create({
      players: [ "first", "second", "third" ]
    })

    expect(t.fixtures().length).to.equal(3)
    expect(t.serialize().changes.length).to.equal(0)

    t.addPlayer("fourth")
    expect(t.fixtures().length).to.equal(6)
    expect(t.serialize().changes.length).to.equal(1)
  })

  it("should create matches with rounds and states", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")
    t.addPlayer("third")
    t.addPlayer("fourth")

    expect(t.fixtures()[0].round).to.equal(1)
    expect(t.fixtures()[2].round).to.equal(2)
    expect(t.fixtures()[3].state).to.equal("Scheduled")
  })

  it("should set results", function(){
    var t = subject.create()

    t.addPlayer("first")
    t.addPlayer("second")
    
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

})
