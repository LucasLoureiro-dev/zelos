// Local do arquivo: app/api/chat/route.js

export const badWords = [
  // Lista de palavras a serem filtradas (mantida como está)
  "bosta", "merda", "merdinha", "cocô", "coco",
  "caralho", "carai", "karalho", "krl", "krll",
  "porra", "poha", "pqp", "pqporra", "pqpqp",
  "puta", "putaria", "putinha", "puto", "putona",
  "foda", "fodido", "fodida", "fuder", "fodase", "foda-se", "se fuder", "vai se fuder",
  "cuzão", "cuzao", "cu", "cusão", "cuzinho",
  "buceta", "bucetinha", "xoxota", "xota", "xereca", "xoxotinha", "perereca", "bct",
  "pau", "pausão", "pauzinho", "piroca", "rola", "roludo",
  "pênis", "penis", "caralhinho",
  "boquete", "boquetinho", "mamador", "mamando",
  "arrombado", "arrombada", "arrombados",
  "otário", "otaria", "otarios", "otaria", "otário",
  "burro", "burra", "idiota", "imbecil", "retardado", "retardada",
  "mongoloide", "mongolóide", "downzinho",
  "corno", "corninho", "cornudo", "corna",
  "viado", "viadinho", "bicha", "bichinha", "boiola", "baitola",
  "nojento", "nojenta", "desgraça", "desgraçado", "maldito", "maldita",
  "miserável", "vagabundo", "vagabunda", "lixo", "escroto", "escrota",
  "animal", "animalesco", "cachorro", "cachorra", "cachorrão",
  "demônio", "capeta", "satanás", "satanas",

  // Inglês - palavrões e variações
  "fuck", "fucking", "fucker", "motherfucker", "mf", "wtf",
  "shit", "bullshit", "holyshit",
  "bitch", "bitches", "sonofabitch",
  "ass", "asshole", "jackass", "dumbass", "smartass",
  "dick", "dicks", "dickhead",
  "cock", "bigcock", "cockhead",
  "pussy", "pussies", "pussypass",
  "cunt", "cunts", "fuckingcunt",
  "slut", "sluts", "slutty", "whore", "whores", "whoring",
  "bastard", "jerk", "prick", "twat", "moron", "idiot",
  "retard", "retarded", "stupid", "dumb", "loser", "scumbag",
  "hoe", "skank", "tramp",

  // Termos violentos / gatilho
  "matar", "assassinar", "assassinato", "estuprar", "estupro",
  "suicídio", "suicidio", "suicidar", "suicidarse", "suicidar-se",
  "morte", "morrer", "se matar", "autoextermínio",
  "violência", "violento", "esfaquear", "fuzilar", "atirar", "tiro",
  "kill", "murder", "rape", "rapist", "die", "death",
  "suicide", "selfharm", "self-harm", "hang", "shoot", "stab",

  // Variações escritas com erro comum / internetês
  "f0da", "fod4", "phoda", "f0der", "fuder", "fodase", "fodasse",
  "caralhu", "karai", "krai", "krlh", "krll", "crl",
  "poha", "p0rra", "p0ha", "merd4", "b0sta",
  "x0x0ta", "bucet4", "p3nis", "r0la", "r0lha",
  "put@","pvt@", "b!tch", "f*ck", "sh1t", "d1ck", "a$$", "suck my dick"
];

