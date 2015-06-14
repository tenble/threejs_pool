(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FlatTerrain = (function(_super) {
    __extends(FlatTerrain, _super);

    FlatTerrain.prototype.mainObject = null;

    function FlatTerrain() {
      var geometry, mat, texture;
      geometry = new THREE.BoxGeometry(1000, 0.2, 1000);
      texture = THREE.ImageUtils.loadTexture('images/Asphalt256x256.jpg');
      texture.repeat.set(500, 500);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      mat = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: texture
      });
      this.mainObject = new THREE.Mesh(geometry, mat);
    }

    FlatTerrain.prototype.getSceneObject = function() {
      return this.mainObject;
    };

    FlatTerrain.prototype.renderSceneObject = function() {};

    return FlatTerrain;

  })(BaseObject);

}).call(this);
