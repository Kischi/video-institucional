// Vídeo institucional — gerador da composição Hyperframes (cenas + motor de animação).
// Uso: node anim.mjs [infnet|ecdd]  →  index.html + timing.json
// PARTE 1 (até "montagem animada"): as cenas, uma chamada add() por quadro, em HTML/CSS posicionado em 1920×1080.
// PARTE 2: tempos (STARTS = frase que abre cada cena), deixas (CUES = seletor CSS → frase da fala) e animações.
import fs from "node:fs";
const VAR = process.argv[2] === "ecdd" ? "ecdd" : "infnet";
const ACC = VAR === "ecdd" ? (process.env.ECDD_ACC || "#F26A21") : "#FEDA0C";
const ic = (n, c = "ico") => fs.readFileSync(`assets/icons/${n}.svg`, "utf8").replace(/\s+/g, " ").trim().replace(/class="[^"]*"/, `class="${c}"`);
const head = (n, icon, label, title) => `${n ? `<div class="wm">${n}</div>` : ""}<div class="lab">${ic(icon)}${label}</div><div class="ttl">${title}</div>`;
const photo = (style, t, img) => img ? `<div class="photo img" style="${style}"><img src="assets/fotos/${img}" alt="" /></div>` : `<div class="photo" style="${style}"><div class="ph">${ic("camera")}FOTO<small>${t}</small></div></div>`;
const F = [];
const add = (name, html, o = {}) => F.push({ name, html, ...o });

add("01a-gancho", `<div class="ring" style="left:1330px;top:150px;width:820px;height:820px;opacity:.35"></div><div class="ring" style="left:1450px;top:270px;width:580px;height:580px;opacity:.18;border-style:dashed"></div>
<div class="h-s" style="top:214px">O mercado de trabalho não quer saber</div><div class="h-b dim" style="top:292px">o que você decorou</div>
<div class="h-s" style="top:478px">quer saber</div><div class="h-b y" style="top:548px">o que você</div><div class="h-b y" style="top:704px">consegue fazer</div>`, { bare: true });

add("01b-gancho", `<div class="h-s" style="top:200px">E só existe um jeito de aprender a fazer:</div><div class="h-b y" style="top:270px;font-size:176px">fazendo.</div>
<div class="g" style="left:136px;top:560px;width:800px;height:330px"></div><div class="cap abs" style="left:176px;top:596px">Aqui, todo semestre</div>
<div class="abs" style="left:176px;top:636px;width:720px;font-size:46px;font-weight:800;line-height:1.14">Você desenvolve e apresenta um projeto</div>
<div class="chip abs" style="left:176px;top:796px">${ic("building-bridge")}igual ao que faria em uma empresa</div>
${photo("left:1090px;top:470px;width:700px;height:400px;transform:rotate(3deg)", "aluno apresentando o projeto", "projeto.jpg")}
<div class="live" style="left:1128px;top:494px;transform:rotate(3deg)"><i></i>AO VIVO</div>
<div class="chip y abs" style="left:1180px;top:916px;height:64px;font-size:27px;padding:0 28px">${ic("sparkles")}É assim que se aprende de verdade</div>`, { bare: true });

add("02a-boas-vindas", `<div class="whoami"><b>ANDRE KISCHINEVSKY</b><span>${VAR === "ecdd" ? "Diretor da Faculdade ECDD" : "Diretor da Faculdade Infnet"}</span></div>`, { narr: "big", nologo: true });

const stops = [["bulb", "Modelo de ensino"], ["layout-grid", "Blocos"], ["clipboard-check", "Trabalhos"], ["writing", "Prova discursiva"], ["robot", "Inteligência artificial"], ["stairs", "Conceitos"], ["user-check", "Presença"], ["device-laptop", "Sistemas"], ["message-circle", "Apoio e dedicação"], ["rocket", "Primeiros passos"]];
let h = head("", "compass", "Boas-vindas", "Como tudo <em>funciona</em> por aqui") + `<svg class="ln"><path class="dash" d="M220,402 H1340 C1500,402 1500,682 1340,682 H220"/><path class="y" d="M220,402 H1340 C1500,402 1500,682 1340,682 H780"/></svg>`;
stops.forEach((s, i) => { const x = i < 5 ? 220 + i * 280 : 220 + (9 - i) * 280, y = i < 5 ? 350 : 630; h += `<div class="stop" style="left:${x}px;top:${y}px"><div class="dot">${ic(s[0])}<i>${i + 1}</i></div><span>${s[1]}</span></div>`; });
add("02b-trilha", h);

