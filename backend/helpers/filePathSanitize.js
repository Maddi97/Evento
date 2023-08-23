exports.validatePath = (user_input) => {
  var path = require("path");
  var safe_input = path.normalize(user_input).replace(/^(\.\.(\/|\\|$))+/, "");
  //var path_string = path.join(root, safe_input);
  // if (path_string.indexOf(root) !== 0) {
  //     return 'Access denied';
  // }

  return safe_input;
};
