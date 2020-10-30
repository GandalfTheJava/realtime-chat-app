const express = require('express');
const router = express.Router();

const HOSTEDADDRESS = 'https://realtime-chatapp-frontend.herokuapp.com';
router.get('/', (req,res) => {
    res.send(`This is a server for a real-time chat application hosted on: ${HOSTEDADDRESS}`);
});

module.exports = router;