add("03-modelo", head("01", "bulb", "Modelo de ensino", "Para você aprender <em>fazendo</em>") + `
<svg class="ln"><path class="y" d="M246,520 C246,560 428,548 428,592"/><path class="y" d="M610,520 C610,560 428,548 428,592"/></svg>
<div class="g mk" style="left:96px;top:290px;width:300px;height:230px">${ic("target")}<span>Aprendizado por</span><b>Competências</b></div>
<div class="plus" style="left:396px;top:373px">+</div>
<div class="g mk" style="left:460px;top:290px;width:300px;height:230px">${ic("hammer")}<span>Desenvolvimento de</span><b>Projetos</b></div>
<div class="g hi mr" style="left:96px;top:592px;width:664px;height:188px">${ic("rocket")}<div><span>Criando</span><b>Desafios reais</b><p>parecidos com os da sua futura carreira</p></div></div>
<div class="g" style="left:800px;top:280px;width:680px;height:500px"></div><div class="cap abs" style="left:836px;top:312px">Em cada disciplina</div>
<div class="vbar" style="left:894px;top:420px;height:230px"></div>
<div class="flow abs" style="left:836px;top:346px;padding-left:28px;width:640px"><div class="n">${ic("target")}</div><div><b>Você desenvolve as competências</b><span>uma lista clara do que precisa saber fazer</span></div></div>
<div class="flow abs" style="left:836px;top:476px;padding-left:28px;width:640px"><div class="n">${ic("hammer")}</div><div><b>Em exercícios práticos</b><span>aprendendo enquanto faz</span></div></div>
<div class="flow abs" style="left:836px;top:606px;padding-left:28px;width:640px"><div class="n" style="background:${ACC};border-color:${ACC}">${ic("award", "ico\" style=\"stroke:#17202e")}</div><div><b>E é aprovado</b><span>quando demonstra todas elas</span></div></div>`);

h = head("02", "layout-grid", "Organização", "A graduação em <em>blocos</em>") + `<div class="g" style="left:96px;top:270px;width:900px;height:560px"></div>
<div class="abs" style="left:126px;top:290px;display:flex;align-items:center;gap:16px">${ic("layout-grid", "ico\" style=\"width:44px;height:44px")}<b style="font-size:38px;font-weight:800">BLOCO</b><span style="font-size:25px;color:var(--azul-gris)">um tema central</span><span class="chip y" style="height:40px;font-size:19px;letter-spacing:.06em">2 TRIMESTRES · 6 MESES</span></div>
<div class="tri" style="left:120px;top:362px;width:420px;height:250px"><i>1º TRIMESTRE</i></div><div class="tri" style="left:552px;top:362px;width:420px;height:250px"><i>2º TRIMESTRE</i></div>`;
[136, 340, 568, 772].forEach((x, i) => { h += `<div class="dr" style="left:${x}px;top:412px"><b>DR ${i + 1}</b><span>Disciplina Regular</span></div>`; });
h += `<div class="t2" style="left:138px;top:560px">${ic("repeat")}aulas 2× por semana</div><div class="t2" style="left:570px;top:560px">${ic("repeat")}aulas 2× por semana</div>
<div class="pb" style="left:120px;top:636px;width:852px;height:100px">${ic("rocket")}<b>PROJETO DE BLOCO</b><span>1 encontro por semana</span></div>
<div class="cap abs" style="left:126px;top:770px">4 Disciplinas Regulares + 1 Projeto de Bloco</div>
<div class="g hi" style="left:1036px;top:270px;width:444px;height:560px"></div>${photo("left:1060px;top:294px;width:396px;height:250px;border-radius:20px", "turma do Bloco de Entrada", "turma.jpg")}
<div class="cap abs" style="left:1066px;top:572px">O seu primeiro bloco</div><div class="abs" style="left:1066px;top:604px;font-size:40px;font-weight:800">Bloco de Entrada</div>
<div class="abs" style="left:1066px;top:664px;width:390px;font-size:24px;line-height:1.3;color:var(--azul-gris)">Colegas de várias graduações, quase todos começando a faculdade agora.</div>`;
add("04-bloco", h);

h = head("03", "clipboard-check", "Trabalhos", "O que você <em>entrega</em>") + `<div class="cap abs" style="left:96px;top:262px">Testes de Performance</div><div class="chip r abs" style="left:1146px;top:246px">${ic("alert-triangle")}ENTREGA OBRIGATÓRIA</div>
<div class="g cnt" style="left:96px;top:306px;width:600px;height:210px"><b>3</b><div><h3>TPs</h3><p>em cada<br>Disciplina Regular</p></div></div>
<div class="g cnt" style="left:726px;top:306px;width:600px;height:210px"><b>5</b><div><h3>TPs</h3><p>na disciplina de<br>Projeto de Bloco</p></div></div>
<div class="cap abs" style="left:96px;top:566px">Assessment · trabalho individual</div><div class="abs" style="left:96px;top:614px;width:1300px;height:100px">`;
for (let w = 1; w <= 11; w++) h += `<div class="wk${w === 9 ? " e" : w === 10 ? " d" : ""}" style="left:${(w - 1) * 112}px">${w}</div>`;
h += `</div><div class="flag" style="left:962px;top:562px">ENUNCIADO</div><div class="flag y" style="left:1096px;top:716px">ENTREGA</div><div class="cap abs" style="left:96px;top:722px;font-size:18px">Semanas do trimestre</div>
<div class="chip abs" style="left:96px;top:800px;height:70px;font-size:28px;padding:0 28px">${ic("video", "ico\" style=\"width:36px;height:36px")}<b>Projeto de Bloco:</b>&nbsp;sempre apresentado ao vivo</div>`;
add("05a-trabalhos", h);

