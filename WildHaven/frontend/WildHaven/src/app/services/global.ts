export var GLOBAL = {
  url: process.env['API_URL'] || 'http://localhost:3800',
  urlUploads: process.env['API_URL'] + "/uploads" || 'http://localhost:3800/uploads'
};