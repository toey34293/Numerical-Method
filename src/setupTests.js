/**
 * fix: matchMedia not present, legacy browsers require a polyfill
 */

//config liberly test
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };
