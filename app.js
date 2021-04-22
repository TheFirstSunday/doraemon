const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const error = require('koa-json-error');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const loadRouter = require('./routes');
const context = require('./utils/context');

const app = new Koa();

// error handler
onerror(app);

Object.keys(context).forEach((key) => {
  app.context[key] = context[key]; // 绑定上下文对象
});
// moddlewares
const authHandler = require('./middlewares/authHandler');

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  }),
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  }),
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app
  .use(cors())
  .use(
    koaBody({
      multipart: true,
      formidable: {
        // uploadDir: path.resolve(__dirname, './upload'),
        keepExtensions: true, // 保持文件的后缀
        maxFileSize: 2000 * 1024 * 1024, // 设置上传文件大小最大限制，默认20M
      },
    }),
  )
  .use(
    error({
      postFormat: (e, { stack, ...rest }) => {
        return process.env.NODE_ENV !== 'development'
          ? rest
          : { stack, ...rest };
      },
    }),
  )
  .use(authHandler)
  .use(logger());

loadRouter(app);

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
