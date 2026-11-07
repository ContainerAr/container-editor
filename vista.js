// Páginas de la revista dentro del editor, editables encima de la página.
// Es la misma maqueta que usa el generador (revista/generador/plantillas.py en container-notas):
// mismas medidas en pt, mismas tipografías y el mismo ajuste de texto. Si se cambia allá, hay que cambiarlo acá.
(function () {
  const ROJO = "#FB000E", GRIS_FONDO = "#ececec", GRIS_TEXTO = "#a8a8a8";
  const R = new URL("recursos/", document.baseURI).href;
  const esc = (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lineas = (t) => String(t || "").split("\n").map(esc).join("<br>");

  function cssBase(w = 1080, h = 1920) {
    return `
@font-face { font-family: 'Oswald'; src: url('${R}Oswald-400.ttf'); font-weight: 400; }
@font-face { font-family: 'Oswald'; src: url('${R}Oswald-600.ttf'); font-weight: 600; }
@font-face { font-family: 'Oswald'; src: url('${R}Oswald-700.ttf'); font-weight: 700; }
@font-face { font-family: 'Roboto'; src: url('${R}Roboto-300.ttf'); font-weight: 300; }
@font-face { font-family: 'Roboto'; src: url('${R}Roboto-900.ttf'); font-weight: 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${w}pt; height: ${h}pt; background: #fff; overflow: hidden; }
body { position: relative; font-kerning: normal; -webkit-font-smoothing: antialiased; }
.abs { position: absolute; }
.oswald { font-family: 'Oswald'; }
.roboto { font-family: 'Roboto'; }
/* solo en el editor: lo que se puede tocar y escribir */
[data-edit] { cursor: text; outline: none; }
[data-edit]:hover { outline: 3pt dashed rgba(251,0,14,.55); outline-offset: 8pt; }
[data-edit]:focus { outline: 5pt solid ${ROJO}; outline-offset: 8pt; }
[data-edit]:empty::before { content: attr(data-ph); opacity: .45; }
[data-edit].oscuro:empty::before { opacity: .7; }`;
  }
  const doc = (css, cuerpo, w, h) => `<!doctype html><html><head><meta charset="utf-8"><style>${cssBase(w, h)}${css || ""}</style></head><body>${cuerpo}</body></html>`;

  function caja(left, top, w, h, texto, size = 44) {
    return `<div class="abs oswald" style="left:${left}pt;top:${top}pt;width:${w}pt;height:${h}pt;background:${GRIS_FONDO};border:4pt dashed #cfcfcf;display:flex;align-items:center;justify-content:center;text-align:center;color:${GRIS_TEXTO};font-size:${size}pt;font-weight:600;line-height:1.2;padding:0 40pt;"><div>${texto}</div></div>`;
  }
  function barras(top, n, ultima = 0.55, ancho = 964, paso = 56, alto = 24) {
    let s = "";
    for (let i = 0; i < n; i++) s += `<div class="abs" style="left:63pt;top:${top + i * paso + 16}pt;width:${ancho * (i === n - 1 ? ultima : 1)}pt;height:${alto}pt;background:${GRIS_FONDO};"></div>`;
    return s;
  }
  const boton = () => `
<div class="abs" style="left:63pt;top:1765pt;width:954pt;height:2pt;background:${ROJO};"></div>
<div class="abs oswald" style="left:300pt;width:364pt;top:1707pt;height:62pt;font-size:32pt;font-weight:600;color:${ROJO};letter-spacing:-0.02em;text-align:right;line-height:62pt;">TOCÁ ACÁ PARA</div>
<div class="abs oswald" style="left:671pt;top:1711pt;width:346pt;height:56pt;background:${ROJO};color:#fff;font-size:32pt;font-weight:600;line-height:60pt;letter-spacing:-0.02em;padding-left:9pt;white-space:nowrap;">CONTINUAR LEYENDO...</div>
<div class="abs" style="left:972pt;top:1725pt;width:28pt;height:28pt;border-radius:50%;background:#fff;"></div>
<svg class="abs" style="left:972pt;top:1725pt;width:28pt;height:28pt;" viewBox="0 0 28 28"><path d="M10.2 8.6 L18.6 14 L10.2 19.4" fill="none" stroke="${ROJO}" stroke-width="3.6" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;

  // n: { titulo, bajada: [párrafos], foto (url), autor: {nombre, cargo, foto} | null, titulo_provisorio, bajada_provisoria, encuadre }
  function nota(n) {
    const conAutor = !!n.autor, topBody = conAutor ? 1128 : 1038, altoBody = 1693 - topBody;
    let autor = "";
    if (conAutor) {
      const f = n.autor.foto ? `<img src="${esc(n.autor.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:center top;">` : "";
      autor = `
<div class="abs" style="left:63pt;top:995pt;width:75pt;height:77pt;border:0.5pt solid #c5c5c5;background:#fff;overflow:hidden;">${f}</div>
<div class="abs roboto" style="left:164pt;top:996pt;font-size:32pt;line-height:38pt;color:#000;">
  <div style="font-weight:900;min-width:300pt;" data-edit="autor" data-ph="Firma">${esc(n.autor.nombre)}</div><div style="font-weight:300;">${esc(n.autor.cargo)}</div>
</div>`;
    }
    const foto = n.foto ? `<img src="${esc(n.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(n.encuadre || "center center")};">` : "";
    const parr = (n.bajada || []).map((p) => `<p>${esc(p)}</p>`).join("");
    return doc(".body p { margin: 0; } .body p + p { margin-top: 39pt; }", `
<div id="foto-nota" class="abs" style="left:0;top:0;width:1080pt;height:642pt;background:#797979;overflow:hidden;">${foto}</div>
<div class="abs oswald" data-fit="titulo" data-min="80" data-lh="1.3" data-edit="titulo" data-ph="Escribí el título"
     style="left:63pt;top:681pt;width:975pt;height:215pt;font-size:80pt;line-height:104pt;font-weight:400;color:${n.titulo_provisorio ? ROJO : "#000"};letter-spacing:-0.015em;text-wrap:balance;overflow:hidden;">${lineas(n.titulo)}</div>
<div class="abs" style="left:63pt;top:959.5pt;width:954pt;height:1pt;background:#000;"></div>
${autor}
<div class="abs roboto body" data-fit="bajada" data-min="33" data-lh="1.366" data-edit="bajada" data-ph="Escribí la bajada"
     style="left:63pt;top:${topBody}pt;width:964pt;height:${altoBody}pt;font-size:41pt;line-height:56pt;font-weight:300;color:${n.bajada_provisoria ? ROJO : "#000"};letter-spacing:-0.04em;text-align:justify;hyphens:manual;overflow:hidden;">${parr}</div>
${boton()}`);
  }

  function notaPendiente(etiqueta) {
    return doc("", `${caja(0, 0, 1080, 642, "FOTO")}
<div class="abs oswald" style="left:63pt;top:681pt;width:975pt;height:215pt;font-size:80pt;line-height:104pt;color:${GRIS_TEXTO};letter-spacing:-0.015em;">Nota pendiente<br><span style="font-size:56pt;">${esc(etiqueta)}</span></div>
<div class="abs" style="left:63pt;top:959.5pt;width:954pt;height:1pt;background:#ccc;"></div>
${barras(1038, 10)}
<div class="abs" style="left:63pt;top:1765pt;width:954pt;height:2pt;background:#d0d0d0;"></div>
<div class="abs" style="left:671pt;top:1711pt;width:346pt;height:56pt;background:#d0d0d0;"></div>`);
  }

  // t: { titulo, volanta, bajada, imagen (url), ancho, alto (px de la imagen), zoom, y, encuadre, interlineado }
  function tapa(t) {
    let imagen = t.imagen ? `<img src="${esc(t.imagen)}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(t.encuadre || "center top")};">`
                          : caja(0, 0, 1080, 1059, "ILUSTRACIÓN DE TAPA<br>PENDIENTE", 60);
    if (t.imagen && (t.zoom || t.y) && t.ancho) {
      const z = parseFloat(t.zoom) || 1, W = 1080 * z, H = W * t.alto / t.ancho, y = parseFloat(t.y) || 0;
      if (y > 0) {
        // igual que el generador: arriba la misma imagen desenfocada y oscurecida, y la ilustración fundida encima
        const Hf = 1080 * t.alto / t.ancho;
        imagen = `<img src="${esc(t.imagen)}" style="position:absolute;left:0;top:0;width:1080pt;height:${Hf}pt;filter:blur(40pt) brightness(.8);transform:scale(1.15);transform-origin:top center;">
<img src="${esc(t.imagen)}" style="position:absolute;width:${W}pt;height:${H}pt;left:${(1080 - W) / 2}pt;top:${y}pt;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 120pt);mask-image:linear-gradient(to bottom,transparent 0,#000 120pt);">`;
      } else {
        const top = Math.min(0, Math.max(1059 - H, y));
        imagen = `<img src="${esc(t.imagen)}" style="position:absolute;width:${W}pt;height:${H}pt;left:${(1080 - W) / 2}pt;top:${top}pt;">`;
      }
    }
    const stops = [255, 254, 249, 240, 227, 208, 187, 159, 127, 90, 50, 4, 0];
    const grad = stops.map((v, i) => `rgba(6,5,6,${(0.6 * v / 255).toFixed(3)}) ${i * 40}pt`).join(", ");
    return doc("", `
<div class="abs" style="left:0;top:0;width:1080pt;height:1059pt;overflow:hidden;background:#ececec;">${imagen}</div>
<div class="abs" style="left:0;top:0;width:1080pt;height:493pt;background:linear-gradient(to bottom, ${grad});"></div>
<div class="abs oswald oscuro" data-fit="titulo_tapa" data-min="70" data-lh="1.143" data-edit="titulo" data-ph="TÍTULO DE TAPA"
     style="right:63pt;top:86pt;width:954pt;height:330pt;font-size:91pt;line-height:104pt;font-weight:700;color:#fff;text-align:right;overflow:hidden;">${lineas(t.titulo)}</div>
<div class="abs" style="left:63pt;top:1190pt;width:954pt;height:2pt;background:${ROJO};"></div>
<div class="abs oswald oscuro" data-edit="volanta" data-ph="VOLANTA" style="left:63pt;top:1128pt;height:62pt;min-width:200pt;padding:0 15pt;background:${ROJO};color:#fff;font-size:41pt;font-weight:600;line-height:62pt;text-transform:uppercase;white-space:nowrap;">${esc(t.volanta)}</div>
<div class="abs roboto" data-fit="bajada_tapa" data-min="32" data-lh="1.2" data-edit="bajada" data-ph="Escribí la bajada de tapa"
     style="left:63pt;top:1228pt;width:954pt;height:300pt;font-size:41pt;line-height:${t.interlineado || 60}pt;font-weight:300;color:#000;letter-spacing:-0.055em;text-align:center;overflow:hidden;">${esc(t.bajada)}</div>
<img class="abs" src="${R}bloque-tapa.png" style="left:0;top:1564pt;width:1080pt;height:356pt;">`);
  }

  // Igual que leer_secretaria() del generador: título, diálogos con guion, negrita para el que habla menos
  function leerSecretaria(texto, opciones = {}) {
    let titulo = opciones.titulo || "";
    const ls = String(texto || "").trim().split("\n").map((l) => l.trim()).filter(Boolean);
    const esDialogo = (l) => /^[–\-—]/.test(l.replace(/^\*+/, ""));
    if (ls.length && !esDialogo(ls[0])) { const t0 = ls.shift(); titulo = titulo || t0; }
    const parl = [];
    for (const l of ls) { if (esDialogo(l) || !parl.length) parl.push(l); else parl[parl.length - 1] += " " + l; }
    return { titulo, parrafos: negritas(parl, opciones) };
  }
  function negritas(parl, opciones = {}) {
    let parrafos;
    if (parl.some((l) => l.startsWith("*"))) parrafos = parl.map((l) => [l.replace(/^\*+/, ""), l.startsWith("*")]);
    else {
      const len = (k) => parl.filter((_, i) => i % 2 === k).reduce((s, l) => s + l.length, 0);
      const primero = opciones.negrita_primero !== undefined ? !!opciones.negrita_primero : len(0) <= len(1);
      parrafos = parl.map((l, i) => [l, (i % 2 === 0) === primero]);
    }
    return parrafos.map(([t, b]) => [t.replace(/^[-—]\s*/, "–"), b]);
  }

  function secretaria(s) {
    const parr = (s.parrafos || []).map(([t, b]) => `<p style="font-weight:${b ? 900 : 300};">${esc(t)}</p>`).join("");
    return doc("", `
<div class="abs" style="left:0;top:146pt;width:1080pt;height:72pt;display:flex;justify-content:center;align-items:flex-end;gap:14pt;">
  <img src="${R}Secretaria.svg" style="height:69pt;">
  <div class="oswald" style="background:${ROJO};color:#fff;font-size:32pt;font-weight:600;height:57pt;line-height:57pt;padding:0 14pt;letter-spacing:-0.019em;white-space:nowrap;">LA SECRETARIA Y EL CADETE</div>
  <img src="${R}Cadete.svg" style="height:69pt;">
</div>
<div class="abs oswald" data-fit="titulo_secre" data-min="60" data-lh="1.3" data-edit="titulo" data-ph="Título"
     style="left:40pt;top:242pt;width:1000pt;height:130pt;font-size:85pt;line-height:120pt;letter-spacing:-0.018em;font-weight:400;color:#000;text-align:center;text-wrap:balance;overflow:hidden;">${esc(s.titulo)}</div>
<div class="abs" style="left:63pt;top:396.5pt;width:954pt;height:1pt;background:#000;"></div>
<div class="abs roboto" data-fit="dialogo" data-min="30" data-lh="1.436" data-edit="dialogo" data-ph="–Pegá o escribí el diálogo, un parlamento por renglón."
     style="left:63pt;top:435pt;width:964pt;height:1350pt;font-size:39pt;line-height:56pt;color:#000;text-align:justify;overflow:hidden;">${parr}</div>`);
  }

  // Página de aviso: la imagen tal cual (los PDF se muestran como una caja con el nombre)
  function aviso(a) {
    const alto = a.alto || 1528;
    const cuerpo = a.imagen ? `<img src="${esc(a.imagen)}" style="position:absolute;left:0;top:0;width:1080pt;height:${alto}pt;">`
                            : caja(0, 0, 1080, alto, (a.pendiente ? "AVISO PENDIENTE<br>" : "AVISO<br>") + `<span style="font-size:60pt;">${esc(a.nombre)}</span>`, 80);
    return doc("", cuerpo, 1080, alto);
  }

  // Mismo ajuste que FIT_JS del generador: achica lo que no entra y avisa. Se puede volver a correr mientras se escribe.
  async function ajustar(d) {
    const w = d.defaultView;
    await d.fonts.ready;
    await Promise.all([...d.images].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
    const out = [], r2 = (x) => Math.round(x * 2) / 2;
    for (const el of d.querySelectorAll("[data-fit]")) {
      if (el.dataset.fs0 === undefined) { el.dataset.fs0 = el.style.fontSize; el.dataset.lh0 = el.style.lineHeight; }
      el.style.fontSize = el.dataset.fs0; el.style.lineHeight = el.dataset.lh0;
      const min = parseFloat(el.dataset.min || "30"), lhRatio = parseFloat(el.dataset.lh || "0");
      let size = parseFloat(w.getComputedStyle(el).fontSize) * 0.75;
      const orig = size, entra = () => el.scrollHeight <= el.clientHeight + 1;
      while (!entra() && size > min) { size -= 0.5; el.style.fontSize = size + "pt"; if (lhRatio) el.style.lineHeight = (size * lhRatio) + "pt"; }
      const lh = parseFloat(w.getComputedStyle(el).lineHeight) * 0.75;
      out.push({ id: el.dataset.fit, original: r2(orig), final: r2(size), entra: entra(), lineas: Math.round(el.scrollHeight * 0.75 / lh), vacio: !el.textContent.trim() });
    }
    // Título de una línea: baja a la segunda línea y la foto se agranda para cubrir el hueco (como el generador)
    const t = d.querySelector('[data-fit="titulo"]'), f = d.getElementById("foto-nota");
    if (t && f) {
      if (t.dataset.top0 === undefined) { t.dataset.top0 = t.style.top; f.dataset.h0 = f.style.height; }
      t.style.top = t.dataset.top0; f.style.height = f.dataset.h0;
      if (t.textContent.trim()) {
        const rg = d.createRange(); rg.selectNodeContents(t);
        const tops = new Set([...rg.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
        if (tops.size === 1) {
          const lh = parseFloat(w.getComputedStyle(t).lineHeight) * 0.75;
          t.style.top = (parseFloat(t.style.top) + lh) + "pt";
          f.style.height = (parseFloat(f.style.height) + lh) + "pt";
          const o = out.find((a) => a.id === "titulo"); if (o) o.una_linea = true;
        }
      }
    }
    return out;
  }

  // Lee lo escrito en un campo de la página
  function leerCampo(el) {
    const tipo = el.dataset.edit;
    if (tipo === "volanta" || tipo === "autor") return el.textContent.replace(/\s+/g, " ").trim();
    const txt = el.innerText.replace(/ /g, " ").replace(/\r/g, "");
    if (tipo === "titulo") return txt.split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
    const ps = txt.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    return tipo === "dialogo" ? ps.join("\n") : ps.join("\n\n");
  }

  // Hace editable la página: escribir directo encima, con el ajuste de texto en vivo
  function conectar(d, alEditar, alAjustar) {
    for (const el of d.querySelectorAll("[data-edit]")) {
      el.contentEditable = "true"; el.spellcheck = true;
      const tipo = el.dataset.edit, unaLinea = tipo === "volanta" || tipo === "autor";
      el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        if (unaLinea) { e.preventDefault(); el.blur(); return; }
        if (tipo === "titulo") { e.preventDefault(); d.execCommand("insertLineBreak"); }
      });
      el.addEventListener("paste", (e) => {
        e.preventDefault();
        let t = (e.clipboardData || window.clipboardData).getData("text/plain") || "";
        if (unaLinea) t = t.replace(/\s+/g, " ");
        d.execCommand("insertText", false, t);
      });
      let timer = null;
      el.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          if (tipo === "dialogo") {
            // negritas en vivo: el que habla menos
            const ps = [...el.querySelectorAll("p")];
            const parl = ps.map((p) => p.textContent.trim());
            if (ps.length > 1 && parl.every(Boolean)) negritas(parl).forEach(([, b], i) => { ps[i].style.fontWeight = b ? 900 : 300; });
          }
          alEditar(tipo, leerCampo(el), el);
          alAjustar(await ajustar(d));
        }, 120);
      });
    }
  }

  // Una "hoja": la página escalada al ancho disponible. Dos iframes que se alternan para que no parpadee.
  function crearHoja(alto = 1920, opciones = {}) {
    const caja = document.createElement("div"); caja.className = "hoja";
    const marcos = [0, 1].map(() => {
      const f = document.createElement("iframe");
      f.setAttribute("scrolling", "no"); f.title = "Página";
      caja.append(f); return f;
    });
    marcos[1].style.visibility = "hidden";
    let frente = 0, turno = 0, timer = null, pendiente = null, altoAct = alto;
    const escalar = () => {
      const s = caja.clientWidth / 1440;
      caja.style.aspectRatio = "1080 / " + altoAct;
      marcos.forEach((f) => { f.style.width = "1440px"; f.style.height = (altoAct * 4 / 3) + "px"; f.style.transform = "scale(" + s + ")"; });
    };
    new ResizeObserver(escalar).observe(caja);
    escalar();
    const escribiendo = () => { try { const d = marcos[frente].contentDocument; return d && d.hasFocus() && d.activeElement && d.activeElement.dataset && d.activeElement.dataset.edit; } catch (e) { return false; } };
    caja.mostrar = (html, alListo, nuevoAlto) => {
      clearTimeout(timer);
      if (nuevoAlto && nuevoAlto !== altoAct) { altoAct = nuevoAlto; escalar(); }
      pendiente = [html, alListo];
      const intentar = () => {
        if (!pendiente) return;
        if (escribiendo()) { timer = setTimeout(intentar, 400); return; }   // no se repinta mientras escribís
        const [h, cb] = pendiente; pendiente = null;
        const mio = ++turno, atras = marcos[1 - frente];
        atras.onload = async () => {
          let res = [];
          const d = atras.contentDocument;
          try { res = await ajustar(d); } catch (e) {}
          if (mio !== turno) return;
          if (opciones.alEditar) conectar(d, opciones.alEditar, (r) => opciones.alAjustar && opciones.alAjustar(r));
          atras.style.visibility = "visible"; marcos[frente].style.visibility = "hidden"; frente = 1 - frente;
          if (cb) cb(res, d);
        };
        atras.srcdoc = h;
      };
      timer = setTimeout(intentar, 150);
    };
    return caja;
  }

  window.Vista = { nota, notaPendiente, tapa, secretaria, aviso, leerSecretaria, crearHoja };
})();
