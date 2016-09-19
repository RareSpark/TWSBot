import config from '../../config';
import { createClient } from 'wolfram-alpha';
import { getRandom, errorResponses } from '../util';

const wolfram = createClient(config.wolframToken);

class Command {

  constructor() {
    this.aliases = ['convert', 'query', 'q', 'question', 'question\,'];
  }

  run(payload) {

    const { content } = payload.message;
    const split = content.split(' ');
    const command = split[1];
    let query = content.replace(/\S+ /, '');

    if (command === 'q' || command === 'query') {
      query = content.replace(/\S+ \S+ /, '');
    }

    wolfram.query(query, (error, result) => {

      if (error || result.length === 0) {
        payload.message.channel.sendMessage(errorResponses[getRandom(0,errorResponses.length)]);
        return console.log(error);
      }

      const res = result[1];

      if (res && res.subpods && res.subpods[0]) {
        payload.message.channel.sendMessage(res.subpods[0].text);
      }

    });

  }

}

module.exports = new Command();
