/*
 * =============================================================
 * elliptical.middleware.http404 v0.9.1
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * none
 *
 * elliptical http 404 error middleware
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
        root.elliptical.middleware.httpError=factory();
        root.returnExports = root.elliptical.middleware.httpError;
    }
}(this, function () {

    return function httpError(template,callback) {
        return function httpError(err,req, res, next) {
            if(typeof template==='undefined' || typeof template==='function'){
                if(typeof template==='function'){
                    callback=template;
                }
                template = 'http-status';
            }
            var e={};
            if(err.stack){
                e.statusCode=500;
                e.description=err.stack;
                e.message='Internal Server Error';
            }else{
                e.statusCode=err.statusCode;
                e.description=err.description;
                e.message=err.message;
            }

            if(callback){
                callback(e,req,res,next,function(err_,req_,res_,next){
                    render_(err_,req_,res_);
                });
            }else{
                render_(e,req,res);
            }

        };

        function render_(error,request,response){
            response.context.statusCode=error.statusCode;
            response.context.description=error.description;
            response.context.message=error.message;
            response.context.url=request.url;
            response.render(template, response.context);
        }
    }


}));

