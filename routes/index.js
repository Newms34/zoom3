var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	res.sendFile('index.html',{"root":'./views'});
});
router.get('/mobile',function(req,res,next){
	res.sendFile('mobile.html',{"root":'./views'});
})
router.get('/desktop',function(req,res,next){
	res.sendFile('desktop.html',{"root":'./views'});
})
router.get('/pod',function(req,res,next){
	res.sendFile('pod.html',{"root":'./views'});
})
module.exports=router;