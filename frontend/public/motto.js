const mottoDOM = document.getElementById('motto');
const getMotto = async (objDOM) => {
  try {
    const response = await fetch("https://api.vvhan.com/api/ian/wenxue?type=json");
    const responseJSON = await response.json();
    const content = responseJSON.data.content;
    const source = responseJSON.data.form;
    objDOM.innerText = `“${content}” ——《${source}》`;
  }
  catch (err) {
    console.error(err);
    objDOM.innerText = "每日一句加载失败";
  }
}
getMotto(mottoDOM);
