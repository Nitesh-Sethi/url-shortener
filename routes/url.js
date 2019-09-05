const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const schema = require('../model/schema');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', async (req, res) => {
    const { longUrl } = req.body;
    return schema.findOne({ longUrl: longUrl })
        .then((url) => {
            if (url) {
                res.render('index', {
                    link: url.shortUrl
                });
            } else {
                // generating shortid
                const shortCode = shortid.generate();
                const shortUrl = `http://localhost:5000/` + shortCode;
                console.log(shortUrl, shortCode);
                let myData = new schema({
                    longUrl,
                    shortCode,
                    shortUrl
                });

                myData.save(function (err) {
                    if (err) console.log(`err: ${err.message}`);
                })
                res.render('index', {
                    link: url.shortUrl
                });
            }
        })
        .catch((err) => {
            console.error(err);
        });
})

router.get('/:id', async (req, res) => {
    try {
        const urlCode = req.params.id;
        const item = await schema.findOne({ shortCode: urlCode });
        if (item) {
            return res.redirect(item.longUrl);
        } else {
            return res.send(`Error occured. No URL found with this id.`);
        }
    } catch (err) {
        return res.status(500).json(`Server technical error: ${err.message}`);
    }
})

module.exports = router;