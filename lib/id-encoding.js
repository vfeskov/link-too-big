// Number System
const { randomBytes } = require('crypto');
const { round } = Math;
const NS = ('0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y ' +
            'z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z _ -').split(' ');
const NS_BASE = NS.length;
const RND_STRLEN = 4;

module.exports = {
  NS,
  RND_STRLEN,

  encode (id, random) {
    let code = '';
    while (id > 0) {
      code = NS[id % NS_BASE] + code;
      id = Math.floor(id / NS_BASE);
    }
    return random + code;
  },

  decode (code) {
    const random = code.slice(0, RND_STRLEN);
    code = code.slice(RND_STRLEN);
    const id = code
      .split('')
      .reduce((id, letter, index) => {
        const power = (code.length - index - 1);
        return id + NS.indexOf(letter) * NS_BASE**power;
      }, 0);
    return { id, random };
  },

  randomString () {
    const chars = Array.from(Array(RND_STRLEN), () =>
      new Promise((resolve, error) => {
        randomBytes(1, (err, buf) => {
          if (err) { error(err); }
          resolve(NS[buf[0] % NS_BASE]);
        })
      })
    );
    return Promise.all(chars).then(c => c.join(''));
  }
}

