# Description:
#   Description of the script's purpose.
#
# Configuration:
#   HUBOT_EXAMPLE_VARIABLE - Example of a variable set at configuration.
#
# Commands:
#   hubot hello - Gets a message
#   hubot hello <message> - Sends a message
#

module.exports = (robot) ->

  # Example: Centralized request handler
  makeAPIRequest = (method, path, payload, callback) ->

    if method.toUpperCase() == 'GET'
      robot.http("https://api.example.com/#{path}")
        .headers({
          'x-api-key': process.env.HUBOT_EXAMPLE_API_KEY
        })
        .query(payload)
        .get() (err, res, body) ->
          callback(err, res, body)
          return

    if method.toUpperCase() == 'POST'
      data = JSON.stringify(payload)
      robot.http("https://api.example.com/#{path}")
        .headers({
          'x-api-key': process.env.HUBOT_EXAMPLE_API_KEY
        })
        .post(data) (err, res, body) ->
          callback(err, res, body)
          return

    # robot.logger.error("Invalid method: #{method}")
    # callback('Invalid method!')

  # Example: Calls an API with a GET request
  robot.respond /hello:get$/i, (msg) ->
    makeAPIRequest 'GET', 'v1/status.json', {}, (err, res, body) ->
      if err
        robot.logger.error err
        msg.send "Error: #{err}"
        return

      apiResponse = JSON.parse(body)

      msg.send "GET: #{apiResponse.message}"

  # Example: Calls an API with a POST request
  robot.respond /hello:post (.*)/i, (msg) ->
    payload = msg.match[1]

    makeAPIRequest 'POST', 'v1/status', { payload }, (err, res, body) ->
      if err
        robot.logger.error err
        msg.send "Error: #{err}"
        return

      # Parse list of stations
      apiResponse = JSON.parse(body)

      msg.send "POST: #{apiResponse.status}"
