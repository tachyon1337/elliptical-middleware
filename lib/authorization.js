/*
 * =============================================================
 * elliptical.middleware.authorization
 * =============================================================
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
        root.elliptical.middleware.authorization=factory();
        root.returnExports = root.elliptical.middleware.authorization;
    }
}(this, function () {

    return function authorization(callback) {
        return function authorization(req, res, next) {
            try{
                var app=req.app,
                    locations=app.locations,
                    acl=null,
                    authenticate=true,
                    utils=app.utils;

                var route=req._parsedUrl.pathname;

                for(var i=0;i<locations.length;i++){
                    if(utils.strLastNChars(locations[i].path,2)==='**'){
                        var location=utils.trimLastNChars(locations[i].path,2);
                        if(route.toLowerCase().indexOf(location.toLowerCase())===0){
                            acl=locations[i];
                            break;
                        }
                    }else if(route.toLowerCase()===locations[i].path.toLowerCase()){
                        acl=locations[i];
                        break;
                    }
                }

                if(acl){
                    var exclude=acl.exclude;
                    for(var i=0;i<exclude.length;i++){
                        if(utils.strLastNChars(exclude[i],2)==='**'){
                            var check=utils.trimLastNChars(exclude[i],2);
                            if(route.toLowerCase().indexOf(check.toLowerCase())===0){
                                authenticate=false;
                                break;
                            }
                        }else if(route.toLowerCase()===exclude[i].toLowerCase()){
                            authenticate=false;
                            break;
                        }
                    }
                    if(authenticate){
                        req.location=route;
                        if(callback){
                            callback(req,res,next);
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                }else{
                    next();
                }
            }catch(ex){
                next(ex);
            }
        }
    };
}));

