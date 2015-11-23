var expect = require("chai").expect
var subject = require("../../../formats/round-robin/create_player")

describe("pickup/create_player", function(){

  it("returns an instantiable function", function(){
    expect(subject).to.be.a("function")
    expect(new subject()).to.be.an("object")
  })

  it("instantiates an object with a method", function(){
    expect(new subject()).to.have.keys(["create"])
  })

  it("creates new players with increasing ids", function(){
    var s = new subject()
    expect(s.create("first").id).to.equal("p_1")
    expect(s.create("second").id).to.equal("p_2")

    s = new subject()
    expect(s.create("first").id).to.equal("p_1")
  })

  it("creates new players with properties", function(){
    var s = new subject()
    expect(s.create("first")).to.deep.equal({
      id: "p_1",
      name: "first",
      record: {
        win: 0,
        loss: 0
      },
      matches: []
    })
  })

  it("accepts options", function(){
    var s = new subject()
    expect(s.create("first", { keepScore: true })).to.deep.equal({
      id: "p_1",
      name: "first",
      record: {
        win: 0,
        loss: 0,
        pf: 0,
        pa: 0
      },
      matches: []
    })

    expect(s.create("second", { ties: true })).to.deep.equal({
      id: "p_2",
      name: "second",
      record: {
        win: 0,
        loss: 0,
        tie: 0
      },
      matches: []
    })

  })

})