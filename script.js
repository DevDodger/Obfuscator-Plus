/*
I also made a pen with this script obfuscated to further prove to myself that it works.  If you're intersted, you can view it here:
 
http: //codepen.io/tmrDevelops/pen/431c7d7a477043175ab23819729e40cb?editors=001
 
Note: the obfuscated version may take a bit longer to load (only sometimes..not sure why, it doesn't happen outside of codepen).
*/
 
function JS() {
    this.vars = {};
    this.funcs = {};
    this.statements = [];
}
JS.prototype = {
    toString: function() {
        var res = "",
            v = [],
            v_arr = [];
        for (var n in this.vars) {
            v_arr.push("var " + n + "=" + this.vars[n] + ";\n");
        }
        res += v_arr.sort().join("");
        for (var n in this.funcs) {
            v.push(n);
        }
        if (v.length > 0) res += "var " + v.join(",") + ";\n";
        var f_arr = [];
        for (var n in this.funcs) {
            f_arr.push(n);
        }
        f_arr.sort();
        for (var i = 0; i < f_arr.length; i++) {
            var n = f_arr[i];
            res += n + "=function () {\n" + this.funcs[n].toString() +
                "\n" + "};\n";
        }
        this.statements.forEach(function(statement) {
            res += statement;
        });
        return res;
    },
    Obfuscate: function() {
        var res = new JS,
            v = [];
        for (var n in this.vars) {
            res.vars[n] = this.vars[n];
        }
        for (var n in this.funcs) {
            res.vars[n] = "null";
        }
        for (var n in this.funcs) {
            res.statements.push(n + "=function () {\n" + this.funcs[
                n].toString() + "\n" + "};\n");
        }
        this.statements.forEach(function(statement) {
            res.statements.push(statement);
        });
        return res;
    },
    encrypt: function($$) {
        var ns = this.statements.splice(0, this.statements.length);
        $$.cur = this;
        encryptSts($$, ns);
        for (var n in this.funcs) {
            this.funcs[n].encrypt($$);
        }
    },
    gen_v: function() {
        var res = "";
        do {
            for (var i = 0; i < 3; i++) {
                res += String.fromCharCode(Math.floor((Math.random() <
                        0.5 ? 65 : 97) + Math.random() *
                    26));
            }
        } while (res in this.vars);
        this.vars[res] = "null";
        return res;
    }
};
var F = "function";
 
function Exp(expr) {
    return "(" + expr + ")";
}
 
function Arr() {
    var a = [];
    for (var i = 0; i < arguments.length; i++) a.push(arguments[i]);
    return a.join(",");
}
 
function Eval(s) {
    return "eval" + P(s);
}
 
function sep(s) {
    var i = Math.floor(Math.random() * (s.length - 1)) + 1;
    var pre = s.substring(0, i);
    var post = s.substring(i);
    return [pre, post];
}
 
function sep2(s) {
    var i = 0,
        n, res = [];
    while (i < s.length) {
        n = i + Math.floor(Math.random() * 20 + 5);
        if (n > s.length) n = s.length;
        res.push(s.substring(i, n));
        i = n;
    }
    return res;
}
 
function sep_a(statements) {
    var i = Math.floor(Math.random() * (statements.length - 1)) + 1;
    var pre = statements.splice(0, i);
    var post = statements;
    return [pre, post];
}
 
function gen_v($$) {
    if (!$$.count) $$.count = 0;
    $$.count++;
    return "_" + $$.count;
}
 
function compress(code) {
    var comped= "";
    var rep = ["eval(", "\\\\\\\\", "var "];
    rep.forEach(function(rep) {
        var f = gen_sym(code);
        code = code.replace(regx(rep), f);
        comped += ".replace(" + regex(f) + ", " + Q(rep) +
            ")";
    });
    return E(Q(code) + comped);
}
 
function gen_sym(code) {
    while (true) {
        var st1 = String.fromCharCode(Math.floor(Math.random() *
            32 + 32));
        var st2 = String.fromCharCode(Math.floor(Math.random() *
            32 + 64));
        if (code.indexOf(st1 + st2) < 0) {
            return st1 + st2;
        }
    }
}
 
function regx(s) {
    return eval(rege(s));
}
 
function regex(s) {
    return "/" + s.replace(/\W/g, function(s) {
        return "\\" + s;
    }) + "/g";
}
 
function Q(s, quote) {
    if (!quote) quote = "'";
    s = s.replace(/\\/g, "\\\\");
    s = s.replace(/\r/g, "\\r");
    s = s.replace(/\n/g, "\\n");
    if (quote == "'") s = s.replace(/'/g, "\\'");
    else s = s.replace(/"/g, '\\"');
    return quote + s + quote;
}
 
function encryptSts($$, statements) {
    statements.forEach(function(statement) {
        encryptSt($$, statement);
    });
}
 
function encryptSt($$, statement) {
        var s = sep2(statement);
        if (s.length <= 1) {
            $$.cur.statements.push(statement);
            return;
        }
        var evs = [];
        var genfn = $$.top.gen_v($$);
        var genf = new JS();
        s.forEach(function(e, i) {
            var v = $$.top.gen_v($$);
            $$.top.vars[v] = true;
            var rnd = Math.floor(Math.random() * 4);
            if (rnd == 0) $$.top.vars[v] = Q(e);
            else if (rnd == 1) $$.cur.statements.push(v + "=" + Q(
                e) + ";\n");
            else if (rnd == 2) $$.top.statements.unshift(v + "=" +
                Q(e) + ";\n");
            else genf.statements.push(v + "=" + Q(e) + ";\n");
            evs.push(v);
        });
        $$.top.funcs[genfn] = genf;
        genf.statements.push("eval(" + evs.join("+") + ");\n");
        $$.cur.statements.push("setTimeout(" + genfn + ",0);\n");
        $$.cur = genf;
    }
  
$(function() {
    $("#btn_obf").click(start);
    $("#btn_eval").click(function() {
        eval($("#obf").val());
    });
    $("#btn_clr").click(function(){
         $("#obf").val('');
    });
});
 
function Func(s) {
    return "(" + F + "(){" + s + "})()";
}
 
function start() {
    var top = new JS(),
        cur = top;
    var $$ = {
        top: top,
        cur: cur,
        lim: 24
    };
    encryptSts($$, [$("#orig").val()]);
    top.encrypt($$);
    var fcomp = Func(top.toString());
    $("#obf").val(fcomp);
  
}