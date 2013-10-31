try { _; } catch (e) { _ = {}; }

_.PushCall = function () {
    var f    = arguments[0];
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    setTimeout(function() {
        f.apply(self, args);
    }, 0);
}
