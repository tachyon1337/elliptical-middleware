/*
 * =============================================================
 * elliptical.middleware.serviceLocator
 * =============================================================
 *
 * middleware for dependency injection/service location
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.serviceLocator=factory();
        root.returnExports = root.elliptical.middleware.serviceLocator;
    }
}(this, function () {

    return function serviceLocator() {

        return function serviceLocator(req, res, next) {
            req.getType=function(name){
                var app=req.app;
                var container=app.container;

                return container.getType(name);
            };

            next();
        }
    }

}));