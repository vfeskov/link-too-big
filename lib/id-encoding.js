// Number System
const NS = ('0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y ' +
            'z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z _ -').split(' ');
const NS_BASE = NS.length;
module.exports = {
  NS,

  encode (id) {
    let code = '';
    while (id > 0) {
      code = NS[id % NS_BASE] + code;
      id = Math.floor(id / NS_BASE);
    }
    return code;
  },

  decode (code) {
    return code.split('').reduce((id, letter, index) => {
      const power = (code.length - index - 1);
      return id + NS.indexOf(letter) * NS_BASE**power;
    }, 0);
  }
}
