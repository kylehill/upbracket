Specification:

Each format is a separate module, implementing the following:

---

Static.create(options)
Returns an instance of the tournament object.

Static.deserialize(serialized)
Returns an instance of the tournament from serialized data.

---

Tournament.id
Unique id string in the format t_[number].

Tournament.serialize()
Returns the tournament data, serialized.

Tournament.standings()
Returns the array of players in any stages of this tournament,
their aggregate records, and their elimination/progression status.

Tournament.fixtures()
Returns the array of matches in all stages of this tournament.

Tournament.setState(state)
Sets the state of this tournament (to one of "Scheduled",
"In Progress", or "Completed")

Tournament.setResult(match_id, result)
Sets the result for the specified match in this tournament.
Returns false if the specified match is not in this tournament.


