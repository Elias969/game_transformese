export default async function handler(req, res) {
  // Configurar cabeçalhos CORS para permitir chamadas do seu front-end
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === 'GET') {
    // Lógica para buscar as pontuações no banco
    return res.status(200).json({ ranking: [] });
  }

  if (req.method === 'POST') {
    const { nome, pontuacao } = req.body;
    // Lógica para salvar a nova pontuação no banco
    return res.status(201).json({ message: "Pontuação salva com sucesso!" });
  }
}