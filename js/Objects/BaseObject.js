(function() {
  this.BaseObject = (function() {
    function BaseObject() {}

    BaseObject.prototype.getSceneObject = function() {
      return console.warn(this.name + ": getObject not overriden.");
    };

    BaseObject.prototype.renderSceneObject = function() {
      return console.warn(this.name + ": renderObject not overidden.");
    };

    return BaseObject;

  })();

}).call(this);
