(function() {
  this.World = (function() {
    World.prototype.WIDTH = $('body').width();

    World.prototype.HEIGHT = $('body').height();

    World.prototype.VIEW_ANGLE = 45;

    World.prototype.NEAR = 0.1;

    World.prototype.FAR = 10000;

    World.prototype['$container'] = $('body');

    World.prototype.clock = new THREE.Clock();

    World.prototype.renderer = void 0;

    World.prototype.camera = void 0;

    World.prototype.mainScene = void 0;

    World.prototype.mainSceneObjects = [];

    function World() {
      var ball, controls, floor, light, objRef, render;
      this.renderer = new THREE.WebGLRenderer();
      this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.WIDTH / this.HEIGHT, this.NEAR, this.FAR);
      this.mainScene = new Physijs.Scene();
      this.setPrimaryView();
      controls = new THREE.FirstPersonControls(this.camera);
      controls.movementSpeed = 1000;
      controls.lookSpeed = 0.1;
      controls.target = new THREE.Vector3(0, 0, 0);
      this.camera.lookAt(controls.target);
      this.mainScene.add(this.camera);
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.$container.append(this.renderer.domElement);
      floor = new Floor();
      this.mainSceneObjects.push(floor);
      this.mainScene.add(floor.getSceneObject());
      ball = new Ball();
      this.mainSceneObjects.push(ball);
      this.mainScene.add(ball.getSceneObject());
      light = new THREE.AmbientLight(0x404040);
      this.mainScene.add(light);
      objRef = this;
      render = function() {
        var i, len, object, ref;
        requestAnimationFrame(render);
        ref = objRef.mainSceneObjects;
        for (i = 0, len = ref.length; i < len; i++) {
          object = ref[i];
          object.renderSceneObject();
        }
        controls.update(objRef.clock.getDelta());
        objRef.mainScene.simulate();
        return objRef.renderer.render(objRef.mainScene, objRef.camera);
      };
      render();
      this.addListeners();
    }

    World.prototype.setPrimaryView = function() {
      this.camera.position.x = 0;
      this.camera.position.y = 100;
      this.camera.position.z = 0;
      return this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    World.prototype.addListeners = function() {
      var objRef;
      objRef = this;
      return $('body').keypress(function(ev) {
        if (ev.which === 118) {
          if (objRef.city.cameraFollow) {
            objRef.city.setCameraFollow(false);
            return objRef.setPrimaryView();
          } else {
            return objRef.city.setCameraFollow(true);
          }
        }
      });
    };

    return World;

  })();

}).call(this);

