var mimir = require('mimir'),
    brain = require('brain.js');

/* few utils for the example */
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

// train data
var ANN_Classes = {
        HISTORY: 0,
        PROGRAMMING: 1,
        MUSIC: 2,
        DATABASE: 3
    },
    classes_array = Object.keys(ANN_Classes), //['HISTORY', 'PROGRAMMING', 'MUSIC'],
    texts = [
        // history
        "The end of the Viking-era in Norway is marked by the Battle of Stiklestad in 1030",
        "The end of the Viking Age is traditionally marked in England by the failed invasion attempted by the Norwegian king Harald III ",
        "The earliest date given for a Viking raid is 787 AD when, according to the Anglo-Saxon Chronicle, a group of men from Norway sailed to the Isle of Portland in Dorset",
        // programming
        "A programming language is a formal constructed language designed to communicate instructions to a machine, particularly a computer. Programming languages can be used to create programs to control the behavior of a machine or to express algorithms.",
        "Thousands of different programming languages have been created, mainly in the computer field, and many more still are being created every year.",
        "The description of a programming language is usually split into the two components of syntax (form) and semantics (meaning). Some languages are defined by a specification document (for example, the C programming language is specified by an ISO Standard), while other languages (such as Perl) have a dominant implementation that is treated as a reference",
        // music
        "Classical music is art music produced or rooted in the traditions of Western music (both liturgical and secular)",
        "European music is largely distinguished from many other non-European and popular musical forms by its system of staff notation, in use since about the 16th century",
        "classical music has been noted for its development of highly sophisticated forms of instrumental music.",
        // db
        "A database is an organized collection of data.[1] A relational database, more restrictively, is a collection of schemas, tables, queries, reports, views, and other elements. Database designers typically organize the data to model aspects of reality in a way that supports processes requiring information, such as (for example) modelling the availability of rooms in hotels in a way that supports finding a hotel with vacancies.",
        "A database is not generally portable across different DBMSs, but different DBMSs can interoperate by using standards such as SQL and ODBC or JDBC to allow a single application to work with more than one DBMS. Computer scientists may classify database-management systems according to the database models that they support; the most popular database systems since the 1980s have all supported the relational model - generally associated with the SQL language.",
        "Formally, a \"database\" refers to a set of related data and the way it is organized. Access to this data is usually provided by a \"database management system\" (DBMS) consisting of an integrated set of computer software that allows users to interact with one or more databases and provides access to all of the data contained in the database (although restrictions may exist that limit access to particular data). The DBMS provides various functions that allow entry, storage and retrieval of large quantities of information and provides ways to manage how that information is organized."
    ],
    dict = mimir.dict(texts),
    traindata = [
        [mimir.bow(texts[0], dict), ANN_Classes.HISTORY],
        [mimir.bow(texts[1], dict), ANN_Classes.HISTORY],
        [mimir.bow(texts[2], dict), ANN_Classes.HISTORY],
        [mimir.bow(texts[3], dict), ANN_Classes.PROGRAMMING],
        [mimir.bow(texts[4], dict), ANN_Classes.PROGRAMMING],
        [mimir.bow(texts[5], dict), ANN_Classes.PROGRAMMING],
        [mimir.bow(texts[6], dict), ANN_Classes.MUSIC],
        [mimir.bow(texts[7], dict), ANN_Classes.MUSIC],
        [mimir.bow(texts[8], dict), ANN_Classes.MUSIC],
        [mimir.bow(texts[9], dict), ANN_Classes.DATABASE],
        [mimir.bow(texts[10], dict), ANN_Classes.DATABASE],
        [mimir.bow(texts[11], dict), ANN_Classes.DATABASE]
    ],
    test_history = "The beginning of the Viking Age in the British Isles is, however, often given as 793.",
    test_music = "Baroque music is a style of Western art music composed from approximately 1600 to 1750",
    test_database = "Databases have evolved since their inception in the 1960s, beginning with hierarchical and network databases, through the 1980s with object-oriented databases, and today with SQL and NoSQL databases and cloud databases.",
    test_bow_history = mimir.bow(test_history, dict),
    test_bow_music = mimir.bow(test_music, dict),
    test_bow_database = mimir.bow(test_database, dict);

var net = new brain.NeuralNetwork(),
    ann_train = traindata.map(function (pair) {
        return {
            input: pair[0],
            output: vec_result(pair[1], 4)
        };
    });

net.train(ann_train);
console.log('------------------- ANN (brain) ----------------------');
var predict = net.run(test_bow_history);
console.log(predict);
// console.log(classes_array[maxarg(predict)]); // prints HISTORY
// console.log(classes_array[maxarg(net.run(test_bow_music))]); // prints MUSIC
console.log(classes_array[maxarg(net.run(test_bow_database))]); // prints DATABASE
