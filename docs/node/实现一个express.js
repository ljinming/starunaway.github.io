const http = require('http');
const url = require('url');

function createServer() {
  let app = (req, res) => {
    app.routes.forEach((r) => {
      const {method, path, handler} = r;
      let m = req.method.toLowerCase();
      let pathname = url.parse(req.url);

      if ([m, 'all'].includes(method) && ['*', pathname].includes(path)) {
        handler(req, res);
      }

      res.end(`cannot ${m} ${pathname}`);
    });
  };

  app.routes = [];

  http.METHODS.forEach((method) => {
    method = method.toLowerCase();
    app[method] = (path, handler) => {
      let model = {
        method: 'get',
        path,
        handler,
      };
      app.routes.push(model);
    };
  });

  app.use = (path = '/', handler = () => {}) => {
    let model = {
      method: '_middleware',
      path,
      handler,
    };
    app.routes.push(model);
  };

  app.listen = (port) => {
    http.createServer(app).listen(port);
  };
  return app;
}
