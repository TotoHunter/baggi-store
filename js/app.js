/* BAGGI STORE — shared rendering, cart and checkout */
(function () {
  "use strict";

  var cfg = window.BAGGI_CONFIG;
  if (!cfg) return;

  var brand = cfg.brand;
  var contact = cfg.contact;
  var copy = cfg.copy || {};
  var CART_KEY = "baggi_cart";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function money(value) {
    return "₦" + Number(value).toLocaleString("en-NG");
  }

  function waUrl(message) {
    return (
      "https://wa.me/" +
      contact.whatsapp +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  function wordmark() {
    return esc(brand.name) + '<span class="accent">' + esc(brand.dot) + "</span>";
  }

  function findProduct(id) {
    return cfg.products.filter(function (p) {
      return p.id === id;
    })[0];
  }

  function sizesFor(categoryId) {
    var cat = cfg.categories.filter(function (c) {
      return c.id === categoryId;
    })[0];
    return cat ? cat.sizes : ["One size"];
  }

  var arrowUpRight =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';
  var arrowRight =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';

  function toast(message) {
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(function () {
      el.remove();
    }, 2800);
  }

  /* ---------------- Cart ---------------- */
  function getCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartCount();
  }

  function renderCartCount() {
    var count = getCart().reduce(function (sum, item) {
      return sum + (Number(item.qty) || 1);
    }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
    });
  }

  function addToCart(id, size, notes) {
    var product = findProduct(id);
    if (!product) return;
    var cart = getCart();
    var existing = cart.filter(function (item) {
      return (
        item.id === id &&
        item.size === size &&
        (item.notes || "") === (notes || "")
      );
    })[0];

    if (existing) existing.qty = (Number(existing.qty) || 1) + 1;
    else cart.push({ id: id, size: size, qty: 1, notes: notes || "" });

    saveCart(cart);
    toast(product.name + " added to your bag.");
  }

  function cartTotals() {
    var delivery = 0;
    var subtotal = getCart().reduce(function (sum, item) {
      var product = findProduct(item.id);
      if (!product) return sum;
      var qty = Number(item.qty) || 1;
      // Each product carries its real CJ freight cost for Nigeria.
      delivery += (Number(product.supplier && product.supplier.deliveryNgn) || 0) * qty;
      return sum + product.price * qty;
    }, 0);
    var shippingRules = cfg.shipping || {};
    var shipping = delivery +
      (subtotal >= (shippingRules.freeAbove || Infinity)
        ? 0
        : Number(shippingRules.flatFee) || 0);
    return { subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
  }

  /* ---------------- Header / footer ---------------- */
  function renderChrome() {
    var navItems = [
      ["collection", "Collection", "collection.html"],
      ["design", "Design Yours", "fit-advisor.html"],
      ["about", "About", "about.html"],
      ["contact", "Contact", "contact.html"]
    ];
    var page = document.body.getAttribute("data-page") || "";

    var announcement =
      '<div class="announcement">Worldwide delivery &nbsp;·&nbsp; Made to order &nbsp;·&nbsp; Secure checkout</div>';

    document.querySelectorAll("[data-header]").forEach(function (host) {
      host.innerHTML =
        announcement +
        '<header class="site-header"><div class="container header-inner">' +
        '<a class="wordmark" href="index.html" aria-label="' +
        esc(brand.name) +
        ' home">' +
        wordmark() +
        "</a>" +
        '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' +
        navItems
          .map(function (item) {
            var active = item[0] === page ? ' aria-current="page"' : "";
            return (
              '<a href="' + item[2] + '"' + active + ">" + item[1] + "</a>"
            );
          })
          .join("") +
        "</nav>" +
        '<div class="header-tools">' +
        '<a class="cart-link" href="cart.html" aria-label="Shopping bag">Bag <span class="cart-count" data-cart-count>0</span></a>' +
        '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg>' +
        "</button>" +
        "</div>" +
        "</div></header>";
    });

    document.querySelectorAll("[data-footer]").forEach(function (host) {
      host.innerHTML =
        '<footer class="site-footer">' +
        '<div class="container footer-main">' +
        '<div class="footer-brand">' +
        '<p class="footer-wordmark">' + wordmark() + "</p>" +
        '<p class="footer-tagline">' + esc(brand.tagline).toUpperCase() + "</p>" +
        '<p class="footer-note">Heavy pieces, cut extra wide, made for the street. No logos — the fit does the talking.</p>' +
        "</div>" +
        '<div class="footer-col"><h4>Shop</h4>' +
        '<a href="collection.html">All products</a>' +
        '<a href="collection.html#jeans">Jeans</a>' +
        '<a href="collection.html#hoodies">Hoodies</a>' +
        '<a href="collection.html#custom">Custom pieces</a>' +
        "</div>" +
        '<div class="footer-col"><h4>Help</h4>' +
        '<a href="contact.html">Contact us</a>' +
        '<a href="fit-advisor.html">Design yours</a>' +
        '<a href="about.html">Our story</a>' +
        '<a href="cart.html">Your bag</a>' +
        "</div>" +
        '<div class="footer-col"><h4>Get in touch</h4>' +
        '<a target="_blank" rel="noreferrer" href="' + esc(waUrl("Hi " + brand.name + "! I have a question.")) + '">WhatsApp us</a>' +
        '<a target="_blank" rel="noreferrer" href="' + esc(contact.instagramUrl) + '">' + esc(contact.instagramHandle) + "</a>" +
        '<a href="mailto:' + esc(contact.email) + '">' + esc(contact.email) + "</a>" +
        "</div>" +
        "</div>" +
        '<div class="container footer-bottom">' +
        "<span>© " + esc(brand.copyrightYear) + " " + esc(brand.name) + ". All rights reserved.</span>" +
        "<span>Secure payments · Tracked delivery · Made to order</span>" +
        "</div>" +
        "</footer>";
    });

    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    }

    renderCartCount();
  }

  /* ---------------- Copy bindings ---------------- */
  function renderCopy() {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      if (copy[key] != null) el.textContent = copy[key];
    });

    var paraHost = document.querySelector("[data-about-paragraphs]");
    if (paraHost && copy.aboutParagraphs) {
      paraHost.innerHTML = copy.aboutParagraphs
        .map(function (p) {
          return "<p>" + esc(p) + "</p>";
        })
        .join("");
    }

    var heroPoints = document.querySelector("[data-hero-points]");
    if (heroPoints && cfg.heroPoints) {
      heroPoints.innerHTML = cfg.heroPoints
        .map(function (p) {
          return "<span>" + esc(p) + "</span>";
        })
        .join("");
    }

    var trustHost = document.querySelector("[data-trust]");
    if (trustHost && cfg.trust) {
      trustHost.innerHTML = cfg.trust
        .map(function (t) {
          return (
            '<div class="trust-item">' +
            '<span class="trust-check">✓</span>' +
            "<div><strong>" + esc(t.title) + "</strong>" +
            "<small>" + esc(t.text) + "</small></div>" +
            "</div>"
          );
        })
        .join("");
    }

    var stepsHost = document.querySelector("[data-steps]");
    if (stepsHost && cfg.steps) {
      stepsHost.innerHTML = cfg.steps
        .map(function (s) {
          return (
            '<div class="step">' +
            '<span class="step-num display">' + esc(s.num) + "</span>" +
            '<h3 class="display step-title">' + esc(s.title) + "</h3>" +
            "<p>" + esc(s.text) + "</p>" +
            "</div>"
          );
        })
        .join("");
    }

    var featureHost = document.querySelector("[data-features]");
    if (featureHost && cfg.features) {
      featureHost.innerHTML = cfg.features
        .map(function (f) {
          return (
            '<div class="feature">' +
            '<span class="feature-num">' + esc(f.num || "") + "</span>" +
            '<h3 class="display">' + esc(f.title) + "</h3><p>" +
            esc(f.text) +
            "</p></div>"
          );
        })
        .join("");
    }

    document.querySelectorAll("[data-marquee]").forEach(function (host) {
      var items = cfg.marquees && cfg.marquees[host.getAttribute("data-marquee")];
      if (!items) return;
      var strip =
        '<div class="marquee-track">' +
        items
          .map(function (t) {
            return (
              '<span class="display">' + esc(t) +
              '<span class="marquee-star">✦</span></span>'
            );
          })
          .join("") +
        "</div>";
      host.innerHTML = strip + strip;
      var copies = host.querySelectorAll(".marquee-track");
      if (copies[1]) copies[1].setAttribute("aria-hidden", "true");
    });
  }

  /* ---------------- Products ---------------- */
  function orderMessage(product) {
    return (
      "Hi " +
      brand.name +
      "! I want to order the " +
      product.name +
      " (" +
      product.variant +
      "). My size is:"
    );
  }

  function productCard(product) {
    var options = sizesFor(product.category)
      .map(function (s) {
        return '<option value="' + esc(s) + '">' + esc(s) + "</option>";
      })
      .join("");

    return (
      '<article class="product-card">' +
      '<div class="grain product-media" data-index="' + esc(product.index) + '">' +
      '<img src="assets/' + esc(product.image) + '" alt="' +
      esc(product.imageAlt || product.name) +
      '" width="896" height="1152" loading="lazy">' +
      (product.customizable ? '<span class="custom-tag">Custom</span>' : "") +
      "</div>" +
      '<div class="product-body">' +
      '<div class="product-head">' +
      "<div>" +
      '<p class="product-index">' + esc(product.index) + " / " +
      esc(product.variant) + "</p>" +
      '<h3 class="product-title display">' + esc(product.name) + "</h3>" +
      "</div>" +
      '<p class="product-price">' + money(product.price) + "</p>" +
      "</div>" +
      '<p class="product-desc">' + esc(product.description) + "</p>" +
      '<div class="card-actions">' +
      '<select class="size-select" data-size-for="' + esc(product.id) +
      '" aria-label="Select size for ' + esc(product.name) + '">' + options + "</select>" +
      '<button class="add-btn" type="button" data-add="' + esc(product.id) +
      '">Add to bag</button>' +
      "</div>" +
      '<a class="order-btn" href="' + esc(waUrl(orderMessage(product))) +
      '" target="_blank" rel="noreferrer"><span>Order on WhatsApp</span>' +
      arrowUpRight +
      "</a>" +
      "</div>" +
      "</article>"
    );
  }

  function renderProducts() {
    var featuredHost = document.querySelector("[data-featured]");
    if (featuredHost) {
      featuredHost.innerHTML = cfg.products
        .filter(function (p) {
          return p.featured;
        })
        .slice(0, 3)
        .map(productCard)
        .join("");
    }

    var collectionHost = document.querySelector("[data-collection]");
    if (!collectionHost) return;

    collectionHost.innerHTML = cfg.categories
      .map(function (cat, catIndex) {
        var items = cfg.products.filter(function (p) {
          return p.category === cat.id;
        });
        return (
          '<section class="collection-group" id="' + esc(cat.id) + '">' +
          '<h2 class="section-title display" data-index="' +
          String(catIndex + 1).padStart(2, "0") + '">' + esc(cat.label) +
          '<span class="section-count">' + items.length + " pieces</span></h2>" +
          '<div class="product-grid">' + items.map(productCard).join("") + "</div>" +
          '<div class="size-panel">' +
          '<p class="size-label">' + esc(cat.label) + " sizes</p>" +
          '<div class="size-pills">' +
          cat.sizes
            .map(function (s) {
              return '<span class="size-pill">' + esc(s) + "</span>";
            })
            .join("") +
          "</div>" +
          '<p class="size-note">' + esc(cat.sizeNote) + "</p>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");

    document.querySelectorAll("[data-category-links]").forEach(function (host) {
      host.innerHTML = cfg.categories
        .map(function (cat) {
          return (
            '<a class="category-link" href="#' + esc(cat.id) + '">' +
            esc(cat.label) + "</a>"
          );
        })
        .join("");
    });
  }

  /* ---------------- Contact page ---------------- */
  function renderContact() {
    var host = document.querySelector("[data-contact-grid]");
    if (!host) return;

    var whatsappMessage = "Hi " + brand.name + "! I want to order some pieces.";
    var designMessage =
      "Hi " + brand.name +
      "! I'm sending pictures of my design. Can you make this for me? Size:";

    var messageIcon =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.7 9.7 0 0 1-3.3-.6L3 21l1.7-5.2A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/></svg>';
    var imageIcon =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 5h6M19 2v6M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5m6.5 12-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><circle cx="9" cy="9" r="2"/></svg>';
    var instagramIcon =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
    var mailIcon =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/></svg>';

    var cards = [
      { icon: messageIcon, title: "WhatsApp", sub: "Order in minutes", href: waUrl(whatsappMessage) },
      { icon: imageIcon, title: "Your Design", sub: "Send us pictures on WhatsApp", href: waUrl(designMessage) },
      { icon: instagramIcon, title: "Instagram", sub: contact.instagramHandle, href: contact.instagramUrl },
      { icon: mailIcon, title: "Email", sub: contact.email, href: "mailto:" + contact.email }
    ];

    host.innerHTML = cards
      .map(function (c) {
        return (
          '<a class="contact-card" href="' + esc(c.href) +
          '" target="_blank" rel="noreferrer">' +
          '<span class="contact-card-top">' + c.icon + arrowUpRight + "</span>" +
          '<span><span class="contact-card-title display">' + esc(c.title) +
          "</span><span class=\"contact-card-sub\">" + esc(c.sub) + "</span></span>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------------- Design your own ---------------- */
  function renderDesign() {
    var formHost = document.querySelector("[data-design-form]");
    if (!formHost) return;

    var opts = cfg.designOptions || {};
    var productMap = opts.productMap || {};
    var waists =
      (cfg.categories.filter(function (c) {
        return c.id === "jeans";
      })[0] || {}).sizes || [];

    formHost.innerHTML =
      '<form class="design-form" id="design-form">' +
      '<fieldset class="field"><legend>What are you designing?</legend>' +
      '<div class="segmented" data-segment="category">' +
      (opts.categories || [])
        .map(function (v, i) {
          return (
            '<button type="button" class="segment' +
            (i === 0 ? " is-selected" : "") + '">' + esc(v) + "</button>"
          );
        })
        .join("") +
      "</div></fieldset>" +
      '<label class="field"><span>Your design</span><textarea rows="4" maxlength="600" id="design-text" placeholder="e.g. Black jeans with cracked paint lines and \'LIFE\' down one leg"></textarea></label>' +
      '<fieldset class="field"><legend>Fit</legend><div class="chip-row" data-segment="fit">' +
      (opts.fits || [])
        .map(function (v, i) {
          return (
            '<button type="button" class="chip' +
            (i === 0 ? " is-selected" : "") + '">' + esc(v) + "</button>"
          );
        })
        .join("") +
      "</div></fieldset>" +
      '<fieldset class="field"><legend>Waist / size</legend><div class="chip-row" data-segment="waist">' +
      waists
        .map(function (v, i) {
          return (
            '<button type="button" class="chip chip-sm' +
            (i === 2 ? " is-selected" : "") + '">' + esc(v) + "</button>"
          );
        })
        .join("") +
      "</div></fieldset>" +
      '<label class="field"><span>Height (optional)</span><input type="text" id="design-height" maxlength="40" placeholder="e.g. 5\'11 / 180cm"></label>' +
      '<label class="field"><span>Anything else (optional)</span><input type="text" id="design-extra" maxlength="400" placeholder="e.g. wearing it with chunky sneakers"></label>' +
      '<button type="submit" class="btn btn-primary btn-lg">Get my pre-order</button>' +
      '<a class="btn btn-outline btn-lg" href="' +
      esc(waUrl("Hi " + brand.name + "! I'm sending pictures of my design. Can you make this for me? Size:")) +
      '" target="_blank" rel="noreferrer">Send pictures of my design</a>' +
      '<p class="form-hint">Opens WhatsApp — attach your sketch or photo there.</p>' +
      "</form>";

    var form = document.getElementById("design-form");
    var preview = document.querySelector("[data-design-preview]");
    var selected = { category: "", fit: "", waist: "" };

    form.querySelectorAll("[data-segment]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        group.querySelectorAll("button").forEach(function (b) {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        selected[group.getAttribute("data-segment")] = btn.textContent.trim();
        updatePreview();
      });
    });

    ["design-text", "design-height", "design-extra"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", updatePreview);
    });

    function summary() {
      var design = document.getElementById("design-text").value.trim();
      var height = document.getElementById("design-height").value.trim();
      var extra = document.getElementById("design-extra").value.trim();
      var category = selected.category || (opts.categories || [])[0];
      var fit = selected.fit || (opts.fits || [])[0];
      var waist = selected.waist || waists[2] || waists[0];
      var message =
        "Hi " + brand.name + "! I'd like a custom " + category + ".\n\n" +
        "Design: " + (design || "(to be discussed)") +
        "\nFit: " + fit +
        "\nWaist/Size: " + waist +
        (height ? "\nHeight: " + height : "") +
        (extra ? "\nExtra: " + extra : "");
      return { message: message, design: design, category: category, waist: waist };
    }

    function updatePreview() {
      if (!preview) return;
      var s = summary();
      var productId = productMap[s.category] || "custom-tee";
      preview.innerHTML =
        '<p class="preview-label">Your personalised pre-order</p>' +
        '<p class="preview-main">' + esc(s.design || "Describe your design on the left") + "</p>" +
        '<p class="preview-meta">' + esc([s.category, selected.fit, s.waist].filter(Boolean).join(" · ")) + "</p>" +
        '<div class="preview-actions">' +
        '<button class="btn btn-primary" type="button" data-add-custom="' + esc(productId) +
        '" data-custom-size="' + esc(s.waist) + '">Add to bag</button>' +
        '<a class="preview-link" target="_blank" rel="noreferrer" href="' + esc(waUrl(s.message)) +
        '">Send on WhatsApp ' + arrowRight + "</a>" +
        "</div>";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.open(waUrl(summary().message), "_blank", "noopener,noreferrer");
    });

    updatePreview();
  }

  /* ---------------- Cart page ---------------- */
  function renderCartPage() {
    var host = document.querySelector("[data-cart-items]");
    if (!host) return;
    var cart = getCart();

    if (!cart.length) {
      host.innerHTML =
        '<div class="empty-state"><p class="display empty-title">Your bag is empty.</p>' +
        '<a class="btn btn-primary" href="collection.html">Browse the collection</a></div>';
      return;
    }

    host.innerHTML = cart
      .map(function (item, i) {
        var p = findProduct(item.id);
        if (!p) return "";
        return (
          '<div class="cart-item">' +
          '<img src="assets/' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '">' +
          '<div class="cart-item-info">' +
          '<p class="product-index">' + esc(p.variant) + "</p>" +
          '<h3 class="display cart-item-title">' + esc(p.name) + "</h3>" +
          '<p class="cart-item-meta">Size: ' + esc(item.size || "One size") + "</p>" +
          (item.notes ? '<p class="cart-item-notes">' + esc(item.notes.split("\n")[0]) + "</p>" : "") +
          '<div class="qty-control">' +
          '<button type="button" data-qty="dec" data-index="' + i + '" aria-label="Decrease quantity">−</button>' +
          "<span>" + (Number(item.qty) || 1) + "</span>" +
          '<button type="button" data-qty="inc" data-index="' + i + '" aria-label="Increase quantity">+</button>' +
          "</div>" +
          "</div>" +
          '<div class="cart-item-end">' +
          '<p class="product-price">' + money(p.price * (Number(item.qty) || 1)) + "</p>" +
          '<button class="cart-remove" type="button" data-remove="' + i + '">Remove</button>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    var totals = cartTotals();
    var summaryHost = document.querySelector("[data-cart-summary]");
    if (summaryHost) {
      var rules = cfg.shipping || {};
      summaryHost.innerHTML =
        '<h2 class="display cart-summary-title">Order summary</h2>' +
        '<div class="summary-row"><span>Subtotal</span><span>' + money(totals.subtotal) + "</span></div>" +
        '<div class="summary-row"><span>Delivery</span><span>' +
        (totals.shipping ? money(totals.shipping) : "Free") + "</span></div>" +
        '<div class="summary-row summary-total"><span>Total</span><span>' + money(totals.total) + "</span></div>" +
        '<p class="summary-note">' + esc(rules.note || "") + "</p>" +
        '<a class="btn btn-primary checkout-btn" href="checkout.html">Continue to checkout</a>' +
        '<a class="continue-link" href="collection.html">← Continue shopping</a>';
    }
  }

  /* ---------------- Checkout page ---------------- */
  function renderCheckout() {
    var cart = getCart();
    var summaryHost = document.querySelector("[data-checkout-summary]");
    var methodsHost = document.querySelector("[data-payment-methods]");
    var form = document.getElementById("checkout-form");
    if (!summaryHost || !methodsHost || !form) return;

    if (!cart.length) {
      summaryHost.innerHTML =
        '<div class="empty-state"><p class="display empty-title">Nothing to check out.</p>' +
        '<a class="btn btn-primary" href="collection.html">Browse the collection</a></div>';
      form.hidden = true;
      return;
    }

    var totals = cartTotals();
    summaryHost.innerHTML =
      "<h2 class=\"display cart-summary-title\">Your order</h2>" +
      cart
        .map(function (item) {
          var p = findProduct(item.id);
          return p
            ? '<div class="checkout-line"><span>' + esc(p.name) +
              " × " + (Number(item.qty) || 1) +
              '<small>' + esc(item.size || "One size") + "</small></span><span>" +
              money(p.price * (Number(item.qty) || 1)) + "</span></div>"
            : "";
        })
        .join("") +
      '<div class="summary-row"><span>Delivery</span><span>' +
      (totals.shipping ? money(totals.shipping) : "Free") + "</span></div>" +
      '<div class="summary-row summary-total"><span>Total</span><span>' + money(totals.total) + "</span></div>" +
      '<p class="summary-note">' + esc((cfg.supplier && cfg.supplier.productionDays) || "") +
      " days production · " + esc((cfg.supplier && cfg.supplier.shippingDays) || "") + " days shipping</p>";

    var methods = (cfg.payments && cfg.payments.methods || []).filter(function (m) {
      return m.enabled !== false;
    });
    methodsHost.innerHTML = methods
      .map(function (m, i) {
        return (
          '<label class="payment-method">' +
          '<input type="radio" name="paymentMethod" value="' + esc(m.id) + '"' +
          (i === 0 ? " checked" : "") + ">" +
          '<span class="payment-name">' + esc(m.label) + "</span>" +
          '<span class="payment-desc">' + esc(m.description) + "</span>" +
          "</label>"
        );
      })
      .join("");

    var bankHost = document.querySelector("[data-bank-details]");
    if (bankHost) {
      var b = (cfg.payments && cfg.payments.bank) || {};
      bankHost.innerHTML =
        '<p class="bank-title display">Bank details</p>' +
        "<p>" + esc(b.bankName || "Bank name will be confirmed on WhatsApp") + "</p>" +
        "<p>" + esc(b.accountName || "BAGGI") + "</p>" +
        "<p>" + esc(b.accountNumber || "—") + "</p>" +
        '<p class="bank-note">' + esc(b.note || "") + "</p>";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing…";

      var selectedMethod = form.querySelector('input[name="paymentMethod"]:checked');
      var payload = {
        items: cart.map(function (item) {
          var p = findProduct(item.id);
          return {
            id: item.id,
            name: p ? p.name : item.id,
            variant: p ? p.variant : "",
            sku: (p && p.supplier && p.supplier.sizes && p.supplier.sizes[item.size])
              ? p.supplier.sizes[item.size].sku
              : (p && p.supplier ? p.supplier.sku : ""),
            vid: (p && p.supplier && p.supplier.sizes && p.supplier.sizes[item.size])
              ? p.supplier.sizes[item.size].vid
              : (p && p.supplier ? p.supplier.vid : ""),
            supplierCostCny: p && p.supplier ? p.supplier.costCny : 0,
            size: item.size,
            qty: Number(item.qty) || 1,
            unitPrice: p ? p.price : 0,
            notes: item.notes || ""
          };
        }),
        customer: {
          name: document.getElementById("cust-name").value.trim(),
          email: document.getElementById("cust-email").value.trim(),
          phone: document.getElementById("cust-phone").value.trim(),
          address: document.getElementById("cust-address").value.trim(),
          city: document.getElementById("cust-city").value.trim()
        },
        paymentMethod: selectedMethod ? selectedMethod.value : "whatsapp",
        amount: totals.total,
        currency: (cfg.payments && cfg.payments.currency) || "NGN",
        shipping: totals.shipping,
        supplier: cfg.supplier
      };

      submitOrder(payload, submitBtn);
    });
  }

  function apiBase() {
    var url = cfg.backendUrl || "";
    var isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i;
    var onLocalPage = isLocal.test(window.location.href);
    if (!url) {
      // Empty URL = same origin. The standalone preview server on :8000 has no
      // API, so point that one case at the local Express API on :3001.
      if (onLocalPage && window.location.port === "8000") {
        return window.location.protocol + "//" + window.location.hostname + ":3001";
      }
      return "";
    }
    // A localhost backend cannot be reached from a public storefront; use the
    // same origin instead (Express serves both the site and the API).
    if (isLocal.test(url) && !onLocalPage) return "";
    return url;
  }

  function showError(message, host, submitBtn) {
    if (!host) {
      toast(message);
      return;
    }
    host.hidden = false;
    host.innerHTML =
      '<div class="result-card result-error">' +
      '<p class="eyebrow">Could not place order</p>' +
      '<h2 class="display result-title">Something went wrong.</h2>' +
      "<p>" + esc(message) + "</p>" +
      '<a class="btn btn-outline" href="mailto:' +
      esc(contact.email) +
      '">Email us instead</a>' +
      "</div>";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Place order";
    }
  }

  function submitOrder(payload, submitBtn) {
    var endpoint = apiBase() + "/api/checkout";
    var resultHost = document.querySelector("[data-checkout-result]");

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, status: r.status, data: data };
        });
      })
      .then(function (res) {
        if (!res.ok) {
          showError(
            (res.data && res.data.error) || "Server returned " + res.status,
            resultHost,
            submitBtn
          );
          return;
        }
        if (res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
          return;
        }
        showResult(res.data, resultHost, submitBtn, Boolean(res.data.demo));
      })
      .catch(function () {
        var orderId = "DEMO-" + Date.now().toString().slice(-6);
        showResult(
          {
            orderId: orderId,
            status: "demo",
            message: "Backend is not reachable — this is a demo order. Start server/ to go live.",
            supplierOrderId: "CJ-DEMO"
          },
          resultHost,
          submitBtn,
          true
        );
      });
  }

  function showResult(data, host, submitBtn, demo) {
    if (!host) return;
    var customerMessage =
      "Hi " + brand.name + "! I just placed order " + data.orderId +
      (demo ? " (demo)" : "") + ". Please confirm payment and delivery.";
    host.hidden = false;
    host.innerHTML =
      '<div class="result-card">' +
      '<p class="eyebrow">' + (demo ? "Demo mode" : "Order created") + "</p>" +
      '<h2 class="display result-title">Thank you.</h2>' +
      "<p>" + esc(data.message || "Your order has been received.") + "</p>" +
      '<p class="result-meta">Order ID: <strong>' + esc(data.orderId) + "</strong></p>" +
      (data.supplierOrderId
        ? '<p class="result-meta">Supplier order: <strong>' + esc(data.supplierOrderId) + "</strong></p>"
        : "") +
      '<a class="btn btn-primary" target="_blank" rel="noreferrer" href="' +
      esc(waUrl(customerMessage)) + '">Confirm on WhatsApp</a>' +
      "</div>";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Place order";
    }
    localStorage.removeItem(CART_KEY);
    renderCartCount();
  }

  /* ---------------- Global click handling ---------------- */
  document.addEventListener("click", function (e) {
    var add = e.target.closest("[data-add]");
    if (add) {
      var id = add.getAttribute("data-add");
      var select = document.querySelector('[data-size-for="' + id + '"]');
      addToCart(id, select ? select.value : "One size");
      return;
    }

    var addCustom = e.target.closest("[data-add-custom]");
    if (addCustom) {
      addToCart(
        addCustom.getAttribute("data-add-custom"),
        addCustom.getAttribute("data-custom-size") || "One size",
        document.querySelector("[data-design-preview]").innerText
      );
      return;
    }

    var remove = e.target.closest("[data-remove]");
    if (remove) {
      var cart = getCart();
      cart.splice(Number(remove.getAttribute("data-remove")), 1);
      saveCart(cart);
      renderCartPage();
      return;
    }

    var qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      var c = getCart();
      var index = Number(qtyBtn.getAttribute("data-index"));
      var direction = qtyBtn.getAttribute("data-qty");
      if (direction === "inc") c[index].qty = (Number(c[index].qty) || 1) + 1;
      if (direction === "dec") {
        c[index].qty = (Number(c[index].qty) || 1) - 1;
        if (c[index].qty < 1) c.splice(index, 1);
      }
      saveCart(c);
      renderCartPage();
    }
  });

  /* ---------------- Init ---------------- */
  function init() {
    renderChrome();
    renderCopy();
    renderProducts();
    renderContact();
    renderDesign();
    renderCartPage();
    renderCheckout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
