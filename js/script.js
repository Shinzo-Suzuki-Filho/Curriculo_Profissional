document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os links dentro da seção de perfis
  const perfilLinks = document.querySelectorAll(".perfis a");

  // Carrega contadores do localStorage
  const STORAGE_KEY = "curriculo_link_counters_v1";
  const counters = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  // Helper: salva contadores
  function saveCounters() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
  }

  // Exibe badge temporário próximo ao link com a contagem
  function showBadge(link, count) {
    // Remove badge antigo se existir
    const existing = link.querySelector(".click-badge");
    if (existing) existing.remove();

    const badge = document.createElement("span");
    badge.className = "click-badge";
    badge.textContent = count;
    // Estilos inline leves — CSS pode ser ajustado no style.css
    badge.style.cssText =
      "\n      position: absolute;\n      top: -8px;\n      right: -8px;\n      background: #174f54;\n      color: #fff;\n      font-size: 12px;\n      padding: 4px 7px;\n      border-radius: 999px;\n      box-shadow: 0 2px 6px rgba(0,0,0,0.15);\n      z-index: 30;\n    ".replace(
        /\n/g,
        ""
      );

    // tornar o link container posicionado para posicionar o badge
    link.style.position = link.style.position || "relative";
    link.appendChild(badge);

    // Remove após 2.2s
    setTimeout(() => {
      badge.remove();
    }, 2200);
  }

  perfilLinks.forEach((link, idx) => {
    // id único para cada link (usar href + índice)
    const id = link.getAttribute("href") + "::" + idx;
    if (!counters[id]) counters[id] = 0;

    // mostra contagem atual como atributo title (acessibilidade)
    link.setAttribute("data-click-count", counters[id]);
    link.setAttribute(
      "title",
      (link.getAttribute("title") || "") + " (cliques: " + counters[id] + ")"
    );

    link.addEventListener("click", function (e) {
      // aumenta contador
      counters[id] = (counters[id] || 0) + 1;
      saveCounters();

      // mostra badge com novo valor
      showBadge(link, counters[id]);

      // atualiza atributos
      link.setAttribute("data-click-count", counters[id]);
      link.setAttribute(
        "title",
        (link.getAttribute("title") || "") + " (cliques: " + counters[id] + ")"
      );

      // permite abrir link normalmente — remova preventDefault se quiser abrir imediatamente
      // para abrir em nova aba e também registrar clique sem navegar, podemos abrir manualmente
      const href = link.getAttribute("href");
      if (href && href !== "#") {
        // abre em nova aba
        window.open(href, "_blank", "noopener");
        e.preventDefault();
      }
    });
  });

  // preencher ano do footer, se existir
  const footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
});
