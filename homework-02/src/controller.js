function home(response) {
  response.write('Home, sweet home!');
  response.end();
}

function comment(data, response, queryParams) {
  console.log(queryParams);
  response.write(JSON.stringify(data));
  response.end();
}

module.exports = {
  home,
  comment,
};
