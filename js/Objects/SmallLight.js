(function() {
  var Path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.SmallLight = (function(superClass) {
    extend(SmallLight, superClass);

    function SmallLight(color, intensity, distance, position, cityInstance) {
      this.paths = [];
      this.distance = distance;
      this.cityInstance = cityInstance;
      this.light = new THREE.PointLight(color, intensity, distance);
      this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0.5
      }));
      this.sceneObject = new THREE.Scene();
      this.sceneObject.add(this.light);
      this.sceneObject.add(this.sphere);
      this.sceneObject.position.set(position.x, position.y, position.z);
      this.generateRandomPaths(position);
    }

    SmallLight.prototype.generateRandomPaths = function(position) {
      var dirVec, dist, from, i, j, results, rotRadians, time, to, x, z;
      this.paths = [];
      results = [];
      for (i = j = 0; j <= 100000; i = ++j) {
        from = i === 0 ? position : this.paths[i - 1].to;
        time = 60 + (Math.floor(Math.random() * 30));
        dist = (Math.floor(Math.random() * 3) + 1) * 50;
        dirVec = i === 0 ? new THREE.Vector3(1, 0, 0) : this.paths[i - 1].getMoveVec().clone().normalize();
        rotRadians = (Math.round(Math.random() * 2) - 1) * (Math.PI / 2);
        x = dirVec.x * Math.cos(rotRadians) - dirVec.z * Math.sin(rotRadians);
        z = dirVec.x * Math.sin(rotRadians) + dirVec.z * Math.cos(rotRadians);
        dirVec.setX(x);
        dirVec.setZ(z);
        dirVec.multiplyScalar(dist);
        to = from.clone();
        to.add(dirVec);
        this.paths[i] = new Path(time, from, to);
        if (this.cityInstance.isLightOut(to, this.distance / 2)) {
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SmallLight.prototype.unFade = function() {
      if (this.light.intensity < 1) {
        this.light.intensity += 0.01;
        return this.sphere.material.opacity += 0.01;
      }
    };

    SmallLight.prototype.fade = function() {
      if (this.light.intensity > 0) {
        this.sphere.material.opacity -= 0.01;
        this.light.intensity -= 0.01;
        return false;
      }
      return true;
    };

    SmallLight.prototype.getDirection = function() {
      return this.paths[0].vec;
    };

    SmallLight.prototype.getSceneObject = function() {
      return this.sceneObject;
    };

    SmallLight.prototype.renderSceneObject = function() {
      var path;
      path = this.paths[0];
      path.advance(this.getSceneObject());
      if (path.hasReached && this.paths.length > 1) {
        return this.paths.splice(0, 1);
      }
    };

    return SmallLight;

  })(BaseObject);

  Path = (function() {
    function Path(time, from, to) {
      this.to = to;
      this.from = from;
      this.hasReached = false;
      this.vec = to.clone();
      this.vec.sub(from);
      this.vec.divideScalar(time);
      this.hasReached = THREE.MyHelper.checkVec(from, to);
    }

    Path.prototype.advance = function(threeObj) {
      threeObj.position.add(this.vec);
      return this.hasReached = THREE.MyHelper.checkVec(threeObj.position, this.to);
    };

    Path.prototype.getMoveVec = function() {
      return this.vec;
    };

    return Path;

  })();

}).call(this);
