// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
// 从localStorage里取出hashMap，这样就实现了即使离开页面之后原先数据的保存
var x = localStorage.getItem("x");
var xObject = JSON.parse(x); // 字符串转对象
// 初始状态xObject为null

var hashMap = xObject || [{
  url: "https://www.acfun.cn",
  logo: "A"
}, {
  url: "https://www.bilibili.com",
  logo: "B"
}, {
  url: "https://dig.chouti.com",
  logo: "C"
}]; // 每次添加新页面的过程也就是渲染hashMap的过程

var render = function render() {
  // 先把上一次的数据移除，再遍历
  $(".siteList").find("li:not(.last)").remove(); // 对象遍历

  hashMap.forEach(function (item, index) {
    var $li = $("<li>\n                <div class=\"site\">\n                    <div class=\"logo\">".concat(item.logo, "</div>\n                    <div class=\"link\">").concat(simplifyUrl(item.url), "</div>\n                    <div class=\"remove\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-remove\"></use>\n                        </svg>\n                    </div>\n                </div>\n        </li>")).insertBefore($(".last"));
    $li.on("click", function () {
      //   window.open(item.url); // 新页面打开
      window.location.href = item.url; // 本页面重定向，比上面的方法好，没有函数调用开销
    });
    $li.on("click", ".remove", function (e) {
      e.stopPropagation(); // 阻止事件冒泡（不听爸爸的监听事件）

      console.log(hashMap[index]);
      hashMap.splice(index, 1); // 数组中删除

      render(); // 重新渲染
    });
  });
};

var simplifyUrl = function simplifyUrl(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/.*/, "") // 删除url里 / 后面的内容，解决过长url的显示bug
  .replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\"|\'|\,|\<|\>|\/|\?]/g, ""); // 去除url中的无用标点（:和.除外)
};

render();
$(".addButton").on("click", function () {
  // 页面弹框输入
  var url = window.prompt("请问你要添加什么网址呢？");

  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  } // hashMap里加入新的url，再渲染


  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render();
}); // 窗口即将被关闭时触发，把hashMap保存到localStorage里

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap); // 对象转字符串

  localStorage.setItem("x", string); // localStorage.setItem(key, value)
}; // 键盘


$(document).on("keypress", function (e) {
  var key = e.key; // 等同于const key = e.key

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.location.href = hashMap[i].url;
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.5cb36edc.js.map