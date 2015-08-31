Store = require 'fluxible/addons/BaseStore'

STORAGE_KEY = "currentItinerary"

class ItinerarySearchStore extends Store
  @storeName: 'ItinerarySearchStore'

  constructor: (dispatcher) ->
    super(dispatcher)
    @data = if d = window?.localStorage?.getItemSTORAGE_KEY then JSON.parse(d) else {}

  getData: ->
    @data

  storeItinerarySearch: (data) ->
    @data = data
    @emitChange()
    window.localStorage.setItem STORAGE_KEY, JSON.stringify @data

  clearItinerary: ->
    @data = {}
    @emitChange()

  dehydrate: ->
    @data

  rehydrate: (data) ->
    @data = data

  @handlers:
    "ItineraryFound": 'storeItinerarySearch'
    "ItinerarySearchStarted": 'clearItinerary'

module.exports = ItinerarySearchStore