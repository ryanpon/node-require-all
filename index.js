var fs = require('fs');

module.exports = function requireAll(options) {
  if (typeof options === 'string') {
    options = { dirname: options };
  }
  options.filter = options.filter || /(.+)\.js(on)?$/;
  options.noRecursive = options.noRecursive || false;

  var files = fs.readdirSync(options.dirname);
  var modules = {};

  function excludeDirectory(dirname) {
    return options.excludeDirs && dirname.match(options.excludeDirs);
  }

  files.forEach(function (file) {
    var filepath = options.dirname + '/' + file;
    if (fs.statSync(filepath).isDirectory() && !options.noRecursive) {

      if (excludeDirectory(file)) return;

      modules[file] = requireAll({
        dirname: filepath,
        filter: options.filter,
        excludeDirs: options.excludeDirs
      });

    } else {
      var match = file.match(options.filter);
      if (!match) return;

      modules[match[1]] = require(filepath);
    }
  });

  return modules;
};
