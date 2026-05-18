// Description:
//   Description of the script's purpose.
//
// Configuration:
//   HUBOT_EXAMPLE_VARIABLE - Example of a variable set at configuration.
//
// Commands:
//   hubot hello - Gets a message
//   hubot hello <message> - Sends a message
//

module.exports = (robot) => {
  // Example: Centralized request handler
  const makeAPIRequest = (method, path, payload) => {
    return new Promise((resolve, reject) => {
      if (method.toUpperCase() === 'GET') {
        robot.http(`https://api.example.com/${path}`)
          .headers({
            'x-api-key': process.env.HUBOT_EXAMPLE_API_KEY,
          })
          .query(payload)
          .get()((err, res, body) => {
            if (err) return reject(err);
            resolve({ res, body });
          });
        return;
      }

      if (method.toUpperCase() === 'POST') {
        const data = JSON.stringify(payload);
        robot.http(`https://api.example.com/${path}`)
          .headers({
            'x-api-key': process.env.HUBOT_EXAMPLE_API_KEY,
          })
          .post(data)((err, res, body) => {
            if (err) return reject(err);
            resolve({ res, body });
          });
        return;
      }

      reject(new Error(`Invalid method: ${method}`));
    });
  };

  // Centralized adapter detection - returns adapter type for format handling
  // Extensible to support multiple custom response formats in the future
  function getAdapterType() {
    const adapterName = robot?.adapterName ?? robot?.adapter?.name;

    if (/slack/i.test(adapterName)) {
      return 'slack';
    }

    return 'default';
  }

  // Example: Calls an API with a GET request
  robot.respond(/hello:get$/i, async (msg) => {
    robot.logger.debug('Calling hello:get');

    try {
      const { body } = await makeAPIRequest('GET', 'v1/status.json', {});
      const apiResponse = JSON.parse(body);
      msg.send(`GET: ${apiResponse.message}`);
    } catch (err) {
      robot.logger.error(err);
      msg.send(err.toString());
    }
  });

  // Example: Calls an API with a POST request
  robot.respond(/hello:post (.*)/i, async (msg) => {
    robot.logger.debug('Calling hello:post');
    const payload = msg.match[1];

    try {
      const { body } = await makeAPIRequest('POST', 'v1/status', { payload });
      const apiResponse = JSON.parse(body);
      msg.send(`POST: ${apiResponse.status}`);
    } catch (err) {
      robot.logger.error(err);
      msg.send(err.toString());
    }
  });

  // Example: Alter the appearance based on the adapter in use
  robot.respond(/slack test/i, (msg) => {
    if (getAdapterType() == 'slack') {
      msg.send({
        attachments: [
          {
            title: 'Slack Test',
            text: 'This message is formatted for Slack.',
            color: '#36a64f',
          },
        ],
      });
      return;
    }
    msg.send('This message is not formatted for Slack.');
  });
};
