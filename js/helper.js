(function() {
  THREE.MyHelper = {
    checkVec: function(vec1, vec2) {
      var EPSILON, diff;
      EPSILON = 0.00001;
      diff = vec2.clone();
      diff.sub(vec1);
      if (Math.abs(diff.x) < EPSILON && Math.abs(diff.y) < EPSILON && Math.abs(diff.z) < EPSILON) {
        return true;
      }
      return false;
    }
  };

}).call(this);
