Helper = require('hubot-test-helper')
chai = require 'chai'
nock = require 'nock'

expect = chai.expect

helper = new Helper('../src/hubot-script.coffee')

describe 'template-hubot-script', ->
  beforeEach ->
    nock.disableNetConnect()

  afterEach ->
    nock.cleanAll()

  context 'hubot-script tests', ->
    beforeEach ->
      process.env.HUBOT_EXAMPLE_API_KEY = 'abcdef'
      @room = helper.createRoom()

    afterEach ->
      @room.destroy()
      delete process.env.HUBOT_EXAMPLE_API_KEY

    # Example: Returning data through an API
    it 'returns data from the API', (done) ->
      nock('https://api.example.com')
        .matchHeader('x-api-key', 'abcdef')
        .get('/v1/status.json')
        .replyWithFile(200, './test/fixtures/sample_api_response.json')

      selfRoom = @room
      selfRoom.user.say('alice', '@hubot hello:get')
      setTimeout(() ->
        try
          expect(selfRoom.messages).to.eql [
            ['alice', '@hubot hello:get']
            ['hubot', "GET: Hello world!"]
          ]
          done()
        catch err
          done err
        return
      , 1000)

    # Example: Testing posting data through an API
    it 'sends data to the API', (done) ->
      nock('https://api.example.com')
        .matchHeader('x-api-key', 'abcdef')
        .post('/v1/status', { payload: 'Hello world!' })
        .reply(200, { status: "Status updated!" })

      selfRoom = @room
      selfRoom.user.say('alice', '@hubot hello:post Hello world!')
      setTimeout(() ->
        try
          expect(selfRoom.messages).to.eql [
            ['alice', '@hubot hello:post Hello world!']
            ['hubot', "POST: Status updated!"]
          ]
          done()
        catch err
          done err
        return
      , 1000)
