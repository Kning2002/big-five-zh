import { score } from './scoring.js';
const $ = id => document.getElementById(id);
const storageKey = 'big-five-zh:answers:v1';
const pageSize = 10;
let questions = [], answers = {}, page = 0, result;
try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (saved && typeof saved === 'object' && !Array.isArray(saved)) answers = saved; } catch { /* Storage may be unavailable. */ }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(answers)); }
  catch { $('save-status').textContent = '浏览器不允许保存；请保持本页打开，完成后下载结果。'; }
}
function show(section) { ['intro', 'quiz', 'results'].forEach(id => $(id).hidden = id !== section); }
function updateProgress() {
  const completed = questions.filter(q => Number.isInteger(answers[q.id]) && answers[q.id] >= 1 && answers[q.id] <= 5).length;
  $('progress').value = completed;
  $('progress-text').textContent = `${completed} / 120 已完成`;
}
function render() {
  show('quiz');
  $('validation').textContent = '';
  $('questions').replaceChildren();
  questions.slice(page * pageSize, (page + 1) * pageSize).forEach((question, index) => {
    const field = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = `${page * pageSize + index + 1}. ${question.text}`;
    field.append(legend);
    const options = document.createElement('div'); options.className = 'options';
    ['很不符合', '不太符合', '中立', '比较符合', '很符合'].forEach((label, i) => {
      const option = document.createElement('label'); option.className = 'option';
      const input = document.createElement('input'); input.type = 'radio'; input.name = question.id; input.value = i + 1; input.checked = answers[question.id] === i + 1;
      input.addEventListener('change', () => { answers[question.id] = i + 1; save(); updateProgress(); });
      const text = document.createElement('span'); text.textContent = `${i + 1} · ${label}`;
      option.append(input, text); options.append(option);
    });
    field.append(options); $('questions').append(field);
  });
  $('previous').disabled = page === 0;
  $('next').textContent = page === 11 ? '查看结果' : '下一页';
  $('page-number').textContent = `第 ${page + 1} / 12 页`;
  updateProgress(); $('page-title').focus();
}
function displayResults() {
  try { result = score(questions, answers); } catch (error) { $('validation').textContent = error.message; return; }
  $('scores').replaceChildren();
  result.forEach(item => {
    const card = document.createElement('article'); card.className = 'score-card';
    card.innerHTML = `<h3>${item.name}<span>${item.normalized} / 100</span></h3><p>${item.description}</p><div class="bar" aria-hidden="true"><div style="width:${item.normalized}%"></div></div><small>原始分 ${item.raw} / 120 · 平均分 ${item.mean.toFixed(2)} / 5</small>`;
    $('scores').append(card);
  });
  show('results'); $('result-title').focus();
}
$('start').onclick = () => { const first = questions.findIndex(q => !answers[q.id]); page = first < 0 ? 0 : Math.floor(first / pageSize); render(); };
$('previous').onclick = () => { if (page > 0) { page--; render(); } };
$('next').onclick = () => {
  const missing = questions.slice(page * pageSize, (page + 1) * pageSize).find(q => !answers[q.id]);
  if (missing) { $('validation').textContent = '本页还有题目未作答，请补充后继续。'; document.getElementsByName(missing.id)[0].focus(); return; }
  if (page < 11) { page++; render(); } else displayResults();
};
$('questions').onsubmit = event => event.preventDefault();
$('reset').onclick = () => { if (confirm('清空本浏览器保存的全部答案？')) { answers = {}; page = 0; save(); render(); } };
$('review').onclick = () => { page = 0; render(); };
$('download').onclick = () => {
  const file = new Blob([JSON.stringify({ version: '0.1.0', instrument: 'Johnson IPIP 120, community zh-cn translation', createdAt: new Date().toISOString(), note: '0–100 scores are range-normalized, not percentiles.', scores: result, answers }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = 'big-five-result.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
try {
  const response = await fetch('./data/questions.json');
  if (!response.ok) throw new Error('题库请求失败');
  questions = await response.json();
  score(questions, Object.fromEntries(questions.map(q => [q.id, 3])));
  answers = Object.fromEntries(questions.filter(q => Number.isInteger(answers[q.id]) && answers[q.id] >= 1 && answers[q.id] <= 5).map(q => [q.id, answers[q.id]]));
  $('start').disabled = false; $('start').textContent = Object.keys(answers).length ? '继续上次测评 →' : '开始认识自己 →';
} catch { $('load-error').textContent = '题库加载失败，请通过 HTTP 服务打开本站，或刷新重试。'; $('start').textContent = '暂时无法开始'; }
