import { createClient } from '@supabase/supabase-js';

// Substitua pelas suas chaves do Supabase
const SUPABASE_URL = 'https://srxeqyorqxujhdbhptik.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PU2i6lVuZl4P4Aogrjxd2g_Kf0D-Z_0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Configuração de CORS para permitir acesso de qualquer dispositivo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. QUANDO ALGUÉM QUER VER O RANKING (GET)
  if (req.method === 'GET') {
    // Busca do Supabase os 10 primeiros ordenados por pontuação maior
    const { data, error } = await supabase
      .from('ranking')
      .select('nome, pontuacao')
      .order('pontuacao', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ranking: data });
  }

  // 2. QUANDO ALGUÉM APERTA "SALVAR RANKING" (POST)
  if (req.method === 'POST') {
    const { nome, pontuacao } = req.body;

    if (!nome || pontuacao === undefined) {
      return res.status(400).json({ error: "Nome e pontuação são obrigatórios" });
    }

    // Insere no banco de dados na nuvem
    const { data, error } = await supabase
      .from('ranking')
      .insert([{ nome: nome, pontuacao: Number(pontuacao) }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Pontuação salva no banco com sucesso!" });
  }
}