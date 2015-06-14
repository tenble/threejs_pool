(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Test = (function(_super) {
    __extends(Test, _super);

    Test.prototype.object = null;

    function Test() {
      var radius, rings, segments, sphere, sphereMaterial;
      radius = 50;
      segments = 32;
      rings = 32;
      sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xCC0000
      });
      sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
      this.object = sphere;
    }

    Test.prototype.getSceneObject = function() {
      return this.object;
    };

    Test.prototype.renderSceneObject = function() {
      return this.object.rotation.y += 0.01;
    };

    return Test;

  })(BaseObject);

}).call(this);
