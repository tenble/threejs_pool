(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Building = (function(_super) {
    __extends(Building, _super);

    Building.prototype.sourceObject = null;

    function Building(posX, posY, posZ, sizeX, sizeY, sizeZ) {
      var geometry, material, texture;
      geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
      geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, sizeY / 2, 0));
      texture = THREE.ImageUtils.loadTexture('images/BuildingGlass128x128.jpg');
      texture.repeat.set(5 * 1, 5 * sizeY / sizeX);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      material = new THREE.MeshPhongMaterial({
        ambient: 0x444444,
        color: 0xFFFFFF,
        shininess: 150,
        specular: 0x888888,
        shading: THREE.SmoothShading,
        map: texture
      });
      this.sourceObject = new THREE.Mesh(geometry, material);
      this.sourceObject.position.x = posX;
      this.sourceObject.position.y = posY;
      this.sourceObject.position.z = posZ;
    }

    Building.prototype.getSceneObject = function() {
      return this.sourceObject;
    };

    Building.prototype.renderSceneObject = function() {};

    return Building;

  })(FlatTerrain);

}).call(this);