h = head("04", "writing", "Prova discursiva", "Em 2027 chega a <em>prova discursiva</em>");
["DR 1", "DR 2", "DR 3", "DR 4", "PB"].forEach((t, i) => { h += `<div class="sheet" style="left:${150 + i * 172}px;top:${330 + Math.abs(i - 2) * 16}px;transform:rotate(${(i - 2) * 6}deg)"><b>${t}</b><em${i === 4 ? ` style="background:${ACC}"` : ""}></em><u></u><u></u><u class="s"></u><u></u><u class="s"></u></div>`; });
h += `<div class="abs" style="left:136px;top:700px;display:flex;gap:14px"><span class="chip">${ic("user-check")}individual</span><span class="chip">${ic("copy")}uma para cada disciplina</span><span class="chip">${ic("stack-2")}5 provas por bloco</span></div>
<div class="chip y abs" style="left:136px;top:776px">${ic("video")}PRIMEIRO NA MODALIDADE LIVE</div>

<div class="g hi cal" style="left:1100px;top:290px;width:380px;height:420px">${ic("calendar")}<b>1</b><h3>ÚNICO DIA</h3><p>perto do fim do bloco</p></div>`;
add("05b-prova", h);

h = head("05", "robot", "Inteligência artificial", "Cada enunciado traz um <em>sinal</em>") + `<div class="tl" style="left:120px;top:286px;height:560px"><i style="top:40px;background:#3ddc84;box-shadow:0 0 60px #3ddc84"></i><i style="top:220px;background:#ffd23f;box-shadow:0 0 60px #ffd23f"></i><i style="top:400px;background:#ff5d5d;box-shadow:0 0 60px #ff5d5d"></i></div>`;
[["#3ddc84", "VERDE · pode usar IA", "dominar a IA é um dos objetivos daquele trabalho"], ["#ffd23f", "AMARELO · uso limitado", "só das formas específicas que o enunciado permitir"], ["#ff5d5d", "VERMELHO · não pode", "neste trabalho, a IA fica de fora"]].forEach((r, i) => { h += `<div class="g row" style="left:370px;top:${311 + i * 180}px;width:1110px;height:150px"><div class="bar" style="background:${r[0]}"></div><div><b>${r[1]}</b><span>${r[2]}</span></div></div>`; });
add("05c-ia", h);

add("06-conceitos", head("06", "stairs", "Conceitos", "Como você é <em>avaliado</em>") + `
<div class="g" style="left:96px;top:262px;width:640px;height:412px"></div><div class="cap abs" style="left:130px;top:288px">O resultado de cada competência</div>
<div class="cq nd" style="left:130px;top:336px"><b>ND</b><span>Não demonstrou</span><i>${ic("circle-x")}reprova</i></div>
<div class="ou" style="left:392px;top:430px">ou</div>
<div class="cq dd" style="left:446px;top:336px"><b>D</b><span>Demonstrou</span><i>${ic("circle-check")}aprova</i></div>
<div class="abs" style="left:130px;top:606px;width:580px;font-size:25px;color:var(--azul-gris)">Para aprovar: <b style="color:#fff;font-weight:800">D em todas</b> as competências.</div>
<div class="exc" style="left:776px;top:262px;width:704px;height:412px"><div class="rays"></div></div>
<div class="abs" style="left:812px;top:286px;display:flex;align-items:center;gap:12px;font-size:21px;font-weight:800;letter-spacing:.16em;color:${ACC}">${ic("stars", "ico\" style=\"width:30px;height:30px")}RECONHECIMENTO DE EXCELÊNCIA</div>
<div class="medal" style="left:852px;top:386px"><div class="ring2"><b>DL</b></div><span>Demonstrou<br>com Louvor</span></div>
<div class="medal mx" style="left:1150px;top:376px"><div class="crown">${ic("stars")}</div><div class="ring2"><b>DML</b></div><span>Demonstrou com<br>Máximo Louvor</span></div>
<div class="cap abs" style="left:96px;top:706px">O que pode limitar os seus conceitos</div>
<div class="g rule" style="left:96px;top:742px;width:677px;height:120px">${ic("clock")}<div><b>TP entregue com atraso</b><span>limita os conceitos das competências da disciplina</span></div></div>
<div class="g rule" style="left:803px;top:742px;width:677px;height:120px">${ic("writing")}<div><b>Prova discursiva</b><span>também pode limitar os conceitos</span></div></div>`);

