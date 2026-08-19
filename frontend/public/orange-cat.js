// === 改动 1：表单提交处理 + 浏览器存储 ===
// 拦截“留言 / 投喂”表单的默认提交，把留言存到 localStorage，并弹出提示。
const catForm = document.getElementById("cat-leave-message");
catForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(catForm);
  const record = {
    name: data.get("name"),
    message: data.get("message"),
    faction: data.get("faction"),
    time: new Date().toLocaleString("zh-CN"),
  };
  // 读取已有留言，追加新留言后再存回
  const history = JSON.parse(localStorage.getItem("catMessages") || "[]");
  history.push(record);
  localStorage.setItem("catMessages", JSON.stringify(history));
  alert(`谢谢 ${record.name} 的投喂！咪咪已经记下了你的留言。`);
  catForm.reset();
});

// === 改动 2：网络资源 —— 获取一条猫咪冷知识 ===
// 免费的猫咪冷知识接口：https://catfact.ninja/
const catFactDOM = document.getElementById("cat-fact");
const getCatFact = async (objDOM) => {
  try {
    const response = await fetch("https://catfact.ninja/fact");
    const responseJSON = await response.json();
    objDOM.innerText = `🐱 猫咪冷知识：${responseJSON.fact}`;
  } catch (err) {
    console.error(err);
    objDOM.innerText = "猫咪冷知识加载失败";
  }
};
getCatFact(catFactDOM);
