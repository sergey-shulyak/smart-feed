const mimir = require('mimir');
const brain = require('brain.js');

function vec_result(res, num_classes) {
  var i = 0,
    vec = [];
  for (i; i < num_classes; i += 1) {
    vec.push(0);
  }
  vec[res] = 1;
  return vec;
}

function maxarg(array) {
  return array.indexOf(Math.max.apply(Math, array));
}

var texts = [
  "The end of the Viking-era in Norway is marked by the Battle of Stiklestad in 1030",
  "The end of the Viking Age is traditionally marked in England by the failed invasion attempted by the Norwegian king Harald III ",
  "The earliest date given for a Viking raid is 787 AD when, according to the Anglo-Saxon Chronicle, a group of men from Norway sailed to the Isle of Portland in Dorset",

  "A programming language is a formal constructed language designed to communicate instructions to a machine, particularly a computer. Programming languages can be used to create programs to control the behavior of a machine or to express algorithms.",
  "Thousands of different programming languages have been created, mainly in the computer field, and many more still are being created every year.",
  "The description of a programming language is usually split into the two components of syntax (form) and semantics (meaning). Some languages are defined by a specification document (for example, the C programming language is specified by an ISO Standard), while other languages (such as Perl) have a dominant implementation that is treated as a reference",

  "Classical music is art music produced or rooted in the traditions of Western music (both liturgical and secular)",
  "European music is largely distinguished from many other non-European and popular musical forms by its system of staff notation, in use since about the 16th century",
  "classical music has been noted for its development of highly sophisticated forms of instrumental music."
]

const Categories = {
  HISTORY: 0,
  PROGRAMMING: 1,
  MUSIC: 2
}

// const prediction = preceptron.run(TEST_HISTORY_TEXT);
// console.log(prediction)


var categoryArray = Object.keys(Categories),

  dict = mimir.dict(texts)

traindata = [
  [mimir.bow(texts[0], dict), Categories.HISTORY],
  [mimir.bow(texts[1], dict), Categories.HISTORY],
  [mimir.bow(texts[2], dict), Categories.HISTORY],
  [mimir.bow(texts[3], dict), Categories.PROGRAMMING],
  [mimir.bow(texts[4], dict), Categories.PROGRAMMING],
  [mimir.bow(texts[5], dict), Categories.PROGRAMMING],
  [mimir.bow(texts[6], dict), Categories.MUSIC],
  [mimir.bow(texts[7], dict), Categories.MUSIC],
  [mimir.bow(texts[8], dict), Categories.MUSIC]
];

test_history = 'The beginning of the Viking Age in the British Isles is, however, often given as 793.',
  test_music = 'Baroque music is a style of Western art music composed from approximately 1600 to 1750',
  test_bow_history = mimir.bow(test_history, dict),
  test_bow_music = mimir.bow(test_music, dict);

var net = new brain.NeuralNetwork(),
  ann_train = traindata.map(function (pair) {
    return {
      input: pair[0],
      output: vec_result(pair[1], 3)
    };
  });
net.train(ann_train);

var predict = net.run(test_bow_history);

const test_bow_propgr = mimir.bow("programming language is specified by an ISO Standard", dict);


console.log(`Test text: ${test_history}`);
console.log(`Probabilities: ${JSON.stringify(predict.map((prediction, index) => ({
    [categoryArray[index]]: prediction
})), null, 2)}`);
// console.log(`Most probable: ${maxarg(predict)}`);
console.log(`Most probable text category: ${categoryArray[maxarg(predict)].toLowerCase()}`);
// console.log(classes_array[maxarg(net.run(test_bow_music))]);
// console.log(classes_array[maxarg(net.run(test_bow_propgr))]);