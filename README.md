#  Cuide-se! — Jogo da Memória & Saúde

O **Cuide-se!** é um jogo da memória interativo e educativo focado na conscientização sobre cuidados com a saúde, bem-estar e hábitos saudáveis. O projeto conta com ranking global em tempo real, diferentes níveis de dificuldade, efeitos sonoros, música de fundo e animações interativas.

---

##  Demonstração

- **Link de Acesso:** [https://game-transformese.vercel.app](https://game-transformese.vercel.app)

---

##  Tecnologias Utilizadas

### **Front-End**
- **HTML5 & CSS3:** Interface moderna, responsiva e com suporte a variáveis de estilo e animações.
- **JavaScript (ES6+):** Lógica do jogo, gerenciamento de estado, cronômetro e manipulação de áudio via Web Audio API.
- **HTML5 Canvas:** Animação de confetes ao vencer a partida.

### **Back-End & Banco de Dados**
- **Vercel Serverless Functions:** Rota de API Node.js (`/api/ranking`) para lidar com as pontuações sem a necessidade de um servidor 24/7.
- **Supabase (PostgreSQL):** Banco de dados relacional na nuvem para armazenar e organizar o ranking global dos jogadores.

---

##  Funcionalidades

-  **Associação Inteligente:** Combina cartas de práticas saudáveis com seus respectivos benefícios.
-  **Dificuldades Ajustáveis:**
  - **Fácil:** 6 pares
  - **Médio:** 8 pares
  - **Difícil:** 12 pares
-  **Ranking Global:** Pontuações salvas e sincronizadas em tempo real via Supabase.
-  **Trilha Sonora e Sons:** Efeitos sonoros ao virar cartas, acertar/errar e opções de músicas relaxantes (Piano e Natureza).
-  **Dicas de Saúde:** Dicas interativas exibidas a cada par correto encontrado.

---

## 📁 Estrutura do Projeto

```text
.
├── api/
│   └── ranking.js       # Serverless Function na Vercel (Integração com Supabase)
├── audio.js             # Gerenciamento de áudio e música
├── data.js              # Cartas, dificuldades e dicas de saúde
├── game.js              # Lógica principal do jogo e chamadas da API
├── index.html           # Interface do usuário
├── styles.css           # Estilização e responsividade
├── package.json         # Dependências do projeto (@supabase/supabase-js)
└── README.md            # Documentação do projeto
