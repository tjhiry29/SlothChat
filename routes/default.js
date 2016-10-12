let router  = require('express').Router();


router.get('/', (req, res) => {
    res.render('default', {
        title: 'TEST'
    });
});


module.exports = router;
