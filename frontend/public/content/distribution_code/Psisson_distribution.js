/*
// JavaScript Document
//html里应该含有<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
function factorial(n) {    //计算阶乘
	if (n === 0 || n === 1) return 1;            
	let result = 1;         
	for (let i = 2; i <= n; i++) {               
		result *= i;
	}            
	return Number(result);     
}

function Pd(ri, k) {    //泊松分布的横纵坐标    
	const x = Array.from({ length: k + 1 }, (_, i) => i);            
	const y = x.map(i => (Math.E ** (-ri)) * (ri ** i) / factorial(i));            
	return { x, y };
}

function Bd(n, p) {    //二项分布的横纵坐标    
	const x = Array.from({ length: n + 1 }, (_, i) => i);            
	const y = x.map(i => ((p**i)*((1-p)**(n-i))*factorial(n)/(factorial(i)*factorial(n-i))));
	return { x, y };
        }
//基本函数
function updatePdPlot(ri, k) {            
	const { x, y } = Pd(ri, k);
	const data = [{                
		x: x,       
		y: y,        
		type: 'bar',        
		width: 0.5        
	}];
	const yMax = Math.max(...y); // 计算 y 的最大值
  // 将 y 轴的最大值对齐到最近的 0.1 刻度
	const fixedStep = 0.1; // 固定刻度
	const alignedYMax = Math.ceil(yMax / fixedStep) * fixedStep;
	const layout = {
		title: `泊松分布 (λ=${ri}, k=${k})`,
		xaxis: { title: 'x' },
		yaxis: { title: 'P',range:[0,alignedYMax] }  
	};
	Plotly.newPlot('Poisson_plot', data, layout);    //新建图表
}
function updateBdPlot(n, p) {            
	const { x, y } = Bd(n, p);
	const data = [{                
		x: x,       
		y: y,        
		type: 'bar',        
		width: 0.5        
	}];
	const yMax = Math.max(...y); // 计算 y 的最大值
  // 将 y 轴的最大值对齐到最近的 0.1 刻度
	const fixedStep = 0.1; // 固定刻度
	const alignedYMax = Math.ceil(yMax / fixedStep) * fixedStep;
	const layout = {
		title: `二项分布 (n=${n}, p=${p})`,
		xaxis: { title: 'x' },
		yaxis: { title: 'P',range:[0,alignedYMax] }  
	};
	Plotly.newPlot('Binomial_plot', data, layout);    //新建图表
}
//更新函数
//
function onSliderChangePd() {
	const ri = parseFloat(document.getElementById('ri-slider').value);
	const k = parseInt(document.getElementById('k-slider').value);
	document.getElementById('ri-input').value = ri;
	document.getElementById('k-input').value = k;
	updatePdPlot(ri, k);    
}
function onInputChangePd() {
	const ri = parseFloat(document.getElementById('ri-input').value);
	const k = parseInt(document.getElementById('k-input').value);
	document.getElementById('ri-slider').value = ri;
	document.getElementById('k-slider').value = k;
	updatePdPlot(ri, k);    
}
function onSliderChangeBd() {
	const n = parseInt(document.getElementById('n-slider-two').value);
	const p = parseFloat(document.getElementById('p-slider-two').value);
	document.getElementById('n-input-two').value = n;
	document.getElementById('p-input-two').value = p;
	updateBdPlot(n, p);    
}
function onInputChangeBd() {
	const n = parseInt(document.getElementById('n-input-two').value);
	const p = parseFloat(document.getElementById('p-input-two').value);
	document.getElementById('n-slider-two').value = n;
	document.getElementById('p-slider-two').value = p;
	updateBdPlot(n, p);    
}
//滑块输入
function Pd_main() {
	if (document.getElementById('Pd').style.display=="none"){document.getElementById('Pd').style.display="block"}
	else{
		document.getElementById('Pd').style.display="none"
	}
	if (document.getElementById('Pd_button').textContent=="Have a look!"){document.getElementById('Pd_button').innerHTML="Hide"}
	else{
		document.getElementById('Pd_button').innerHTML="Have a look!"
	}
	const ri = 5;
	const k = 10;
	updatePdPlot(ri, k);
	const riSlider = document.getElementById('ri-slider');
	const kSlider = document.getElementById('k-slider');
	const riInput = document.getElementById('ri-input');
	const kInput = document.getElementById('k-input');
	riSlider.value = ri;
	kSlider.value = k;
	riInput.value = ri;
	kInput.value = k;
	riSlider.addEventListener('input', onSliderChangePd);
	kSlider.addEventListener('input', onSliderChangePd);
	riInput.addEventListener('input', onInputChangePd);
	kInput.addEventListener('input', onInputChangePd);
}
function Bd_main() {
	if (document.getElementById('Bd').style.display=="none"){document.getElementById('Bd').style.display="block"}
	else{
		document.getElementById('Bd').style.display="none"
	}
	if (document.getElementById('Bd_button').textContent=="Have a look!"){document.getElementById('Bd_button').innerHTML="Hide"}
	else{
		document.getElementById('Bd_button').innerHTML="Have a look!"
	}
	const n = 5;
	const p = 0.5;
	updateBdPlot(n, p);
	const nSlider = document.getElementById('n-slider-two');
	const pSlider = document.getElementById('p-slider-two');
	const nInput = document.getElementById('n-input-two');
	const pInput = document.getElementById('p-input-two');
	nSlider.value = n;
	pSlider.value = p;
	nInput.value = n;
	pInput.value = p;
	nSlider.addEventListener('input', onSliderChangeBd);
	pSlider.addEventListener('input', onSliderChangeBd);
	nInput.addEventListener('input', onInputChangeBd);
	pInput.addEventListener('input', onInputChangeBd);
}
*/
//尚在调试通用版本
// 通用的分布更新函数
function updateDistributionPlot(distributionFunction, title, xLabel, yLabel, plotId, sliderIds) {
    const values = sliderIds.map(id => {
        const element = document.getElementById(id);
        return element.type === 'range' ? parseFloat(element.value) : parseInt(element.value);
    });

    const { x, y } = distributionFunction(...values);
    const data = [{
        x: x,
        y: y,
        type: 'bar',
        width: 0.5
    }];

    const yMax = Math.max(...y);
    const fixedStep = 0.1;
    const alignedYMax = Math.ceil(yMax / fixedStep) * fixedStep;

    const layout = {
        title: title,
        xaxis: { title: xLabel },
        yaxis: { title: yLabel, range: [0, alignedYMax] }
    };

    Plotly.newPlot(plotId, data, layout);
}

