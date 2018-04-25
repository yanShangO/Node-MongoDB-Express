var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();

//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});


var questions=[
{
	data:213,
	num:444,
	age:12
},
{
	data:456,
	num:678,
	age:13
}];


app.get('/123',function(req,res){
	res.status(200),
	res.json(questions);
});

var urlParser = bodyParser.urlencoded({extended:false});
var jsonParser = bodyParser.json();
app.post("/users",urlParser,function(req,res){
	if(!req.body.name){
		return res.sendStatus(400);
	}else{
		console.log(req.body);
		res.send(questions);
	}
})
// 乱码解决
// // 创建 application/x-www-form-urlencoded 编码解析  
// var urlencodedParser = bodyParser.urlencoded({ extended: false })  
  
// app.post('/post', urlencodedParser, function(request, response){
//   // 输出 JSON 格式  
//    data = {  
//        'name':request.body.name,  
//        'gender':request.body.gender  
//    };  
//    console.log(data);  
//   //  response.end(JSON.stringify(data));  
//    response.json(data); 
// });  


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/tests';
MongoClient.connect(url,function(err,db){
	if (err) throw err;
	console.log('数据库连接成功');
	// db.close();
	var dbase = db.db('tests');
	dbase.createCollection('ese',function(err,res){
		if (err) throw err;
		console.log('创建集合成功');
		// db.close();
		var mocks = {"name":"baiduyun"};
		// dbase.collection('ese').insertOne(mocks,function(err,res){
		// 	if (err) throw err;
		// 	console.log('插入数据成功');
		// 	db.close();
		// })
		// var mocked = [
		// 	{"_id":"101","name":"百度","url":"www.baidu.com","type":"en"},
		// 	{"_id":"102","name":"阿里巴巴","url":"www.taobao.com","type":"en"},
		// 	{"_id":"103","name":"淘宝","url":"www.taobao.com","type":"en"},
		// 	{"_id":"104","name":"支付宝","url":"www.zhifubao.com","type":"ch"},
		// 	{"_id":"105","name":"京东","url":"www.jingdong.com","type":"en"},
		// 	{"_id":"106","name":"亚马逊","url":"www.yamaxun.com","type":"ch"},
		// 	{"_id":"107","name":"携程","url":"www.xiecheng.com","type":"en"}
		// ];
		// dbase.collection('ese').insertMany(mocked,function(err,res){
		// 	if (err) throw err;
		// 	console.log("多条数据插入成功");
		// 	db.close();
		// })
		// dbase.collection("ese").find({"name":"百度"}).toArray(function(err,result){
		// 	if (err) throw err;
		// 	console.log("查找获取成功");
		// 	console.log(result);
		// 	db.close();
		// })
		// dbase.collection("ese").update({"name":"ali"},{$set:{"type":"ali"}},function(err,result){
		// 	if (err) throw err;
		// 	console.log('对应的数据更新完成');
		// 	db.close();
		// })
		// dbase.collection('ese').remove({"_id":"104"},true,function(err,res){
		// 	if (err) throw err;
		// 	console.log("删除文档成功");
		// 	db.close();
		// })
		// dbase.collection('ese').find().skip(2).limit(2).toArray(function(err,result){
		// 	if (err) throw err;
		// 	console.log(result);
		// 	db.close();
		// })
		dbase.collection('ese').find().sort({'_id':-1}).toArray(function(err,result){
			if (err) throw err;
			console.log(result); 
			db.close();
		})
		dbase.collection('ese').ensureIndex({'top':1},{"background":true},function(err,res){
			if (err) throw err;
			console.log('索引创建成功');
			db.close(); 
		})
		dbase.collection('ese').aggregate([{$group:{"_id":"$name"}}]).toArray(function(err,result){
			if (err) throw err;
			console.log(result);
			db.close();
		})
	})
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
