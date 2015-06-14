(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Ball = (function(superClass) {
    extend(Ball, superClass);

    Ball.prototype.ball = void 0;

    function Ball() {
      var geometry, material;
      geometry = new THREE.SphereGeometry(32, 32, 32);
      material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        side: THREE.DoubleSide
      });
      this.ball = new Physijs.SphereMesh(geometry, material, 12);
      this.ball.position.set(0, 1000, 0);
    }

    Ball.prototype.getSceneObject = function() {
      return this.ball;
    };

    Ball.prototype.renderSceneObject = function() {};

    return Ball;

  })(BaseObject);

}).call(this);

