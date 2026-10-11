export const domains = {
  O: { name: '开放性', description: '对新观念、想象与不同体验的倾向。' },
  C: { name: '尽责性', description: '规划、自律与持续完成任务的倾向。' },
  E: { name: '外向性', description: '参与社交、表达自己与寻求活动的倾向。' },
  A: { name: '宜人性', description: '信任、合作与关照他人的倾向。' },
  N: { name: '神经质', description: '体验压力、担忧与情绪波动的倾向。' }
};

export function score(questions, answers) {
  if (questions.length !== 120 || new Set(questions.map(q => q.id)).size !== 120) throw new Error('题库需要包含 120 个独立题目');
  const sums = Object.fromEntries(Object.keys(domains).map(key => [key, { raw: 0, count: 0 }]));
  for (const question of questions) {
    const answer = answers[question.id];
    if (!Number.isInteger(answer) || answer < 1 || answer > 5) throw new Error('请完成全部题目');
    if (!sums[question.domain] || !['plus', 'minus'].includes(question.keyed)) throw new Error('题库格式错误');
    sums[question.domain].raw += question.keyed === 'minus' ? 6 - answer : answer;
    sums[question.domain].count++;
  }
  return Object.entries(sums).map(([key, value]) => {
    if (value.count !== 24) throw new Error('每个维度需要 24 题');
    return { key, ...domains[key], raw: value.raw, mean: value.raw / value.count, normalized: Math.round((value.raw - value.count) / (4 * value.count) * 100) };
  });
}
