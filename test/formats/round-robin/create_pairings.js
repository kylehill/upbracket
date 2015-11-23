var expect = require("chai").expect
var subject = require("../../../formats/round-robin/create_pairings")

describe("round-robin/create_pairings", function(){

  it("returns an instantiable function", function(){
    expect(subject).to.be.a("function")
    expect(new subject()).to.be.an("object")
  })

  it("instantiates an object with a method", function(){
    expect(new subject()).to.have.keys([
      "create",
      "shuffle"
    ])
  })

  it("shuffles predictably", function(){
    var s = new subject({ created_at: 1 })

    var players = [ "a", "b", "c", "d", "e" ]
    expect(s.shuffle(players))
      .to.deep.equal([ "a", "b", "d", "e", "c" ])
    expect(players)
      .to.deep.equal([ "a", "b", "c", "d", "e" ])

    expect(s.shuffle(players))
      .to.deep.equal([ "b", "d", "a", "c", "e" ])

    s = new subject({ created_at: 1 })
    expect(s.shuffle(players))
      .to.deep.equal([ "a", "b", "d", "e", "c" ])

    s = new subject({ created_at: 1001 })
    expect(s.shuffle(players))
      .to.deep.equal([ "e", "c", "b", "d", "a" ])
  })

  it("creates rounds", function(){
    var s = new subject()
    var t = s.create([ "a", "b", "c", "d", "e", "f", "g" ])

    expect(t.length).to.equal(21)
    expect(t[0]).to.deep.equal({
      id: "m_1",
      number: 1,
      players: [ "b", "d" ],
      result: {},
      state: "Scheduled",
      round: 1
    })

    // Subsequent pairings should be different
    t = s.create([ "a", "b", "c", "d", "e", "f", "g" ])
    expect(t[0]).to.deep.equal({
      id: "m_1",
      number: 1,
      players: [ "c", "d" ],
      result: {},
      state: "Scheduled",
      round: 1
    })

    t = s.create([ "a", "b", "c", "d", "e", "f" ])
    expect(t.length).to.equal(15)
  })

})
