(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Floor = (function(superClass) {
    extend(Floor, superClass);

    Floor.prototype.floor = void 0;

    function Floor() {
      var geometry, material;
      geometry = new THREE.PlaneBufferGeometry(512, 512, 32);
      material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
      });
      this.floor = new Physijs.BoxMesh(geometry, material, 0);
      this.floor.rotation.set(Math.PI / 2, 0, 0);
    }

    Floor.prototype.getSceneObject = function() {
      return this.floor;
    };

    Floor.prototype.renderSceneObject = function() {};

    return Floor;

  })(BaseObject);

}).call(this);

