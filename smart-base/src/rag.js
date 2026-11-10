// RAG básico: pergunta -> recuperação semântica -> prompt com contexto -> (LLM opcional).
// Uso: node src/rag.js "Meu carregador não carrega a bateria, o que fazer?"
//
// A chamada a um LLM externo fica DESATIVADA por padrão. Para ativar, defina no .env:
//   RAG_LLM_ENABLED=true
//   LLM_API_URL=https://api.openai.com/v1/chat/completions   (qualquer API compatível com OpenAI)
//   LLM_API_KEY=...
//   LLM_MODEL=gpt-4o-mini
const { prisma } = require('./db');
const { buscarSemantica } = require('./busca');

const TOP_K = 5;
const MAX_TRECHO = 700;

function montarPrompt(pergunta, trechos) {
  const contexto = trechos
    .map((t, i) => `[${i + 1}] (${t.tipo} #${t.id}, similaridade ${Number(t.similaridade).toFixed(3)}) ${t.titulo}\n${String(t.texto).replace(/\s+/g, ' ').slice(0, MAX_TRECHO)}`)
    .join('\n\n');

  return [
    'Você é um atendente de suporte de uma loja de eletrônicos. Responda em português do Brasil,',
    'de forma objetiva, usando SOMENTE as informações do contexto abaixo. Se o contexto não for',
    'suficiente, diga que não encontrou a informação e sugira abrir um chamado de suporte.',
    'Cite as fontes no formato [n].',
    '',
    '=== CONTEXTO ===',
    contexto,
    '',
    '=== PERGUNTA ===',
    pergunta,
    '',
    '=== RESPOSTA ===',
  ].join('\n');
}

async function chamarLLM(prompt) {
  const { LLM_API_URL, LLM_API_KEY, LLM_MODEL } = process.env;
  if (!LLM_API_URL || !LLM_API_KEY) throw new Error('Defina LLM_API_URL e LLM_API_KEY para usar o LLM.');
  const resp = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${LLM_API_KEY}` },
    body: JSON.stringify({ model: LLM_MODEL || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.2 }),
  });
  if (!resp.ok) throw new Error(`LLM respondeu ${resp.status}: ${await resp.text()}`);
  const json = await resp.json();
  return json.choices?.[0]?.message?.content ?? '';
}

async function responder(pergunta) {
  const trechos = await buscarSemantica(pergunta, TOP_K);
  const prompt = montarPrompt(pergunta, trechos);
  return { trechos, prompt };
}

async function main() {
  const pergunta = process.argv.slice(2).join(' ').trim();
  if (!pergunta) {
    console.error('Uso: node src/rag.js "sua pergunta"');
    process.exitCode = 1;
    return;
  }

  const { trechos, prompt } = await responder(pergunta);
  console.log(`\nTrechos recuperados (top ${TOP_K}):`);
  trechos.forEach((t, i) => console.log(`  [${i + 1}] ${t.tipo} #${t.id}  sim=${Number(t.similaridade).toFixed(3)}  ${t.titulo}`));
  console.log('\n----- PROMPT FINAL (enviado ao LLM, se habilitado) -----\n');
  console.log(prompt);

  if (String(process.env.RAG_LLM_ENABLED).toLowerCase() === 'true') {
    console.log('\n----- RESPOSTA DO LLM -----\n');
    console.log(await chamarLLM(prompt));
  } else {
    console.log('\n(LLM desativado. Defina RAG_LLM_ENABLED=true no .env para gerar a resposta final.)');
  }
}

if (require.main === module) {
  main()
    .catch((e) => { console.error(e); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}

module.exports = { responder, montarPrompt };