const C = 2 * Math.PI * 150;
add("07-presenca", head("07", "user-check", "Presença", "Presença é <em>exigência</em> para aprovar") + `
<div class="rb" style="left:96px;top:276px"><svg viewBox="0 0 360 360"><circle cx="180" cy="180" r="150" class="bgc"/><circle cx="180" cy="180" r="150" class="fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * 0.25).toFixed(1)}" transform="rotate(-90 180 180)"/></svg><div class="rn"><b>75</b><i>%</i></div></div>
<div class="abs" style="left:96px;top:676px;width:380px;text-align:center;font-size:27px;color:var(--azul-gris)"><b style="display:block;font-size:34px;font-weight:800;color:#fff">de presença</b>em cada disciplina</div>
<div class="chip abs" style="left:82px;top:784px;font-size:21px">${ic("file-text")}já inclui faltas por motivo de saúde</div>
<div class="g mod" style="left:540px;top:290px;width:455px;height:460px">${ic("school")}<h3>PRESENCIAL</h3><p>A presença só conta se você estiver <b>em pessoa</b>, na sala de aula da faculdade.</p></div>
<div class="g mod" style="left:1025px;top:290px;width:455px;height:460px">${ic("video")}<h3>LIVE</h3><p>Conta se você assistir <b>ao vivo</b>.</p><span class="chip" style="margin-top:14px;align-self:flex-start;font-size:21px">${ic("camera")}câmera pode ser exigida</span></div>`);

add("08-sistemas", head("08", "device-laptop", "Sistemas", "O seu <em>dia a dia</em>") + `<svg class="ln"><path class="y" d="M340,520 C440,520 430,368 520,368"/><path d="M340,560 C440,560 430,640 520,640"/><path class="dash" d="M820,640 H850 M1150,640 H1180"/></svg>
<div class="acct" style="left:96px;top:416px">${ic("lock")}<b>SUA CONTA<br>DE ALUNO</b></div><div class="cap abs" style="left:46px;top:694px;width:350px;text-align:center;font-size:18px">Todos conectados a ela</div>
<div class="g hi sy main" style="left:520px;top:284px;width:960px;height:170px">${ic("message-circle")}<div><h3>Infnet.Online</h3><p>para se comunicar e estudar as Trilhas de Aprendizagem</p></div><div class="tagy">O PRINCIPAL</div></div>
<div class="g sy" style="left:520px;top:500px;width:300px;height:250px">${ic("file-upload")}<h3>Moodle</h3><p>para entregar os trabalhos</p></div>
<div class="g sy" style="left:850px;top:500px;width:300px;height:250px">${ic("video")}<h3>Aulas ao vivo</h3><p>o sistema das suas aulas</p></div>
<div class="g sy" style="left:1180px;top:500px;width:300px;height:250px">${ic("book")}<h3>O'Reilly</h3><p>a biblioteca online</p></div>`);

const nodes = [["presentation", "Professor", 150, 330, 410, 373], ["users", "Monitores", 150, 700, 400, 743], ["file-text", "Secretaria", 1030, 300, 1036, 343], ["rocket", "Central de Carreiras", 1060, 500, 1066, 543], ["brain", "Coaching e Psicopedagogia", 900, 716, 940, 730]];
h = head("09", "message-circle", "Apoio", "Precisou de <em>ajuda</em>?") + `<svg class="ln">` + nodes.map((n) => `<line class="y" x1="696" y1="530" x2="${n[4]}" y2="${n[5]}"/>`).join("") + `</svg><div class="me" style="left:596px;top:430px">${ic("user-check")}<b>VOCÊ</b></div>`;
nodes.forEach((n) => { h += `<div class="nd" style="left:${n[2]}px;top:${n[3]}px"><div class="n">${ic(n[0])}</div>${n[1]}</div>`; });
h += `<div class="chip abs" style="left:560px;top:250px">${ic("message-circle")}por chat, no Infnet.Online</div><div class="big2" style="left:96px;top:846px">AQUI, NINGUÉM FICA <em>SOZINHO</em></div>`;
add("09a-apoio", h);

add("09b-dedicacao", head("09", "clock", "Dedicação", "O curso é difícil e exige <em>dedicação</em>") + `
<div class="g stat one" style="left:96px;top:290px;width:910px;height:340px"><div class="lc"><p>cerca de</p><b>12<small>h</small></b></div><div><h3>de estudo<br>por semana</h3></div></div>
<div class="chip abs" style="left:96px;top:660px">${ic("clock")}além das aulas</div>
<div class="big2" style="left:96px;top:756px">ESTAMOS AQUI PARA <em>APOIAR VOCÊ</em></div><div class="abs" style="left:96px;top:824px;font-size:32px;color:var(--azul-gris)">e ver você se formar em alguns anos.</div>
${photo("left:1060px;top:270px;width:420px;height:420px;transform:rotate(2deg)", "colação de grau", "colacao.jpg")}`);

