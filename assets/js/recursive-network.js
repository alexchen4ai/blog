// Glowing particle-network backgrounds inspired by recursive.com.
// Drives two canvases on the about page: the dark hero panel and a
// full-page fixed background. Clusters of nodes recursively branch
// outward, hold, fade, and regrow elsewhere. Respects
// prefers-reduced-motion (static frame) and pauses off-screen.
(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const DARK_PALETTE = [
    [214, 205, 255],
    [214, 205, 255],
    [255, 255, 255],
    [186, 170, 255],
    [255, 190, 140],
  ];
  const LIGHT_PALETTE = [
    [124, 96, 255],
    [124, 96, 255],
    [181, 9, 172],
    [110, 100, 150],
  ];

  const isDarkTheme = () => document.documentElement.getAttribute("data-theme") === "dark";
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const instances = [];

  function initNetwork(canvas, opts) {
    const ctx = canvas.getContext("2d");
    let width = 0,
      height = 0;
    let drifters = [];
    let clusters = [];
    let visible = true;
    let rafId = null;
    const pointer = { x: null, y: null };

    // Hero uses the fixed dark palette; the page background follows the theme.
    function look() {
      const dark = opts.themeAware ? isDarkTheme() : true;
      return dark
        ? { palette: DARK_PALETTE, link: "200, 190, 255", grid: "rgba(255,255,255,0.045)", dim: opts.themeAware ? 0.7 : 1 }
        : { palette: LIGHT_PALETTE, link: "124, 96, 255", grid: "rgba(0,0,0,0.035)", dim: 0.55 };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (opts.fullPage) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnDrifters();
      clusters = [];
      seedClusters(performance.now());
    }

    function spawnDrifters() {
      const { palette } = look();
      const count = Math.min(Math.round((width * height) / opts.driftDensity), opts.driftMax);
      drifters = Array.from({ length: count }, () => {
        const large = Math.random() < 0.18;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: large ? 2.5 + Math.random() * 4 : 0.8 + Math.random() * 1.6,
          color: palette[Math.floor(Math.random() * palette.length)],
          phase: Math.random() * Math.PI * 2,
          pulse: 0.5 + Math.random() * 1.2,
        };
      });
    }

    // --- Recursive growth clusters ---------------------------------------

    function addNode(cluster, x, y, depth, now, parent) {
      const { palette } = look();
      const node = {
        x,
        y,
        r: Math.max(3.4 - depth * 0.55, 1.2),
        depth,
        born: now,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
      cluster.nodes.push(node);
      if (parent) cluster.links.push({ a: parent, b: node, born: now });
      if (depth < opts.maxDepth) {
        const kids = depth === 0 ? 3 : Math.random() < 0.6 ? 2 : 1;
        for (let k = 0; k < kids; k++) {
          cluster.pending.push({
            parent: node,
            depth: depth + 1,
            at: now + 380 + Math.random() * 950,
          });
        }
      }
      return node;
    }

    function spawnCluster(now) {
      const margin = Math.min(width, height) * 0.18 + 40;
      const cluster = { nodes: [], links: [], pending: [], state: "grow", stateSince: now, alpha: 1 };
      addNode(cluster, margin + Math.random() * (width - margin * 2), margin + Math.random() * (height - margin * 2), 0, now, null);
      return cluster;
    }

    function seedClusters(now) {
      for (let i = 0; i < opts.clusterCount; i++) {
        // Stagger initial growth so clusters don't pulse in unison.
        const c = spawnCluster(now - Math.random() * 4000);
        if (reducedMotion.matches) growInstantly(c, now);
        clusters.push(c);
      }
    }

    function growInstantly(cluster, now) {
      while (cluster.pending.length) {
        const job = cluster.pending.shift();
        sprout(cluster, job, now - 5000);
      }
      cluster.state = "hold";
    }

    function sprout(cluster, job, now) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 45 + Math.random() * 60;
      const x = Math.min(Math.max(job.parent.x + Math.cos(angle) * dist, 10), width - 10);
      const y = Math.min(Math.max(job.parent.y + Math.sin(angle) * dist, 10), height - 10);
      addNode(cluster, x, y, job.depth, now, job.parent);
    }

    function updateClusters(now) {
      for (let i = clusters.length - 1; i >= 0; i--) {
        const c = clusters[i];
        for (let j = c.pending.length - 1; j >= 0; j--) {
          if (c.pending[j].at <= now) {
            sprout(c, c.pending.splice(j, 1)[0], now);
          }
        }
        if (c.state === "grow" && c.pending.length === 0) {
          c.state = "hold";
          c.stateSince = now;
        } else if (c.state === "hold" && now - c.stateSince > 5200 + (i % 3) * 1700) {
          c.state = "fade";
          c.stateSince = now;
        } else if (c.state === "fade") {
          c.alpha = Math.max(1 - (now - c.stateSince) / 1800, 0);
          if (c.alpha === 0) {
            clusters[i] = spawnCluster(now);
          }
        }
      }
    }

    // --- Drawing ----------------------------------------------------------

    function drawGrid(style) {
      ctx.strokeStyle = style.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 56; x < width; x += 56) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 56; y < height; y += 56) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    function drawDot(p, now, alpha, style) {
      const twinkle = reducedMotion.matches ? 1 : 0.72 + 0.28 * Math.sin(now / 900 + p.phase * (p.pulse || 1));
      const a = alpha * twinkle * style.dim;
      const [r, g, b] = p.color;
      if (p.r > 2.4) {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.55 * a})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.9 * a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawDriftLinks(style) {
      for (let i = 0; i < drifters.length; i++) {
        const a = drifters[i];
        for (let j = i + 1; j < drifters.length; j++) {
          const b = drifters[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(${style.link}, ${(1 - dist / 120) * 0.16 * style.dim})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (pointer.x !== null) {
          const dist = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(${style.link}, ${(1 - dist / 160) * 0.25 * style.dim})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
    }

    function drawClusters(now, style) {
      for (const c of clusters) {
        for (const link of c.links) {
          const progress = reducedMotion.matches ? 1 : easeOut(Math.min((now - link.born) / 450, 1));
          const x2 = link.a.x + (link.b.x - link.a.x) * progress;
          const y2 = link.a.y + (link.b.y - link.a.y) * progress;
          ctx.strokeStyle = `rgba(${style.link}, ${0.3 * c.alpha * style.dim})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(link.a.x, link.a.y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        for (const node of c.nodes) {
          const pop = reducedMotion.matches ? 1 : easeOut(Math.min((now - node.born) / 350, 1));
          drawDot({ ...node, r: node.r * pop }, now, c.alpha, style);
        }
      }
    }

    function drawFrame(now) {
      const style = look();
      ctx.clearRect(0, 0, width, height);
      if (opts.grid) drawGrid(style);
      drawDriftLinks(style);
      for (const p of drifters) drawDot(p, now, 1, style);

      if (!reducedMotion.matches) {
        updateClusters(now);
        for (const p of drifters) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
      }
      drawClusters(now, style);

      if (visible && !reducedMotion.matches) {
        rafId = requestAnimationFrame(drawFrame);
      } else {
        rafId = null;
      }
    }

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(drawFrame);
    }

    resize();
    start();

    window.addEventListener("resize", () => {
      resize();
      start();
    });

    const pointerTarget = opts.fullPage ? window : canvas.parentElement;
    pointerTarget.addEventListener("pointermove", (e) => {
      if (opts.fullPage) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      } else {
        const rect = canvas.parentElement.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      }
    });
    pointerTarget.addEventListener("pointerleave", () => {
      pointer.x = null;
      pointer.y = null;
    });

    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(canvas);

    reducedMotion.addEventListener("change", start);

    instances.push({ redraw: start, respawn: spawnDrifters });
  }

  const hero = document.getElementById("recursive-canvas");
  if (hero) {
    initNetwork(hero, {
      fullPage: false,
      themeAware: false,
      grid: true,
      driftDensity: 11000,
      driftMax: 90,
      clusterCount: 1,
      maxDepth: 3,
    });
  }

  const bg = document.getElementById("recursive-bg");
  if (bg) {
    initNetwork(bg, {
      fullPage: true,
      themeAware: true,
      grid: false,
      driftDensity: 26000,
      driftMax: 60,
      clusterCount: 3,
      maxDepth: 4,
    });
  }

  // Re-color everything when the user toggles light/dark mode.
  new MutationObserver(() => {
    instances.forEach((inst) => {
      inst.respawn();
      inst.redraw();
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
