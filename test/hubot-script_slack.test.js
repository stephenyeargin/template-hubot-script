const Helper = require('./helpers/hubot-helper');
const nock = require('nock');

const helper = new Helper([
  './test/adapters/slack.js',
  './src/hubot-script.js',
]);

describe('hubot-script slack', () => {
  let room = null;

  beforeEach(async () => {
    room = await helper.createRoom();
    nock.disableNetConnect();

    // Mock robot.logger methods
    ['debug', 'info', 'warning', 'error'].forEach((method) => {
      room.robot.logger[method] = vi.fn();
    });
  });

  afterEach(() => {
    room.destroy();
    nock.cleanAll();
  });

  // Example: Return a Slack formatted message when using adapter
  describe('ask hubot to return a Slack message', () => {
    beforeEach(async () => {
      await room.user.say('alice', 'hubot slack test');
    });

    it('hubot responds with message', () => expect(room.messages).toEqual([
      ['alice', 'hubot slack test'],
      ['hubot', {
        attachments: [
          {
            title: 'Slack Test',
            text: 'This message is formatted for Slack.',
            color: '#36a64f',
          },
        ],
      }],
    ]));
  });
});
