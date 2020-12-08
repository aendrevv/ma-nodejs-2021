const querystring = require('querystring');
const url = require('url');

const { router, streamRoutesHandler } = require('./router');

module.exports = async (request, response) => {
  try {
    const { url: urla } = request;
    const parsedUrl = url.parse(urla);
    const queryParams = querystring.decode(parsedUrl.query);

    if (request.headers['content-type'] === 'application/gzip') {
      streamRoutesHandler(request, response).catch(err =>
        console.error('CSV handling was failed', err),
      );
      return;
    }

    let body = [];

    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        router(
          {
            ...request,
            body: body ? JSON.parse(body) : {},
            url: parsedUrl,
            queryParams,
          },
          response,
        );
      });
  } catch (error) {
    console.log(error);
  }
};