// 通用的滑块和输入框事件处理函数
function setupDistributionControls(distributionFunction, title, xLabel, yLabel, plotId, sliderIds, inputIds) {
    sliderIds.forEach((sliderId, index) => {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputIds[index]);

        slider.addEventListener('input', () => {
            input.value = slider.value;
            updateDistributionPlot(distributionFunction, title, xLabel, yLabel, plotId, sliderIds);
        });

        input.addEventListener('input', () => {
            slider.value = input.value;
            updateDistributionPlot(distributionFunction, title, xLabel, yLabel, plotId, sliderIds);
        });
    });
}

// 通用的显示/隐藏容器函数
function toggleContainer(containerId, buttonId) {
    const container = document.getElementById(containerId);
    const button = document.getElementById(buttonId);

    if (container.style.display === "none") {
        container.style.display = "block";
        button.textContent = "Hide";
    } else {
        container.style.display = "none";
        button.textContent = "Have a look!";
    }
}

// 泊松分布的主函数
function Pd_main() {
    toggleContainer('Pd', 'Pd_button');

    const sliderIds = ['ri-slider', 'k-slider'];
    const inputIds = ['ri-input', 'k-input'];
    setupDistributionControls(Pd, `泊松分布 (λ=${document.getElementById('ri-slider').value}, k=${document.getElementById('k-slider').value})`, 'x', 'P', 'Poisson_plot', sliderIds, inputIds);
}

// 二项分布的主函数
function Bd_main() {
    toggleContainer('Bd', 'Bd_button');

    const sliderIds = ['n-slider-two', 'p-slider-two'];
    const inputIds = ['n-input-two', 'p-input-two'];
    setupDistributionControls(Bd, `二项分布 (n=${document.getElementById('n-slider-two').value}, p=${document.getElementById('p-slider-two').value})`, 'x', 'P', 'Binomial_plot', sliderIds, inputIds);
}

// 初始化函数
function init() {
    Pd_main();
    Bd_main();
}

// 页面加载时初始化
window.onload = init;
