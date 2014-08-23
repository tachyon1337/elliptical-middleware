/*
 * =============================================================
 * elliptical.middleware.sessionSync
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        root.elliptical.middleware = root.elliptical.middleware || {};
        root.elliptical.middleware.sessionSync=factory(root.elliptical);
        root.returnExports = root.elliptical.middleware.sessionSync;
    }
}(this, function (utils) {
    var _=utils._;
    return function sessionSync() {
        return function sessionSync(req, res, next) {
            try{
                if(typeof window !=='undefined'){
                    var session= sessionStorage.getItem('sessionStore');

                    if(session){
                        session=JSON.parse(session);
                        _.defaults(req.session,session);
                    }
                }

                var Session=req.service('Session');
                Session.get(function(err,data){
                    if(data){
                        try{
                            _.defaults(req.session,data);
                        }catch(ex){

                        }
                    }
                    next();
                });


            }catch(ex){
                next(ex);
            }
        }
    };

}));
