var main = require('./index');
var context = {done: function(var1, var2) {console.log(var1), console.log(var2)}}
main.handler('./test', context);
