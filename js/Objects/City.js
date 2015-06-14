(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.City = (function(superClass) {
    extend(City, superClass);

    City.prototype.gridX = void 0;

    City.prototype.gridZ = void 0;

    City.prototype.gridSize = void 0;

    City.prototype.camera = void 0;

    City.prototype.cameraFollow = false;

    City.prototype.sceneObject = null;

    City.prototype.lights = [];

    function City(gridX, gridZ, gridSize, gridMargin, minBSizeX, maxBSizeX, minBSizeY, maxBSizeY, minBSizeZ, maxBSizeZ, camera) {
      var i, j, k, l, m, position, ref, ref1, ref2, ref3, size;
      this.gridX = gridX;
      this.gridZ = gridZ;
      this.gridSize = gridSize;
      this.camera = camera;
      this.sceneObject = new THREE.Scene();
      for (i = k = ref = -gridX / 2, ref1 = gridX / 2; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
        for (j = l = ref2 = -gridZ / 2, ref3 = gridZ / 2; ref2 <= ref3 ? l <= ref3 : l >= ref3; j = ref2 <= ref3 ? ++l : --l) {
          position = {
            x: i * gridSize + gridSize / 2,
            y: 0,
            z: j * gridSize + gridSize / 2
          };
          size = {
            x: minBSizeX + Math.random() * (maxBSizeX - minBSizeX),
            y: minBSizeY + Math.random() * (maxBSizeY - minBSizeY),
            z: minBSizeZ + Math.random() * (maxBSizeZ - minBSizeZ)
          };
          this.sceneObject.add(new Building(position.x, position.y, position.z, size.x, size.y, size.z).getSceneObject());
        }
      }
      for (i = m = 0; m <= 100; i = ++m) {
        this.spawnRandomLight();
      }
    }

    City.prototype.getSceneObject = function() {
      return this.sceneObject;
    };

    City.prototype.isLightOut = function(pos, rad) {
      if (pos.x > (this.gridX / 2) * this.gridSize + rad) {
        return true;
      }
      if (pos.z > (this.gridZ / 2) * this.gridSize + rad) {
        return true;
      }
      if (pos.x < -1 * (this.gridX / 2) * this.gridSize - rad) {
        return true;
      }
      if (pos.z < -1 * (this.gridZ / 2) * this.gridSize - rad) {
        return true;
      }
      return false;
    };

    City.prototype.CAMERA_HEIGHT_OFFSET = 10;

    City.prototype.INTERP_FRAMES = 30;

    City.prototype.CAMERA_DIST_BEHIND = 45;

    City.prototype.TRANSITION_CURVE = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];

    City.prototype.SUM_TRANSITION_CURVE = City.prototype.TRANSITION_CURVE.reduce(function(a, b) {
      return a + b;
    }, 0);

    City.prototype.interpFrames = 0;

    City.prototype.prevVec = new THREE.Vector3(0, 0, 0);

    City.prototype.posMoveVec = new THREE.Vector3(0, 0, 0);

    City.prototype.renderSceneObject = function() {
      var cameraDistDiff, finalLightPos, k, len, light, lightMoveVec, lightPos, prevLightMoveVec, ref;
      prevLightMoveVec = this.lights[0].getDirection().clone();
      ref = this.lights;
      for (k = 0, len = ref.length; k < len; k++) {
        light = ref[k];
        light.renderSceneObject();
        if (this.isLightOut(light.getSceneObject().position, light.distance / 4)) {
          if (light.fade()) {
            this.createRandomLight(light);
          }
        } else {
          light.unFade();
        }
      }
      if (this.cameraFollow) {
        lightPos = this.lights[0].getSceneObject().position.clone();
        lightMoveVec = this.lights[0].getDirection().clone();
        cameraDistDiff = lightMoveVec.clone().normalize().multiplyScalar(this.CAMERA_DIST_BEHIND);
        if (this.interpFrames === 0 && !THREE.MyHelper.checkVec(lightMoveVec, this.prevVec) && !THREE.MyHelper.checkVec(prevLightMoveVec.clone().normalize(), lightMoveVec.clone().normalize())) {
          this.interpFrames = this.INTERP_FRAMES;
          finalLightPos = lightPos.clone().add(lightMoveVec.clone().multiplyScalar(this.INTERP_FRAMES));
          finalLightPos.sub(cameraDistDiff);
          this.posMoveVec = finalLightPos.clone().sub(this.camera.position).divideScalar(this.interpFrames);
        }
        if (this.interpFrames > 0) {
          this.camera.position.add(this.posMoveVec.clone().multiplyScalar(this.INTERP_FRAMES).multiplyScalar(this.TRANSITION_CURVE[this.interpFrames - 1] / this.SUM_TRANSITION_CURVE));
          this.camera.position.setY(this.CAMERA_HEIGHT_OFFSET);
          this.camera.lookAt(this.camera.position.clone().add(this.prevVec.clone().multiplyScalar(this.interpFrames - 1).add(lightMoveVec.clone().multiplyScalar(this.INTERP_FRAMES - this.interpFrames + 1))));
          this.interpFrames--;
          if (this.interpFrames === 0) {
            return this.prevVec = lightMoveVec;
          }
        } else {
          this.camera.position.set(lightPos.x, this.CAMERA_HEIGHT_OFFSET, lightPos.z);
          return this.camera.position.sub(cameraDistDiff);
        }
      }
    };

    City.prototype.setCameraFollow = function(bool) {
      var lightMoveVec, lightPos;
      this.cameraFollow = bool;
      if (bool) {
        this.prevVec = this.lights[0].getDirection().clone();
        lightPos = this.lights[0].getSceneObject().position.clone();
        lightMoveVec = this.lights[0].getDirection().clone();
        this.camera.position.set(lightPos.x, this.CAMERA_HEIGHT_OFFSET, lightPos.z);
        this.camera.position.sub(lightMoveVec.setY(0).clone().multiplyScalar(60));
        return this.camera.lookAt(lightPos.clone().setY(this.CAMERA_HEIGHT_OFFSET));
      }
    };

    City.prototype.spawnRandomLight = function() {
      var newLight;
      newLight = this.createRandomLight();
      this.lights.push(newLight);
      return this.sceneObject.add(newLight.getSceneObject());
    };

    City.prototype.getRandomStart = function() {
      var vec;
      vec = new THREE.Vector3(this.gridSize * (Math.floor(Math.random() * (this.gridX - 2)) - (this.gridX - 2) / 2), 0, this.gridSize * (Math.floor(Math.random() * (this.gridZ - 2)) - (this.gridZ - 2) / 2));
      return vec;
    };

    City.prototype.createRandomLight = function(light) {
      var newPos;
      newPos = this.getRandomStart();
      if (light === void 0) {
        light = new SmallLight(new THREE.Color(Math.random() * 0xFFFFFF), 1, 2 * this.gridSize, newPos, this);
        console.log("New light created at " + newPos.x + ", " + newPos.y + ", " + newPos.z + " with " + light.paths.length + " paths");
      } else {
        light.getSceneObject().position.set(newPos.x, newPos.y, newPos.z);
        light.generateRandomPaths(newPos);
      }
      return light;
    };

    return City;

  })(BaseObject);

}).call(this);
