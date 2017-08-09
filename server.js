/*
 * @author Farahmand Moslemi
 */

// https://docs.mongodb.com/v3.0/tutorial/create-an-auto-incrementing-field/#use-counters-collection
/* Created a `counter` collection with this initial document:
 * {
 *   "_id": "shorturl",
 *   "seq": 0
 * }
 * Then used a `findAndModify` method to increment the `seq` field.
 */

var express = require('express'), url = require('url');

// For local tests: http://localhost:13000/
if(!process.env.MONGOURL) {
  process.env.MONGOURL = require('./.env.js').MONGOURL;
  process.env.PORT = 13000;
}

var app = express();
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  res.render('index', {base: 'https://' + req.hostname});
});

app.get('/:p*', function(req, res) {
  var mongo = require('mongodb').MongoClient;
  var base = 'https://' + req.hostname;
  var param = req.params.p, data, original_url, short_url;
  if (param == Number(param)) {
    param = Number(param);
    mongo.connect(process.env.MONGOURL, function(err, db) {
      if(err) throw err;
      var collection = db.collection('shorturls');
      collection.findOne({_id: param}).then(function (row) {
        db.close();
        if (row) {
          original_url = row.url;
          //TODO redirection
          return res.redirect(original_url);
        } else {
          return res.json({error: 'Invalid shortened Url! Make sure you enter a valid one.'});
        }
      });
    });
  } else {
    var u = url.parse(req.url);
    u = url.parse(u.path.slice(1));
    original_url = u.href;
    if (/^https?:\/\/[a-z0-9_-]+(\.{1}[a-z0-9_-]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/.test(original_url)){
      //console.log('valid url');
      mongo.connect(process.env.MONGOURL, function(err, db) {
        if(err) throw err;
        var collection = db.collection('shorturls');
        collection.findOne({url: original_url}).then(function (row) {
          if(row && row.url == original_url) {
            db.close();
            //console.log('y');
            original_url = row.url;
            short_url = base + '/' + row._id;
            return res.json({original_url: original_url, short_url: short_url});
          } else {
            var counters = db.collection('counters');
            //counters.findAndModify({query: {_id: "shorturl"}, update: {$inc: {seq: 1}}, new: true}, function(err, row) { // It hase the syntax like below:
            counters.findAndModify({_id: "shorturl"}, [], {$inc: {seq: 1}}, {new: true}, function(err, row) {
              if(err) throw err;
              //console.log(row.value.seq);
              collection.insertOne({_id: row.value.seq, url: original_url}, function(err, data) {
                db.close();
                if(err) throw err;
                short_url = base + '/' + row.value.seq;
                return res.json({original_url: original_url, short_url: short_url});
              });
            });
          }
        });
      });
    } else {
      return res.json({error: 'Invalid Url! Make sure you enter a valid Url.'});
    }
  }
  //return res.end(); // I used async opreations (mongodb), so headers should not be sent before redirection.
  //res.send(data);
});
app.listen(parseInt(process.env.PORT));