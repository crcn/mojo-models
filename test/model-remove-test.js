var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-remove#", function () {

  var app = new Application();
  app.use(models);

  it("can call remove on a model", function () {
    var Model = models.Base.extend({
      persist: {
        del: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.remove();
  });

  it("returns an error if a model can't be removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        read: function () {
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.remove(function (err) {
      expect(err.message).to.be("cannot remove model");
      next();
    });
  });

  it("returns an error if a model doesn't have data", function (next) {
    var Model = models.Base.extend({
      persist: {
        del: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.remove(function (err) {
      expect(err.message).to.be("cannot remove model without data");
      next();
    });
  });

  it("can properly call .del() on a model", function (next) {
    var Model = models.Base.extend({
      persist: {
        del: function (complete) {
          next();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.remove();
  });

  it("returns reference of model removed on remove", function (next) {
    var Model = models.Base.extend({
      persist: {
        del: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.remove(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });

  it("emits 'remove' after a model is removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        del: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.once("remove", next);
    m.remove();
  });

  it("emits 'dispose' after a model is removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        del: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.once("dispose", next);
    m.remove();
  });
});