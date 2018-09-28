module.exports = function logger() {
  return function (hook) {
    console.log(hook);
    return hook;
  };
};
