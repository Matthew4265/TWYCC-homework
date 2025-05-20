// script.js

// 數據定義
const populationData = [
  { name: '中老年人口 (45歲以上)', value: 50, description: '行動力較低，多居老舊房屋' },
  { name: '青壯年人口 (25-44歲)', value: 25, description: '主要為通勤族群' },
  { name: '青年與兒童 (0-24歲)', value: 25, description: '主要為學生' },
];

const housingData = [
  { name: '低窪區老舊公寓', value: 40, description: '暖暖街、碇內里等地區' },
  { name: '山坡邊自建房', value: 35, description: '暖暖路附近丘陵地區' },
  { name: '其他一般住宅', value: 25, description: '較新建築或較安全區域' },
];

const occupationData = [
  { name: '服務業', value: 35, description: '市區商店、餐飲等' },
  { name: '製造業工人', value: 25, description: '過港路工業區' },
  { name: '公務員', value: 20, description: '政府機關工作者' },
  { name: '其他職業', value: 20, description: '自由業、退休人士等' },
];

const riskExposureData = [
  { name: '淹水高風險區居民', value: 45, description: '低窪地區、基隆河沿岸' },
  { name: '坡地災害風險區居民', value: 30, description: '暖暖路附近坡度>10度區域' },
  { name: '相對低風險區居民', value: 25, description: '地勢較高且非陡坡區域' },
];

const vulnerabilityData = [
  { name: '中老年居民', value: 35, description: '行動不便、經濟資源有限' },
  { name: '工業區工人', value: 25, description: '工作環境位於風險區、經濟弱勢' },
  { name: '通勤族', value: 20, description: '高度依賴交通系統' },
  { name: '青年與兒童', value: 20, description: '防災知識缺乏、依賴成人決策' },
];

// 圓餅圖顏色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// 當前活躍標籤
let activeTab = 'population';

// 獲取數據
function getActiveData() {
  switch (activeTab) {
    case 'population': return populationData;
    case 'housing': return housingData;
    case 'occupation': return occupationData;
    case 'risk': return riskExposureData;
    case 'vulnerability': return vulnerabilityData;
    default: return populationData;
  }
}

// 獲取圖表標題
function getChartTitle() {
  switch (activeTab) {
    case 'population': return '暖暖區人口年齡結構';
    case 'housing': return '暖暖區居住環境分布';
    case 'occupation': return '暖暖區居民職業分布';
    case 'risk': return '暖暖區居民氣候風險暴露';
    case 'vulnerability': return '暖暖區各族群脆弱性分析';
    default: return '';
  }
}

// 初始化圖表
let chart = null;
function renderChart() {
  const data = getActiveData();
  const ctx = document.getElementById('pie-chart').getContext('2d');
  
  // 銷毀舊圖表（如果存在）
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(item => item.name),
      datasets: [{
        data: data.map(item => item.value),
        backgroundColor: COLORS,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
        },
        tooltip: {
          enabled: false,
          external: function(context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chart-tooltip';
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            tooltipEl.style.opacity = 1;
            const dataIndex = tooltipModel.dataPoints[0].dataIndex;
            const item = data[dataIndex];
            tooltipEl.innerHTML = `
              <p class="title">${item.name}: ${item.value}%</p>
              <p class="description">${item.description}</p>
            `;

            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.pointerEvents = 'none';
          },
        },
      },
    },
  });

  // 更新標題
  document.getElementById('chart-title').textContent = getChartTitle();
}

// 處理按鈕點擊
document.querySelectorAll('#tab-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    activeTab = button.getAttribute('data-tab');
    
    // 更新按鈕樣式
    document.querySelectorAll('#tab-buttons button').forEach(btn => {
      btn.className = `px-3 py-1 rounded ${btn.getAttribute('data-tab') === activeTab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
    });
    
    // 重新渲染圖表
    renderChart();
  });
});

// 初始渲染
renderChart();