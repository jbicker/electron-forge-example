const express = require('express');
const path = require('path');
const app = express();

var releases = path.join(__dirname, 'releases');
console.log('releases', releases);
app.use(express.static(releases));

app.listen(3000, () => {
  console.log('Update server running on http://localhost:3000');
});