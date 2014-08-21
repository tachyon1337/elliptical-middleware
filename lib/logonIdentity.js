/*
 * =============================================================
 * elliptical.middleware.logonIdentity v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * simple callback middleware
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
        root.elliptical.middleware.logonIdenity=factory();
        root.returnExports = root.elliptical.middleware.logonIdentity;
    }
}(this, function () {

    return function logonIdentity(tokenKey,identityTokenKey,callback) {
        return function logonIdentity(req, res, next) {
            try{
                var identity;
                if(req.cookies[tokenKey] && req.cookies[identityTokenKey] && !req.session.membership){
                    identity=req.cookies[identityTokenKey];
                    identity=JSON.parse(identity);
                    var identityToken=identity.authToken;
                    callback.call(this,req.cookies[tokenKey],identityToken,req,res,next);
                }else if(req.cookies[identityTokenKey]){
                    identity=req.cookies[identityTokenKey];
                    identity=JSON.parse(identity);

                    res.context.adminIdentity=identity;
                    //console.log(res.context.adminIdentity);
                }
                next();
            }catch(ex){
                next(ex);
            }
        }
    };

}));
