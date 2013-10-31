(function() {
    var JSONReader = function() {
        JSONReader.prototype.reset.call(this);
    };
    
    JSONReader.prototype = {
        reset: function() {
            var self = this;
            this._level = 0;
            this._sbuf = "";
            this._parser = clarinet.parser();
            this._parser.onerror = function() { 
                self.reset();
            };
            this._parser.onopenobject = function() { 
                ++ self._level;
            };
            this._parser.oncloseobject = function() {
                if (-- self._level == 0) 
                    if ("onvalue" in self)
                        self.onvalue(JSON.parse(self._sbuf));
            };
            this._parser.onopenarray = function() {
                ++ self._level;
            };
            this._parser.onclosearray = function() { 
                if (-- self._level == 0)
                    if ("onvalue" in self)
                        self.onvalue(JSON.parse(self._sbuf));
            }
        },
        write: function(v) {
            this._sbuf += v;
            this._parser.write(v);
        }
    };

    this.JSONReader = JSONReader;
}).call(jsonreader = {});
