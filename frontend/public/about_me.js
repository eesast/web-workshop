function ChangeColor()
{
    let btn = document.getElementById("ColorBtn");
    let comment = document.getElementsByTagName("comment");
    let stress = document.getElementsByTagName("stress");
    let body = document.getElementsByTagName("body");

    let BtnStrCold = "切换到冷色风格";
    let BtnStrWarm="切换到暖色风格";
    if(btn.textContent==BtnStrCold)
    {
        btn.textContent=BtnStrWarm;
        for(var i=0;i<comment.length;i++)
        {
            comment[i].style.color="#677bfa";
        }
        for(var i=0;i<stress.length;i++)
        {
            stress[i].style.color="#ac67faff";
        }
        body[0].style.backgroundImage="linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8)),url('./about_me_resource/suika_bg.jpg')";
        body[0].style.color="#11587b"
    }
    else{
        btn.textContent=BtnStrCold;
        for(var i=0;i<comment.length;i++)
        {
            comment[i].style.color="#df2727ff";
        }
        for(var i=0;i<stress.length;i++)
        {
            stress[i].style.color="#f07250ff";
        }
        body[0].style.color="#441c1cff"
        body[0].style.backgroundImage="linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.8)),url('./about_me_resource/suika_bg_warm.jpg')";
    }
}

document.addEventListener('DOMContentLoaded', function() {
  const GithubDisplayDiv = document.getElementById("GithubDiv");
  const Display = async (objDOM) => {
    try {
      console.log("开始加载Github数据");
      const response = await fetch("https://api.github.com/users/RhNO3-lx/repos");
      const repos = await response.json();
      if (objDOM == undefined || objDOM == null) {
        console.error("objDOM is undefined or null");
        return;
      }

      console.log("Github数据加载成功");

      objDOM.innerHTML = "";
      repos.forEach(repo => {
        const repoDiv = document.createElement("div");
        repoDiv.innerHTML = `
          <div>
              <p>${repo.name}
              <a href="${repo.html_url}" class="btn btn-primary">查看</a>
              </p>
          </div>
        `;
        objDOM.appendChild(repoDiv);
      });
    } catch (err) {
      console.error(err);
      if (objDOM != null) {
        objDOM.textContent = "加载失败";
      }
    }
  };
  Display(GithubDisplayDiv);
});
