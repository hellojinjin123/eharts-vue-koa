# echartscreen

## 前端 vue + echart

### vuecli搭建项目

```
vue create echartscreen
```
### 安装echart
```
npm install echarts --save
```


## 后端 koa

**后端建议用 koa 脚手架 零成本速搭服务器 省去手动配置**

### koa 脚手架快速搭建服务器

```npm
npm i koa-generator -g
koa2 service
cd service
npm i

```

### 使用 koa-json

koa-json 把数据转换成 json 格式

```js
const json = require('koa-json');
const Koa = require('koa');
const app = new Koa();

app.use(json());

app.use((ctx) => {
  ctx.body = { foo: 'bar' };
});
```

GET 请求后，输出如下内容：

```js
{
  "foo": "bar"
}
```

### 使用 koa-bodyparser

```js
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');

var app = new Koa();
app.use(bodyParser());

app.use(async (ctx) => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

### 使用 koa-static

koa-static 本质就是读取静态文件，说白就是把异步读取文件 fs.readfile，包括图片等资源的步骤给封装了
所以我们可以方便的用来读取 json 文件
方便快速使用。

```js
app.use(require('koa-static')(__dirname + '/public'));
```
### 跨域
``` js
//npm install --save koa2-cors

var Koa = require('koa');
var cors = require('koa2-cors');
 
var app = new Koa();
app.use(cors());
```

### 启动服务器

```npm
npm run start
```

**在浏览器打开输入**
http://127.0.0.1:3000/ 返回一个 html 页面
http://127.0.0.1:3000/string 返回一个字符串
http://127.0.0.1:3000/json _返回一个 json 数据_

此时，可以在 public 目录放入存入 json 数据测试：
http://127.0.0.1:3000/json/seller.json **目标达成**

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
