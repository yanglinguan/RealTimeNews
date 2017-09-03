const express = require('express');
const rpc_client = require('../rpc_client/rpc_client');
const router = express.Router();

// GET news summary list
router.get('/userId/:userId/pageNum/:pageNum', function(req, res, next) {
  console.log('Fetching news...');
  user_id = req.params['userId'];
  page_num = req.params['pageNum'];

  rpc_client.getNewsSummariesForUser(user_id, page_num, function(response) {
    res.json(response);
  });

  res.json(news);
});

module.exports = router;