export async function POST(req) {
  try {
    const { message, cargo } = await req.json(); // Agora recebe 'cargo' também

    if (!message) {
      return new Response(JSON.stringify({ error: "A mensagem não pode estar vazia." }), { status: 400 });
    }
    if (!cargo) {
        return new Response(JSON.stringify({ error: "O perfil do usuário não foi identificado." }), { status: 403 });
    }

    const lowerCaseMessage = message.toLowerCase().trim();

    // 1. FILTRO DE PALAVRAS IMPRÓPRIAS
    const hasBadWord = badWords.some(word => lowerCaseMessage.includes(word));
    if (hasBadWord) {
      return new Response(JSON.stringify({ reply: "Por favor, vamos manter a conversa respeitosa e profissional." }), { status: 200 });
    }
    
    // 2. SISTEMA DE ÁRVORE DE OPÇÕES ADAPTADO POR CARGO
    let treeOptions = {};
    let defaultReply = "Desculpe, não entendi sua solicitação. Por favor, escolha uma das opções numéricas para que eu possa te ajudar.";

    if (cargo === 'usuario') {
      treeOptions = {
        // Opções principais
        "1": "📂 Você escolheu:<b> Abrir um novo chamado.</b>\n<b>Passo a passo:</b>\n1. Navegue até a seção 'Abrir Chamado'.\n2. Preencha o título e a descrição do problema.\n3. Selecione o tipo de problema (se houver).\n4. Informe o número de patrimônio (se aplicável).\n5. Clique em 'Enviar Chamado'.",
        "2": "📊 Você escolheu:<b> Verificar status dos meus chamados.</b>\n<b>Passo a passo:</b>\n1. No seu painel, vá para a seção 'Meus Chamados' ou observe a tabela 'Últimas Chamadas'.\n2. Você verá uma lista com todos os seus chamados e seus respectivos status (Pendente, Em Andamento, Concluído).",
        "3": "💡 Você escolheu:<b> Como usar o painel do usuário.</b>\n<b>Detalhes:</b>\n<b>1. Visão Geral:</b> Métricas de Total de Chamadas, Pendentes, Em Andamento e Concluídas.\n<b>2. Tabela 'Últimas Chamadas':</b> Resumo dos seus chamados recentes.\n<b>3. Gráfico:</b> Representação visual do estado dos seus chamados."
      };
      defaultReply = "Não entendi sua opção. Como usuário, você pode escolher:\n1. Abrir um novo chamado\n2. Verificar status dos meus chamados\n3. Como usar o painel do usuário";
    } else if (cargo === 'tecnico') {
      treeOptions = {
        // Opções principais
        "1": "📦 Você escolheu:<b> Ver chamados disponíveis.</b>\n<b>Passo a passo:</b>\n1. No seu painel, na seção 'Últimas Chamadas', procure por chamados com status 'pendente'.\n2. Clique no ícone de 'olho' (visualizar) para ver os detalhes do chamado e decidir se deseja se atribuir.",
        "2": "🛠️ Você escolheu:<b> Ver meus chamados em andamento.</b>\n<b>Passo a passo:</b>\n1. Na tabela 'Últimas Chamadas' do seu painel, filtre ou procure chamados com status 'em andamento'.\n2. Você pode clicar no ícone de 'olho' para ver os detalhes de cada um.",
        "3": "👷 Você escolheu:<b> Como me atribuir a um chamado.</b>\n<b>Passo a passo:</b>\n1. Ao visualizar um chamado com status 'pendente' (clicando no ícone de 'olho'), um modal aparecerá.\n2. Dentro do modal, clique no botão 'Se atribuir'.\n3. O status do chamado mudará para 'em andamento' e ele será associado a você.",
        "4": "✅ Você escolheu:<b> Como finalizar um chamado.</b>\n<b>Passo a passo:</b>\n1. Acesse os detalhes de um chamado em andamento (via ícone de 'olho' na tabela).\n2. No modal de detalhes do chamado, você deverá encontrar uma opção ou botão para 'Finalizar Chamado'.\n3. Ao clicar, o status será alterado para 'concluida'.",
        "5": "🖥️ Você escolheu:<b> Como usar o painel do técnico.</b>\n<b>Detalhes:</b>\n<b>1. Visão Geral:</b> Total de Chamados na sua área, Chamados Pendentes, Em Andamento e Concluídos.\n<b>2. Secção 'Chamados':</b> Lista os chamados da sua área de atuação.\n<b>3. Botão 'Ações':</b> Use o ícone de 'olho' para ver detalhes e o botão 'Se Atribuir' (no modal) para iniciar um chamado."
      };
      defaultReply = "Não entendi sua opção. Como técnico(a), você pode escolher:\n1. Ver chamados disponíveis\n2. Ver meus chamados em andamento\n3. Como me atribuir a um chamado\n4. Como finalizar um chamado\n5. Como usar o painel do técnico";
    } else if (cargo === 'admin') {
      treeOptions = {
        // Opções principais
        "1": "📄 Você escolheu:<b> Gerar Relatório de Chamados.</b>\n<b>Passo a passo:</b>\n1. No seu painel administrativo, procure pelo botão 'Exportar Relatório' no canto superior direito.\n2. Clique nele para fazer o download de um arquivo PDF contendo os dados dos chamados.",
        "2": "📈 Você escolheu:<b> Verificar visão geral do sistema.</b>\n<b>Detalhes:</b>\n1. A seção 'Overview' no seu painel mostra o 'Total de Chamados', 'Chamados Abertos' e 'Total de Chamados Concluídos'.\n2. A tabela 'Últimos Chamados' oferece um resumo rápido da atividade recente do sistema.",
        "3": "✏️ Você escolheu:<b> Como criar/editar um chamado.</b>\n<b>Passo a passo:</b>\n1. Para criar, navegue até a seção 'Chamados' (disponível ao lado esquerdo da tela) e procure um botão 'Novo Chamado'.\n2. Para editar, na mesma seção, identifique o chamado desejado e use o ícone de 'editar' ou similar para modificar seus detalhes.",
        "4": "👨‍💻 Você escolheu:<b> Como atribuir um técnico a um chamado.</b>\n<b>Passo a passo:</b>\n1. Ao editar um chamado (conforme a opção 3), procure pelo campo 'Técnico Responsável'.\n2. Selecione o técnico desejado na lista de opções.\n3. Salve as alterações para atribuir o técnico ao chamado.",
        "5": "🏢 Você escolheu:<b> Como usar o painel do administrador.</b>\n<b>Detalhes:</b>\n<b>1. 'Visão Geral':</b> Oferece estatísticas importantes sobre o fluxo de chamados.\n<b>2. Tabela de 'Últimos Chamados':</b> Mostra as atividades mais recentes no sistema.\n<b>3. Botão 'Exportar Relatório':</b> Gera documentos em PDF para análise ou prestação de contas."
      };
      defaultReply = "Não entendi sua opção. Como administrador(a), você pode escolher:\n1. Gerar Relatório de Chamados\n2. Verificar visão geral do sistema\n3. Como criar/editar um chamado\n4. Como atribuir um técnico a um chamado\n5. Como usar o painel do administrador";
    } else if (cargo === 'visitante') {
        treeOptions = {
            "1": "👋 Você escolheu: <b> Informações gerais sobre o sistema.</b>\nO sistema ZELOS é uma plataforma de Helpdesk/Busca e Demanda, desenvolvida para otimizar o gerenciamento de solicitações de suporte dentro de instituições.",
            "2": "📞 Você escolheu: <b> Falar com um atendente.</b>\nPor favor, entre em contato com nosso suporte através do telefone (11) 93445-6586 ou envie um email para suporte@zelos.com.br."
        };
        defaultReply = "Não entendi sua opção. Como visitante, posso te ajudar com:\n1. Informações gerais sobre o sistema\n2. Falar com um atendente";
    }

    if (treeOptions[lowerCaseMessage]) {
      return new Response(JSON.stringify({ reply: treeOptions[lowerCaseMessage] }), { status: 200 });
    }

    // 3. TRATAMENTO PARA OPÇÕES INVÁLIDAS
    if (/^[\d.]+$/.test(lowerCaseMessage) && !treeOptions[lowerCaseMessage]) {
      return new Response(JSON.stringify({ reply: "Opção inválida. " + defaultReply }), { status: 200 });
    }

    // 4. MENSAGEM PADRÃO PARA QUALQUER OUTRA COISA
    return new Response(JSON.stringify({ reply: defaultReply }), { status: 200 });

  } catch (error) {
    console.error("ERRO NA API:", error); 
    return new Response(JSON.stringify({ error: "Ocorreu um erro no servidor. Tente novamente mais tarde." }), { status: 500 });
  }
}