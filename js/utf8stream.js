// A simple streaming utf8 to unicode converter
(function() {
    var UTF8Stream = function() {
        UTF8Stream.prototype.reset.call(this);
    };
    UTF8Stream.prototype = {
        reset: function() { 
            this._blen = 0;
            this._vbuf = 0;
            this._error = false;
            this._fbuf = [];
        },
        unwind : function() {
            return this._fbuf;
        },
        writeByte : function(b) {
            this._fbuf.push(b);
            if (this._error) {
                if ("onerror" in this) this.onerror("error not resumed");
            } else if (typeof b != 'number' ||
                       b % 1 != 0 ||
                       b > 0xFF) {
                this._error = true;
                if ("onerror" in this) this.onerror("not a byte integer");
            } else if (this._blen == 0) {
                if ((b & 0x80) == 0) {
                    this._fbuf = [];
                    if ("onvalue" in this) this.onvalue(b);
                } else if ((b & 0xE0) == 0xC0) {
                    this._blen = 1;
                    this._vbuf = b & 0x1F;
                } else if ((b & 0xF0) == 0xE0) {
                    this._blen = 2;
                    this._vbuf = b & 0x0F;
                } else if ((b & 0xF8) == 0xF0) {
                    this._blen = 3;
                    this._vbuf = b & 0x07;
                } else {
                    this._error = true;
                    if ("onerror" in this) this.onerror("invalid head format");
                }
            } else if ((b & 0xC0) == 0x80) {
                this._vbuf = (this._vbuf << 6) | (b & 0x3F);
                if (-- this._blen == 0) {
                    var v = this._vbuf;
                    this._vbuf = 0;
                    this._fbuf = [];
                    if ("onvalue" in this) this.onvalue(v);
                }
            } else {
                this._error = true;
                if ("onerror" in this) this.onerror("invalid body format");
            }
        },
        write : function(arr) {
            for (var i in arr)
                this.writeByte(arr[i]);
        }
    };
    this.UTF8Stream = UTF8Stream;
}).call(utf8stream = {});
