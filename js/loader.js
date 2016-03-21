/* Loader
==================================================================== */
// Load scripts and fire callback after loading all
// Example:
//   let loader = new Loader();
//   loader.require([a.js, b.js, ...], function() {...});
function Loader() {}
Loader.prototype = {
  _scripts: [],
  _callback: null,
  _count: 0,

  require: function(scripts, callback) {
    this._scripts = scripts;
    this._callback = callback;

    for (let i = 0 ; i < this._scripts.length ; ++i) {
      let script = this._scripts[i];
      this._writeScript(script);
    }
  },

  _writeScript: function(source) {
    console.log('[Loader] _writeScript: ' + source);
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = source;
    script.addEventListener('load', this._loaded.bind(this), false);
    document.head.appendChild(script);
  },

  _loaded: function(event) {
    // Do nothing if there is file needed to be loaded
    ++this._count;
    console.log('[Loader] _loaded: ' + this._count);
    if (this._count != this._scripts.length ||
        typeof this._callback != 'function') {
      return;
    }

    this._callback();
  },
}
