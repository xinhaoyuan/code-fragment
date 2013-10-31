// A simple streaming utf8 to unicode converter
(function() {
    this.UTF8Stream = function() {
        this.blen  = 0;
        this.buf   = 0;
        this.error = false;
    };
    this.UTF8Stream.prototype = {
        resume: function() { this.blen = 0; this.buf = 0; this.error = false; },
        writeByte : function(b) {
            if (this.error) {
                if ("onerror" in this) this.onerror("error not resumed");
            } else if (
                typeof b != 'number' ||
                    b % 1 != 0 ||
                    b > 0xFF) {
                this.error = true;
                if ("onerror" in this) this.onerror("not a byte integer");
            } else if (this.blen == 0) {
                if ((b & 0x80) == 0) {
                    this.onvalue(b);
                } else if ((b & 0xE0) == 0xC0) {
                    this.blen = 1;
                    this.buf = b & 0x1F;
                } else if ((b & 0xF0) == 0xE0) {
                    this.blen = 2;
                    this.buf = b & 0x0F;
                } else if ((b & 0xF8) == 0xF0) {
                    this.blen = 3;
                    this.buf = b & 0x07;
                } else {
                    this.error = true;
                    if ("onerror" in this) this.onerror("invalid head format");
                }
            } else if ((b & 0xC0) == 0x80) {
                this.buf = (this.buf << 6) | (b & 0x3F);
                if (-- this.blen == 0) {
                    var v = this.buf;
                    this.buf = 0;
                    if ("onvalue" in this) this.onvalue(v);
                }
            } else {
                this.error = true;
                if ("onerror" in this) this.onerror("invalid body format");
            }
        },
        write : function(arr) {
            for (var i in arr)
                this.writeByte(arr[i]);
        }
    };
}).call(utf8stream = {});
