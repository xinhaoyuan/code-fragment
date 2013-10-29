// A transform routine to link CPS style program
function CPS() {
    if (arguments.length < 2) return undefined;
    if (arguments[0] === undefined) {
        var args = Array.prototype.slice.call(arguments);
        return function () {
            var pargs = Array.prototype.slice.call(arguments);
            args[0] = pargs.shift();
            CPS.apply(undefined, args)
                .apply(undefined, pargs);
        }
    } else {
        if (typeof arguments[0] != "function") 
            arguments[0] = function() { }

        for (var i = arguments.length - 1; i > 0; -- i) {
            arguments[i] = (function (cont, func) {
                return function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(cont);
                    func.apply(undefined, args);
                };
            }).call(undefined,
                    i + 1 < arguments.length ? arguments[i + 1] : arguments[0],
                    arguments[i]);
        }
        
        return arguments[1];
    }
}
