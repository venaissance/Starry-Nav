// 从localStorage里取出hashMap，这样就实现了即使离开页面之后原先数据的保存
const x = localStorage.getItem("x");
const xObject = JSON.parse(x); // 字符串转对象

// 初始状态xObject为null
const hashMap = xObject || [
  { url: "https://www.acfun.cn", logo: "A" },
  { url: "https://www.bilibili.com", logo: "B" },
  { url: "https://dig.chouti.com", logo: "C" }
];

// 每次添加新页面的过程也就是渲染hashMap的过程
const render = () => {
  // 先把上一次的数据移除，再遍历
  $(".siteList")
    .find("li:not(.last)")
    .remove();
  // 对象遍历
  hashMap.forEach((item, index) => {
    const $li = $(`<li>
                <div class="site">
                    <div class="logo">${item.logo}</div>
                    <div class="link">${simplifyUrl(item.url)}</div>
                    <div class="remove">
                        <svg class="icon">
                            <use xlink:href="#icon-remove"></use>
                        </svg>
                    </div>
                </div>
        </li>`).insertBefore($(".last"));
    $li.on("click", () => {
      //   window.open(item.url); // 新页面打开
      window.location.href = item.url; // 本页面重定向，比上面的方法好，没有函数调用开销
    });
    $li.on("click", ".remove", e => {
      e.stopPropagation(); // 阻止事件冒泡（不听爸爸的监听事件）
      console.log(hashMap[index]);
      hashMap.splice(index, 1); // 数组中删除
      render(); // 重新渲染
    });
  });
};

const simplifyUrl = url => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, "") // 删除url里 / 后面的内容，解决过长url的显示bug
    .replace(
      /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\"|\'|\,|\<|\>|\/|\?]/g,
      ""
    ); // 去除url中的无用标点（:和.除外)
};

render();

$(".addButton").on("click", () => {
  // 页面弹框输入
  let url = window.prompt("请问你要添加什么网址呢？");

  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  // hashMap里加入新的url，再渲染
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render();
});

// 窗口即将被关闭时触发，把hashMap保存到localStorage里
window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap); // 对象转字符串
  localStorage.setItem("x", string); // localStorage.setItem(key, value)
};

// 键盘
$(document).on("keypress", e => {
  const { key } = e; // 等同于const key = e.key
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.location.href = hashMap[i].url;
    }
  }
});
