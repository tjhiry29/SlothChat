let router  = require('express').Router();


router.get('/', (req, res) => {
    res.render('default', {
        title: 'Basically Twitch Chat'
    });
});


module.exports = router;
