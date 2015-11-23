var expect = require("chai").expect
var subject = require("../../../formats/round-robin/create_match")

describe("pickup/create_match", function(){

  it("returns an instantiable function", function(){
    expect(subject).to.be.a("function")
    expect(new subject()).to.be.an("object")
  })

  it("instantiates an object with a method", function(){
    expect(new subject()).to.have.keys(["create"])
  })

  it("creates matches with increasing ids", function(){
    var s = new subject()
    
    expect(s.create(["first", "second"]).id).to.equal("m_1")
    expect(s.create(["first", "third"]).id).to.equal("m_2")

    s = new subject()
    
    expect(s.create(["first", "second"]).id).to.equal("m_1")
  })

  it("creates new matches with properties", function(){
    var s = new subject()

    expect(s.create(["first", "second"])).to.deep.equal({
      id: "m_1",
      number: 1,
      players: [ "first", "second" ],
      result: {},
      state: "Scheduled"
    })
  })

  it("creates new matches with round", function(){
    var s = new subject()

    expect(s.create(["first", "second"], { round: 1 })).to.deep.equal({
      id: "m_1",
      number: 1,
      players: [ "first", "second" ],
      result: {},
      state: "Scheduled",
      round: 1
    })
  })

})