const steps = [["mail", "Acesse o Infnet.Online e leia os e-mails da sua conta de aluno", "todos os dias"], ["calendar-week", "Reserve na agenda as suas horas de estudo", "toda semana"], ["book-2", "Leia o Manual do Aluno", "para conhecer as regras e não atrasar a sua formatura por algum detalhe"]];
h = head("10", "rocket", "Primeiros passos", "Para <em>começar bem</em>");
steps.forEach((s, i) => { h += `<div class="g step" style="left:${96 + i * 472}px;top:290px;width:444px;height:450px"><div class="nn">${i + 1}</div>${ic(s[0])}<h3>${s[1]}</h3><p>${s[2]}</p></div>`; });
add("10-passos", h);

add("11-fecho", `<div class="bye" style="top:776px">BONS ESTUDOS E <em>BONS PROJETOS!</em></div>`, { narr: "big", nologo: true });

// ───────────── montagem animada
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const words = JSON.parse(fs.readFileSync("transcript.json", "utf8"));
const env = JSON.parse(fs.readFileSync("env.json", "utf8"));
const NM = JSON.parse(fs.readFileSync("narr_map.json", "utf8"));
const toks = []; for (const w of words) for (const p of norm(w.text).split(" ").filter(Boolean)) toks.push({ n: p, start: w.start, end: w.end });
const audioEnd = words[words.length - 1].end;
const find = (ph, from, to = toks.length) => { const pw = norm(ph).split(" "); for (let i = from; i <= to - pw.length; i++) { let ok = true; for (let j = 0; j < pw.length; j++) if (toks[i + j].n !== pw[j]) { ok = false; break; } if (ok) return i; } return -1; };
const STARTS = ["o mercado de trabalho", "e so existe", "ola eu sou", "em poucos minutos", "para voce aprender fazendo", "a graduacao e organizada", "durante as disciplinas", "em dois mil", "sobre inteligencia", "cada competencia e avaliada", "presenca nas aulas", "no dia a dia", "precisou de ajuda", "o curso e dificil", "para comecar bem", "o resto a gente"];
const S = []; let cur = 0;
STARTS.forEach((p, k) => { const i = find(p, cur); if (i < 0) throw new Error("cena não encontrada: " + p); S.push({ i, t0: k === 0 ? 0 : +(toks[i].start - 0.4).toFixed(2) }); cur = i + 1; });
const TOTAL = +(audioEnd + 3.8).toFixed(2);
S.forEach((s, k) => { s.lim = k < S.length - 1 ? S[k + 1].i : toks.length; s.t1 = k < S.length - 1 ? S[k + 1].t0 : TOTAL; });
const warn = [];
const T = (k, ph, lead = 0.12) => { const s = S[k]; if (typeof ph === "number") return +(s.t0 + ph).toFixed(2); const i = find(ph, s.i, s.lim); if (i < 0) { warn.push(`${F[k].name}: deixa não encontrada "${ph}"`); return s.t0 + 1; } return +Math.max(s.t0 + 0.15, toks[i].start - lead).toFixed(2); };

