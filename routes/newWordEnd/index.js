let express = require('express');
let router = express.Router();
let database = require('../database/database');
let middleware = require('../middleware');
const fs = require('fs');
const multer  = require('multer');
const upload = multer();

router.get('/', middleware.checkToken, async function(req, res) {
  if(req.decoded.privilege<1)
    res.sendStatus(401)
	else
    res.render('newWordEnd');
});

router.get('/getFamily', async function(req, res) {
  let qry = `SELECT * FROM family`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.get('/getLanguage', async function(req, res) {
	let qry = `SELECT * FROM language`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.get('/getCategory', async function(req, res) {
	let qry = `SELECT cate FROM tow_category`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.post('/feWord', async function(req, res) {
  let {id} = req.body;
  let qry = `SELECT * FROM nw_words WHERE id = ${id}`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/feWord', async function(req, res) {
  let {id, ab, mean, description, word_formation, ab_example, ch_example, example_type, remark} = req.body;
  let qry = `
              UPDATE nw_words 
              SET ab = '${ab}', mean = '${mean}', description = '${description}', 
              word_formation = '${word_formation}', ab_example = '${ab_example}', 
              ch_example = '${ch_example}', example_type = '${example_type}', 
              remark = '${remark}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/feWords', async function(req, res) {
  let {year, page} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season = ${year} 
              AND checked = 0;
              SELECT * FROM nw_words 
              WHERE season = ${year}
              AND checked = 0 
              ORDER BY id
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/feReview', async function(req, res) {
  let {id, a1, a2, a3, a4, a5, a6, a7} = req.body;
  let qry = `
              UPDATE nw_words_review
              SET ab_ch = '${a1}', mean = '${a2}', description = '${a3}',
              word_formation = '${a4}', ab_ch_example = '${a5}',
              example_type = '${a6}', remark = '${a7}'
              WHERE word_id = ${id};
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    if(result.affectedRows==0){
      qry = `
              INSERT INTO nw_words_review
              (word_id, ab_ch, mean, description, word_formation, ab_ch_example, example_type, remark)
              VALUES (${id}, '${a1}', '${a2}', '${a3}', '${a4}', '${a5}', '${a6}', '${a7}')

            `;
      database.conn.query(qry, function (err1, result1) {
        if(err) console.log(err1);
        res.send(result1);
      })
    }else{
      res.send(result);
    }
  })
});

router.post('/feReview', async function(req, res) {
  let {id} = req.body;
  let qry = `
              SELECT nw.*, nwr.ab_ch a1, nwr.mean a2, nwr.description a3, nwr.word_formation a4, nwr.ab_ch_example a5, nwr.example_type a6, nwr.remark a7
              FROM nw_words nw 
              LEFT JOIN nw_words_review nwr
              ON nw.id = nwr.word_id
              WHERE nw.id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/feReviews', async function(req, res) {
  let {year, page} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season = ${year} 
              AND checked = 0;
              SELECT nw.*, nwr.ab_ch a1, nwr.mean a2, nwr.description a3, nwr.word_formation a4, nwr.ab_ch_example a5, nwr.example_type a6, nwr.remark a7
              FROM nw_words nw 
              LEFT JOIN nw_words_review nwr
              ON nw.id = nwr.word_id
              WHERE season = ${year}
              AND checked = 0 
              ORDER BY id
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/lcWord', async function(req, res) {
  let {id} = req.body;
  let qry = `SELECT * FROM nw_words WHERE id = ${id}`;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/lcWord', async function(req, res) {
  let {id, ab, mean, description, word_formation, ab_example, ch_example, example_type, remark} = req.body;
  let qry = `
              UPDATE nw_words 
              SET ab = '${ab}', mean = '${mean}', description = '${description}', 
              word_formation = '${word_formation}', ab_example = '${ab_example}', 
              ch_example = '${ch_example}', example_type = '${example_type}', 
              remark = '${remark}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.post('/lcWords', async function(req, res) {
  let {year, page} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_words 
              WHERE season = ${year} 
              AND checked = 1;
              SELECT * FROM nw_words 
              WHERE season = ${year}
              AND checked = 1 
              ORDER BY id ASC
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/article', async function(req, res) {
  let {id} = req.body;
  let qry = `
              SELECT * FROM nw_articles 
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.put('/article', async function(req, res) {
  let {id, ab_content, ab_keyword} = req.body;
  let qry = `
              UPDATE nw_articles 
              SET ab_content = '${ab_content}', ab_keyword = '${ab_keyword}'
              WHERE id = ${id}
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/articles', async function(req, res) {
  let {year, page, name} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_articles 
              WHERE season = ${year} 
              AND name = '${name}'
              AND checked = 0;
              SELECT * FROM nw_articles
              WHERE season = ${year}
              AND name = '${name}'
              AND checked = 0 
              ORDER BY sid, paragraph
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/articlesName', async function(req, res) {
  let {year} = req.body;
  let qry = `
              SELECT name FROM nw_articles
              WHERE season = ${year}
              AND checked = 0 
              GROUP BY name
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.put('/changeWordStatus', middleware.checkToken, async function(req, res) {
  let {id, checked} = req.body;
  let qry = `
              UPDATE nw_words
              SET checked = ${checked}
              WHERE id = ${id}
            `;
  if(req.decoded.privilege>1) {
    database.conn.query(qry, function (err, result) {
      res.send(result);
    })
  }else{
    res.send(false);
  }
});

router.put('/arReview', async function(req, res) {
  let {id, a1} = req.body;
  let qry = `
              UPDATE nw_articles_review
              SET ab_ch_content = '${a1}'
              WHERE article_id = ${id};
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    if(result.affectedRows==0){
      qry = `
              INSERT INTO nw_articles_review
              (article_id, ab_ch_content)
              VALUES (${id}, '${a1}')
            `;
      database.conn.query(qry, function (err1, result1) {
        if(err) console.log(err1);
        res.send(result1);
      })
    }else{
      res.send(result);
    }
  })
});

router.post('/arReview', async function(req, res) {
  let {id} = req.body;
  let qry = `
              SELECT na.*, nar.ab_ch_content a1 
              FROM nw_articles na
              LEFT JOIN nw_articles_review nar
              ON na.id = nar.article_id
              WHERE na.id = ${id};
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.post('/arReviews', async function(req, res) {
  let {year, page, name} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_articles 
              WHERE season = ${year} 
              AND name = '${name}'
              AND checked = 0;
              SELECT na.*, nar.ab_ch_content a1 
              FROM nw_articles na
              LEFT JOIN nw_articles_review nar
              ON na.id = nar.article_id
              WHERE season = ${year}
              AND name = '${name}'
              AND checked = 0 
              ORDER BY paragraph
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});

router.put('/changeArticleStatus', async function(req, res) {
  let {name, checked} = req.body;
  let qry = `
              UPDATE nw_articles
              SET checked = ${checked}
              WHERE name = '${name}'
            `;
  database.conn.query(qry, function (err, result) {
    if(err) console.log(err);
    res.send(result);
  })
});



router.post('/suggest', async function(req, res) {
  let {page} = req.body;
  page = (parseInt(page, 10)-1)*50;
  let qry = `
              SELECT COUNT(*) FROM nw_suggest;
              SELECT * FROM nw_suggest
              ORDER BY id DESC
              LIMIT ${page}, 50
            `;
  database.conn.query(qry, function (err, result) {
    res.send(result);
  })
});

router.put('/feedback', async function(req, res) {
	let {id, feedback} = req.body;
	let qry = `
							UPDATE nw_suggest
              SET feedback = '${feedback}'
              WHERE id = ${id}
						`;
  database.conn.query(qry, function (err, result) {
  	res.send(result);
  })
});

router.post('/saveAudio', upload.single('audio_data'), async function(req, res) {
  let path = '';
  let tmppath = __dirname.split('/');
  tmppath.pop();
  tmppath.pop();
  for(let i=0;i<tmppath.length;i++){
    path += tmppath[i] + '/';
  }
  let uploadLocation = path + 'public/audio/newWord/' + req.file.originalname + '.wav';
  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200);
});

router.post('/file', async function(req, res) {
  let {name} = req.body;
  let path = '';
  let tmppath = __dirname.split('/');
  tmppath.pop();
  tmppath.pop();
  for(let i=0;i<tmppath.length;i++){
    path += tmppath[i] + '/';
  }
  path += 'public/audio/newWord'
  fs.readdir(path, function(err, items) {
    let find = items.find(x => x == `${name}.wav`);
    res.send(find);
  });
});

router.get('/files', async function(req, res) {
  let path = '';
  let tmppath = __dirname.split('/');
  tmppath.pop();
  tmppath.pop();
  for(let i=0;i<tmppath.length;i++){
    path += tmppath[i] + '/';
  }
  path += 'public/audio/newWord'
  fs.readdir(path, function(err, items) {
    res.send(items);
  });
});

module.exports = router;
