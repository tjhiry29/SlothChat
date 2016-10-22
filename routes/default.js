let router  = require('express').Router();


router.get('/', (req, res) => {
    res.render('default', {
        title: 'Basically Twitch Chat',
        scripts: ['/public/js/default.js',
        		  '/public/lib/marked.js']
    });
});


module.exports = router;