// deixas: [seletor(es) (@n = n-ésimo), frase ou segundos desde o início da cena, tipo, duração]
const CUES = {
  "01a-gancho": [[".ring", 0.1, "fade"], ['.h-s[style*="214"]', 0.15], [".h-b.dim", "o que voce decorou", "blur"], ['.h-s[style*="478"]', "mas o que"], ['.h-b.y[style*="548"]', "mas o que", "blur"], ['.h-b.y[style*="704"]', "consegue fazer", "blur"]],
  "01b-gancho": [[".h-s", 0.2], [".h-b.y", "fazendo", "blur"], ['.g, .cap.abs, .abs[style*="top:636px"]', "aqui todo semestre"], [".photo, .live", "apresenta ao vivo", "pop"], ['.chip.abs[style*="796"]', "igual ao que"], [".chip.y", "e assim que", "pop"]],
  "02a-boas-vindas": [[".whoami", "eu sou andre"]],
  "02b-trilha": [["svg.ln", 0.5, "fade"], ...stops.map((_, i) => [`.stop@${i}`, 0.9 + i * 0.4, "pop"])],
  "03-modelo": [[".mk@0", "aprendizado por competencias", "pop"], [".plus", "e o desenvolvimento", "pop"], [".mk@1", "desenvolvimento de projetos", "pop"], ["svg.ln", 0, "none"], ["svg.ln path", "criando desafios", "draw"], [".mr", "criando desafios", "blur"], ['.g[style*="left:800px"], .cap.abs, .vbar', "em cada disciplina"], [".flow@0", "voce desenvolve as competencias", "left"], [".flow@1", "em exercicios praticos", "left"], [".flow@2", "e e aprovado", "left"]],
  "04-bloco": [[".tri", "dois trimestres"], [".dr", "quatro disciplinas regulares", "pop"], [".t2", "duas vezes por semana"], [".pb", "um projeto de bloco", "pop"], ['.cap.abs[style*="770"]', "encontro semanal"], ['.g.hi, .photo, .cap.abs[style*="572"], .abs[style*="top:604px"], .abs[style*="top:664px"]', "o seu primeiro bloco"]],
  "05a-trabalhos": [['.cap.abs[style*="262"]', "testes de performance"], [".cnt@0", "tres em cada", "pop"], [".cnt@1", "cinco na disciplina", "pop"], [".chip.r", "a entrega e obrigatoria", "pop"], ['.cap.abs[style*="566"], .cap.abs[style*="722"]', "no fim da disciplina"], [".wk", "vem o assessment", "pop", 0.3], [".flag:not(.y)", "nona semana", "pop"], [".flag.y", "na decima", "pop"], ['.chip.abs[style*="800"]', "ja o projeto"]],
  "05b-prova": [[".chip.y", "primeiro na modalidade", "pop"], [".sheet", "uma prova individual", "pop"], ['.abs[style*="top:700px"] .chip@0', "prova individual"], ['.abs[style*="top:700px"] .chip@1', "para cada disciplina"], ['.abs[style*="top:700px"] .chip@2', "as cinco provas"], [".cal", "um unico dia", "pop"]],
  "05c-ia": [[".tl i", 0, "dim"], [".tl i@0", "verde pode", "light"], [".row@0", "verde pode", "left"], [".tl i@1", "amarelo so", "light"], [".row@1", "amarelo so", "left"], [".tl i@2", "vermelho nao", "light"], [".row@2", "vermelho nao", "left"]],
  "06-conceitos": [[".cq.dd", "como demonstrada", "pop"], [".ou", "ou nao demonstrada", "fade"], [".cq.nd", "ou nao demonstrada", "pop"], ['.abs[style*="top:606px"]', "para obter a aprovacao"], [".cq.dd", "com conceito de", "pulse"], ['.exc, .abs[style*="top:286px"]', "alguns alunos"], [".medal:not(.mx)", "d l demonstrou", "pop"], [".medal.mx", "d m l demonstrou", "pop"], ['.cap.abs[style*="706"], .rule@0', "e prazo conta"], [".rule@1", "a prova discursiva tambem"]],
  "07-presenca": [['.rb, .abs[style*="top:676px"]', "setenta e cinco", "pop"], [".rb .fg", "setenta e cinco", "ring", 1.2], [".chip.abs", "esse limite"], [".mod@0", "na modalidade presencial"], [".mod@1", "na live"], [".mod .chip", "a camera ligada", "pop"]],
  "08-sistemas": [[".acct", 0.5, "pop"], [".cap.abs", "conectados"], ["svg.ln", "o principal", "fade"], [".sy@0", "o principal"], [".sy@1", "o moodle", "pop"], [".sy@2", "tem tambem", "pop"], [".sy@3", "a biblioteca", "pop"]],
  "09a-apoio": [[".me", 0.4, "pop"], ["svg.ln", 0, "none"], ["svg.ln line@0", "seu professor", "draw"], [".nd@0", "seu professor", "pop"], ["svg.ln line@1", "os monitores", "draw"], [".nd@1", "os monitores", "pop"], [".chip.abs", "pelo infnet"], ["svg.ln line@2", "a secretaria", "draw"], [".nd@2", "a secretaria", "pop"], ["svg.ln line@3", "central de carreiras", "draw"], [".nd@3", "central de carreiras", "pop"], ["svg.ln line@4", "central de coaching", "draw"], [".nd@4", "central de coaching", "pop"], [".big2", "aqui ninguem", "blur"], [".me", "aqui ninguem", "pulse"]],
  "09b-dedicacao": [[".stat", "doze horas", "pop"], [".chip.abs", "alem das aulas"], [".big2", "mas estamos aqui", "blur"], ['.abs[style*="top:824px"]', "e ver voce"], [".photo", "se formar", "pop"]],
  "10-passos": [[".step@0", "um acesse"], [".step@1", "dois reserve"], [".step@2", "tres leia"]],
  "11-fecho": [[".bye", "bons estudos", "blur"]],
};
const SC = F.map((f, k) => ({ id: "q" + k, t0: S[k].t0, t1: S[k].t1, cues: (CUES[f.name] || []).map((c) => [c[0], T(k, c[1], c[2] === "pop" ? 0.2 : 0.12), c[2] || "up", c[3] || 0]) }));
const logo = VAR === "ecdd" ? "ecdd-horizontal-branco.png" : "horizontal-negativo.png";
const f2 = (t) => (+t).toFixed(2);
let body = "";
F.forEach((f, i) => {
  const s = S[i], dur = Math.min(TOTAL - s.t0, s.t1 - s.t0 + (i < F.length - 1 ? 0.55 : 0));
  body += `<section class="sc clip" id="q${i}" data-start="${f2(s.t0)}" data-duration="${f2(dur)}" data-track-index="${i + 1}"><div class="bg2"><div class="a1"></div><div class="a2"></div><div class="a3"></div><div class="orb"></div><div class="orb o2"></div><div class="grain"></div></div><div class="ct">${f.html}`;
  if (f.name === "11-fecho") body += `<img class="endlogo" id="endlogo" src="assets/logos/${VAR === "ecdd" ? "ecdd-horizontal-branco.png" : "vertical-negativo.png"}" alt="" />`;
  body += `</div></section>\n`;
});
// narrador e camada fixa
const tNarrIn = S[2].t0 + 0.35, tCorner = S[3].t0, tBig = S[15].t0 + 0.1, tOut = +(audioEnd + 0.45).toFixed(2);
const an = [];
an.push(`tl.set("#narr",{opacity:0,x:-750,y:-450,scale:2},0);`);
an.push(`tl.fromTo("#narr",{opacity:0,scale:1.55},{opacity:1,scale:2,duration:0.7,ease:"back.out(1.4)"},${f2(tNarrIn)});`);
an.push(`tl.to("#narr",{x:0,y:0,scale:1,duration:0.95,ease:"power3.inOut"},${f2(tCorner)});`);
an.push(`tl.to("#narr",{x:-750,y:-450,scale:2,duration:0.95,ease:"power3.inOut"},${f2(tBig)});`);
an.push(`tl.to("#narr",{opacity:0,scale:1.7,duration:0.5,ease:"power2.in"},${f2(tOut)});`);
an.push(`tl.to("#q15 .bye",{opacity:0,y:-20,duration:0.4,ease:"power2.in"},${f2(tOut)});`);
an.push(`tl.fromTo("#endlogo",{opacity:0,scale:0.88},{opacity:1,scale:1,duration:1.1,ease:"power3.out"},${f2(tOut + 0.45)});`);
an.push(`tl.fromTo("#fixed",{opacity:0},{opacity:1,duration:0.6},${f2(tCorner + 0.4)});`);
an.push(`tl.to("#fixed",{opacity:0,duration:0.5},${f2(tBig)});`);
an.push(`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${f2(audioEnd)},ease:"none"},0);`);
let last = -1;
env.forEach((v, i) => { const t = i / 10; if (t < tNarrIn || t > audioEnd) return; const g = +(0.3 + 0.7 * v).toFixed(2); if (g === last) return; last = g; an.push(`tl.to("#narr-gl",{opacity:${g},scale:${(1 + 0.06 * v).toFixed(3)},duration:0.1,ease:"none"},${t.toFixed(1)});`); });
NM.segs.slice(1).forEach((sg) => an.push(`tl.fromTo("#narr-in",{scale:0.93},{scale:1,duration:0.35,ease:"back.out(2.2)"},${f2(sg.start)});`));
S.slice(1).forEach((s, k) => { if (k + 1 === 2) return; an.push(`tl.fromTo("#swipe",{x:-2500},{x:2500,duration:0.8,ease:"power2.inOut"},${f2(s.t0 - 0.2)});`); });
const NSRC = fs.existsSync("assets/narrador-lipsync.mp4") ? "assets/narrador-lipsync.mp4" : "assets/narrador.mp4";
const ndur = Math.min(NM.segs[NM.segs.length - 1].end - NM.S + 1.45, TOTAL - NM.S);
const css = fs.readFileSync("style.css", "utf8") + fs.readFileSync("tema.css", "utf8").replaceAll("__ACC__", ACC) + `
#narr{z-index:40}.narr .in video{width:100%;height:100%;object-fit:cover;transform:scale(1.14) translateX(3%)}
#fixed{position:absolute;inset:0;z-index:30;pointer-events:none}#prog{width:1920px;transform-origin:0 50%}
#swipe{position:absolute;z-index:35;left:760px;top:-300px;width:400px;height:1700px;transform:rotate(18deg);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.10) 40%,${ACC}55 50%,rgba(255,255,255,.10) 60%,rgba(255,255,255,0));filter:blur(18px)}
.swrap{position:absolute;inset:0;overflow:hidden;z-index:35;pointer-events:none}
.ct{position:absolute;inset:0}.endlogo{position:absolute;left:660px;top:240px;width:600px;opacity:0}`;
fs.writeFileSync("index.html", `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" /><script src="assets/gsap.min.js"></script><style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${f2(TOTAL)}" data-width="1920" data-height="1080" data-fps="30">
${body}<div id="fixed"><img class="logo2" src="assets/logos/${logo}" alt="" /><div class="prog" id="prog"></div></div>
<div class="swrap"><div id="swipe"></div></div>
<div id="narr" class="narr"><div class="gl" id="narr-gl"></div><div class="in" id="narr-in"><video id="narr-v" class="clip" src="${NSRC}" muted playsinline data-start="${f2(NM.S)}" data-duration="${f2(ndur)}" data-track-index="40"></video></div></div>
<audio id="narracao" src="assets/audio/narracao.mp3" data-start="0" data-duration="${f2(audioEnd)}" data-track-index="41"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.to({}, { duration: ${f2(TOTAL)} }, 0);
tl.set("#swipe",{x:-2500},0);
const SC = ${JSON.stringify(SC)};
function anim(el, t, kind, d) {
  const sc = +gsap.getProperty(el, "scale") || 1;
  if (kind === "none") return;
  if (kind === "pop") tl.fromTo(el, { opacity: 0, scale: sc * 0.7 }, { opacity: 1, scale: sc, duration: d || 0.5, ease: "back.out(1.8)" }, t);
  else if (kind === "left") tl.fromTo(el, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: d || 0.6, ease: "power3.out" }, t);
  else if (kind === "fade") tl.fromTo(el, { opacity: 0 }, { opacity: +getComputedStyle(el).opacity || 1, duration: d || 0.8, ease: "power2.out" }, t);
  else if (kind === "blur") tl.fromTo(el, { opacity: 0, scale: sc * 1.18, filter: "blur(16px)" }, { opacity: 1, scale: sc, filter: "blur(0px)", duration: d || 0.55, ease: "power3.out" }, t);
  else if (kind === "dim") tl.set(el, { opacity: 0.14 }, 0);
  else if (kind === "light") tl.to(el, { opacity: 1, duration: 0.3, ease: "power2.out" }, t).fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" }, t);
  else if (kind === "pulse") tl.to(el, { scale: sc * 1.1, duration: 0.28, yoyo: true, repeat: 1, ease: "power2.inOut" }, t);
  else if (kind === "ring") { const end = +el.getAttribute("stroke-dashoffset"), full = parseFloat(el.getAttribute("stroke-dasharray")); tl.fromTo(el, { attr: { "stroke-dashoffset": full } }, { attr: { "stroke-dashoffset": end }, duration: d || 1.2, ease: "power2.inOut" }, t); }
  else if (kind === "draw") { const len = el.getTotalLength(); el.style.strokeDasharray = len; tl.fromTo(el, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d || 0.45, ease: "power2.out" }, t); }
  else tl.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: d || 0.55, ease: "power3.out" }, t);
}
SC.forEach((s, i) => {
  const sec = document.getElementById(s.id), dur = s.t1 - s.t0 + 0.55;
  if (i > 0) tl.fromTo(sec, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, s.t0);
  tl.fromTo(sec.querySelector(".orb"), { rotation: 0, scale: 1 }, { rotation: 10, scale: 1.06, duration: dur, ease: "none" }, s.t0);
  tl.fromTo(sec.querySelector(".a1"), { x: 0, y: 0 }, { x: -140, y: 70, duration: dur, ease: "none" }, s.t0);
  tl.fromTo(sec.querySelector(".a2"), { x: 0, y: 0 }, { x: 120, y: -50, duration: dur, ease: "none" }, s.t0);
  const ct = sec.querySelector(".ct");
  if (i < SC.length - 1) tl.to(ct, { opacity: 0, x: -50, duration: 0.3, ease: "power2.in" }, s.t1 - 0.3);
  const used = new Set();
  const pick = (spec) => spec.split(",").flatMap((p) => { p = p.trim(); const m = p.match(/^(.*)@(\\d+)$/); const l = [...sec.querySelectorAll(m ? m[1] : p)]; return m ? (l[+m[2]] ? [l[+m[2]]] : []) : l; });
  s.cues.forEach(([sel, t, kind, d]) => { const els = pick(sel); if (!els.length) console.warn("sem elemento:", s.id, sel); const st = kind === "pop" && els.length > 6 ? 0.045 : 0.08; els.forEach((el, j) => { used.add(el); anim(el, t + j * st, kind, d); }); });
  let j = 0;
  [...ct.children].forEach((el) => { if (el.id === "endlogo" || used.has(el)) return; const t = s.t0 + 0.35 + Math.min(j, 8) * 0.08; j++; anim(el, t, el.classList.contains("ttl") ? "left" : el.classList.contains("wm") ? "fade" : "up"); });
  sec.querySelectorAll(".photo img").forEach((im) => tl.fromTo(im, { scale: 1.14 }, { scale: 1.0, duration: dur, ease: "none" }, s.t0));
});
${an.join("\n")}
window.__timelines = window.__timelines || {}; window.__timelines["main"] = tl; tl.seek(0);
</script></body></html>`);
fs.writeFileSync("timing.json", JSON.stringify({ total: TOTAL, audio: audioEnd, scenes: F.map((f, k) => ({ nome: f.name, start: S[k].t0, end: S[k].t1 })) }, null, 1));
console.log(`index.html: ${F.length} cenas, total ${TOTAL}s`); F.forEach((f, k) => console.log(`  ${f.name}: ${S[k].t0} → ${S[k].t1}`)); warn.forEach((w) => console.log("  ! " + w));
