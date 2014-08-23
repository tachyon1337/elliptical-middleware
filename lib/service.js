/*
 * =============================================================
 * elliptical.middleware.service
 * =============================================================
 * elliptical service injection middleware
 * assigns response,request objects as properties to passed services(and the services' providers)
 * and passes the services to a created services array on the request object
 *
 * In this way services are made global to the application(routes or controller actions) and service providers
 * have access to the real-time req,res objects
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
        root.elliptical.middleware.service=factory();
        root.returnExports = root.elliptical.middleware.service;
    }
}(this, function () {

    return function service() {
        var args = [].slice.call(arguments);
        return function service(req, res, next) {
            req.services=[];
            req.service=function(name){
                var obj_=null;
                var model=null;
                if(req.services && req.services.length > 0){
                    req.services.forEach(function(obj){
                        if(obj.name===name){
                            obj_=obj.service;
                        }else if(obj.name==='Model'){
                            model=obj.service.extend({},{}); //if model, extend it so that each is a separate copy
                            model["@class"]=name;
                        }
                    });
                }
                return (obj_) ? obj_ : model;
            };

            try{
                for(var i=0;i<args.length;i++){
                    var name=(args[i]["@class"]);
                    if(!name){
                        if(args[i].constructor && args[i].constructor["@class"]){
                            name=args[i].constructor["@class"];
                        }else{
                            name='Model';
                        }
                    }
                    args[i].req=req;
                    args[i].res=res;
                    if(args[i].$provider){
                        args[i].$provider.req=req;
                        args[i].$provider.res=res;
                    }
                    req.services.push({
                        name:name,
                        service:args[i]
                    });
                }
                next();

            }catch(ex){
                next(ex);
            }
        }
    }

}));
