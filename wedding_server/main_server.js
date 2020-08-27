var http = require('http');
var URL = require('url');
var fs = require('fs');
const { time } = require('console');
var DATA_FILE_PATH = "data/comments.json"

http.createServer(function (request, response) {
    console.log("receive a request!!!");
    try {
        handleRequest(request, response);
    } catch (error) {
        console.log(error);
        responseEnd(response, error);
    }
}).listen(9999);

function handleRequest2(request, response) {
    var result = { status: "error" };
    var url = URL.parse(request.url, true);
    var query = url.query;
    console.log("url is ===>" + request.url);
    if (query.customParam) {
        console.log("query is ===>" + query.customParam);
        result.status = "success";
        result.customParam = query.customParam;
        result.allURL = request.url;
    } else {
        console.log("no query of key: customParam");
    }
    responseEnd(response, result);
}

function handleRequest(request, response) {
    console.log("handleRequest url is ===>" + request.url);
    var result = { status: "error", data:{}};
    var url = URL.parse(request.url, true);
    console.log("handleRequest url is ===>" + request.url);
    switch (url.pathname) {
        case "/api/comments/post":
            result.status = "ok";

            var query = url.query;
            var visitor, timestamp, content;
            if (query.visitor) {
                visitor = query.visitor;
                console.log("visitor is ===>" + visitor);
                result.data.visitor = visitor;
            } 
            if (query.timestamp) {
                timestamp = query.timestamp;
                console.log("timestamp is ===>" + timestamp);
                result.data.timestamp = timestamp;
            } 
            if (query.content) {
                content = query.content;
                console.log("content is ===>" + content);
                result.data.content = content;
            } 

            var localJsonData = fs.readFileSync(DATA_FILE_PATH)
            var localJsonStr = localJsonData.toString();
            var localJson = JSON.parse(localJsonStr);
            var oldData = localJson.filter((p) => {
                return p.visitor == visitor;
            })
            if(oldData && oldData.length > 0){
                // var index = localJson.indexOf(oldData[0]);
                // index > -1 && localJson.splice(index, 1);
                oldData[0].timestamp = timestamp;
                oldData[0].content = content;
                // localJson.push(oldData);
            } else {
                localJson.push({
                    "visitor": visitor,
                    "timestamp": timestamp,
                    "content": content
                });
            }
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(localJson));
            responseEnd(response, result);
            break;
        case "/api/comments/get":
            result.status = "ok";

            var localJsonData = fs.readFileSync(DATA_FILE_PATH)
            var localJsonStr = localJsonData.toString();
            var localJson = JSON.parse(localJsonStr);
            result.data = localJson;

            responseEnd(response, result);
            break;
        default:
            result.status = "fail";
            result.data = "unknown request!!!"
            responseEnd(response, result);
            break;
    }
}

function responseEnd(response, result) {
    response.setHeader("Content-Type", "text/json; charset=utf-8");
    response.end(JSON.stringify(result));
}
console.log("http.createServer listening on 9999");
