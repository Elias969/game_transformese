export const PAIRS = [
  { id: 'water', label: 'Hidratação Constante', emoji: '💧', benefit: 'Energia e Saúde do Corpo', benefitEmoji: '🥤' },
  { id: 'sleep', label: 'Sono Reparador', emoji: '😴', benefit: 'Regeneração e Bom Humor', benefitEmoji: '🌙' },
  { id: 'breathe', label: 'Pausa para Respirar', emoji: '🧘', benefit: 'Redução do Estresse', benefitEmoji: '🌿' },
  { id: 'sun', label: 'Banho de Sol e Movimento', emoji: '☀️', benefit: 'Vitamina D e Endorfina', benefitEmoji: '🌻' },
  { id: 'journal', label: 'Escrita Terapêutica', emoji: '📖', benefit: 'Organização Emocional', benefitEmoji: '🖊️' },
  { id: 'food', label: 'Alimentação Consciente', emoji: '🥗', benefit: 'Nutrição Vital', benefitEmoji: '🍎' },
  { id: 'phone', label: 'Detox Digital', emoji: '📵', benefit: 'Presença e Calma', benefitEmoji: '🌸' },
  { id: 'hug', label: 'Afeto e Conexão', emoji: '🤗', benefit: 'Acolhimento Afetuoso', benefitEmoji: '💞' },
  { id: 'music', label: 'Música e Lazer', emoji: '🎶', benefit: 'Bem-Estar e Alegria', benefitEmoji: '🎵' },
  { id: 'talk', label: 'Conversar e Desabafar', emoji: '💬', benefit: 'Clareza e Alívio Mental', benefitEmoji: '🗣️' },
  { id: 'stretch', label: 'Alongamento e Postura', emoji: '🧎', benefit: 'Flexibilidade e Leveza', benefitEmoji: '🌷' },
  { id: 'rock', label: 'Banho de Sol e Movimento', emoji: '☀️', benefit: 'Movimento e Disposição', benefitEmoji: '👟' },
];

export const LILAS_PAIRS = [
  { id: 'lilas1', label: 'Agosto Lilás', back: 'assets/agosto-lilas.jpeg', benefit: 'Mês de Conscientização e Luta', benefitEmoji: '💜' },
  { id: 'lilas2', label: 'Denuncie a Violência', back: 'assets/agosto-lilas.jpeg', benefit: 'Ligue 180 e Proteja-se', benefitEmoji: '📞' },
  { id: 'lilas3', label: 'Apoie e Proteja', back: 'assets/agosto-lilas.jpeg', benefit: 'Rede de Apoio à Mulher', benefitEmoji: '🤝' },
  { id: 'lilas4', label: 'Empodere-se', back: 'assets/agosto-lilas.jpeg', benefit: 'Fim da Violência contra a Mulher', benefitEmoji: '👊' },
];

export const DIFFICULTIES = {
  facil: { label: 'Fácil', pairs: 6, cols: 3, limit: 60, lilas: 1 },
  medio: { label: 'Médio', pairs: 8, cols: 4, limit: 90, lilas: 2 },
  dificil: { label: 'Difícil', pairs: 12, cols: 4, limit: 120, lilas: 4 },
};

export const BACK_LOGO = `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="32" cy="32" r="27" fill="none" stroke="#E6007E" stroke-width="1.6" opacity=".85"/>
  <circle cx="32" cy="32" r="23.5" fill="none" stroke="#fff" stroke-width=".8" opacity=".35"/>
  <text x="32" y="31" font-family="Quicksand, system-ui, sans-serif" font-size="9.5" font-weight="700" letter-spacing="-0.4" fill="#fff" text-anchor="middle">Cuide-se!</text>
  <text x="32" y="41" font-family="Quicksand, system-ui, sans-serif" font-size="4.5" font-weight="600" fill="#E6007E" text-anchor="middle">SEU BEM-ESTAR</text>
</svg>`;

export const TIPS = [
  'Respire fundo por 3 segundos agora! 💨',
  'Que tal beber um copo d\u0027água agora? 💧',
  'Feche os olhos e solte a tensão do rosto. 😌',
  'Estique os ombros e sinta o alívio. 🤲',
  'Dê um passo para fora e sinta o sol. ☀️',
  'Escreva uma coisa boa do seu dia hoje. 📖',
  'Deixe o celular de lado por alguns minutos. 📵',
  'Um abraço ou um carinho renova o coração. 💞',
  'Coma devagar e saboreie cada mordida. 🥗',
  'Lembre-se: você merece uma pausa. 💗',
  'Alongue o pescoço devagar para os lados. 🧎',
  'Pense em algo que te faz sorrir agora. 🌷',
  'Sua saúde mental é tão importante quanto a física. 💙',
  'O autocuidado também é saber descansar. 🌙',
  'Informe-se e denuncie: violência contra a mulher é crime. Ligue 180. 💜',
  'Você não está sozinha: procure apoio se precisar. 💜',
];