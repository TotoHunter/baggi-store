/* BAGGI STORE — renders one Amazon-style detail page per product.
   The product id comes from data-product-id on <body>. */
(function () {
  "use strict";

  var cfg = window.BAGGI_CONFIG;
  var extra = window.BAGGI_PRODUCT_DETAILS || {};
  if (!cfg) return;

  var id = document.body.getAttribute("data-product-id");
  var host = document.querySelector("[data-product-detail]");
  if (!id || !host) return;

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

  function findProduct(productId) {
    return cfg.products.filter(function (p) {
      return p.id === productId;
    })[0];
  }

  function sizesFor(categoryId) {
    var cat = cfg.categories.filter(function (c) {
      return c.id === categoryId;
    })[0];
    return cat ? cat.sizes : ["One size"];
  }

  function categoryFor(categoryId) {
    return cfg.categories.filter(function (c) {
      return c.id === categoryId;
    })[0];
  }

  function waLink(message) {
    return (
      "https://wa.me/" +
      cfg.contact.whatsapp +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  var product = findProduct(id);
  if (!product) {
    host.innerHTML =
      '<div class="empty-state"><p class="display empty-title">Product not found.</p>' +
      '<a class="btn btn-primary" href="collection.html">Browse the collection</a></div>';
    return;
  }

  var info = extra[id] || {};
  var category = categoryFor(product.category);
  var sizes = product.supplier && product.supplier.sizes
    ? Object.keys(product.supplier.sizes)
    : sizesFor(product.category);
  if (!sizes.length) sizes = sizesFor(product.category);
  var colours = info.colours || [{ name: product.variant, hex: "#8b8d90" }];
  var firstColour = colours[0].name;
  var firstSize = sizes[0];

  document.title = product.name + " — " + cfg.brand.name;
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = product.description + " Shop " + cfg.brand.name + ".";

  var image =
    '<img class="pdp-main-img" src="assets/' + esc(product.image) +
    '" alt="' + esc(product.imageAlt || product.name) +
    '" width="896" height="1152">';

  var thumbViews = [
    ["full", "Full look"],
    ["fit", "Fit"],
    ["fabric", "Fabric"]
  ];
  var thumbs = thumbViews
    .map(function (v, i) {
      return (
        '<button class="pdp-thumb' + (i === 0 ? " is-active" : "") +
        '" type="button" data-view="' + v[0] +
        '" aria-label="' + esc(v[1]) + '" aria-pressed="' + (i === 0) + '">' +
        '<img src="assets/' + esc(product.image) + '" alt=""></button>'
      );
    })
    .join("");

  var swatches = colours
    .map(function (c, i) {
      return (
        '<button class="pdp-swatch' + (i === 0 ? " is-active" : "") +
        (c.pop ? " is-pop" : "") +
        '" type="button" data-colour="' + esc(c.name) +
        '" aria-label="' + esc(c.name) + '" aria-pressed="' + (i === 0) + '">' +
        '<span class="pdp-swatch-dot" style="background:' + esc(c.hex) + '"></span>' +
        "<span>" + esc(c.name) + "</span>" +
        (c.pop ? '<span class="pdp-pop-tag">POP</span>' : "") +
        "</button>"
      );
    })
    .join("");

  var colourOptions = colours
    .map(function (c) {
      return '<option value="' + esc(c.name) + '">' + esc(c.name) + "</option>";
    })
    .join("");

  var sizeOptions = sizes
    .map(function (s) {
      return '<option value="' + esc(s) + '">' + esc(s) + "</option>";
    })
    .join("");

  var bullets = (info.bullets || [])
    .map(function (b) {
      return "<li>" + esc(b) + "</li>";
    })
    .join("");

  var production = (cfg.supplier && cfg.supplier.productionDays) || "3–7";
  var shipping = (cfg.supplier && cfg.supplier.shippingDays) || "7–14";

  host.innerHTML =
    '<nav class="pdp-breadcrumb" aria-label="Breadcrumb">' +
    '<a href="index.html">Home</a><span>/</span>' +
    '<a href="collection.html">Collection</a><span>/</span>' +
    '<a href="' + esc((category ? category.id : "collection") + ".html") + '" data-pdp-crumb>Collection</a>' +
    "<span>/</span><strong>" + esc(product.name) + "</strong></nav>" +
    '<div class="pdp-grid">' +
    '<div class="pdp-gallery">' +
    '<div class="pdp-main-image grain">' + image + "</div>" +
    '<div class="pdp-thumbs" role="group" aria-label="Product views">' + thumbs + "</div>" +
    '<p class="pdp-image-note">Photographed in ' + esc(product.variant) +
    ". Colour options: " + esc(colours.map(function (c) { return c.name; }).join(", ")) + ".</p>" +
    "</div>" +
    '<div class="pdp-info">' +
    '<p class="eyebrow">Drop 01 · ' + esc(cfg.brand.name) + "</p>" +
    '<h1 class="display pdp-title">' + esc(product.name) + "</h1>" +
    '<p class="pdp-subtitle">' + esc(product.variant) + " · " +
    esc(product.index) + " / " + esc(category ? category.label : "BAGGI") + "</p>" +
    '<p class="pdp-price">' + money(product.price) + "</p>" +
    '<p class="pdp-price-note">Made to order. Delivery is calculated at checkout.</p>' +
    '<div class="pdp-block">' +
    '<p class="pdp-label">Colour: <strong data-colour-label>' + esc(firstColour) + "</strong></p>" +
    '<div class="pdp-swatches" role="group" aria-label="Choose colour">' + swatches + "</div>" +
    '<p class="pdp-colour-hint">Two brand colours: near-black and BAGGI Lime. ' +
    "Lime is the loud one — made to pop against the plain fits.</p>" +
    '<select class="pdp-hidden-select" data-colour-for="' + esc(id) +
    '" aria-label="Selected colour">' + colourOptions + "</select>" +
    "</div>" +
    '<div class="pdp-block">' +
    '<label class="pdp-label" for="pdp-size">Size</label>' +
    '<select class="size-select pdp-size" id="pdp-size" data-size-for="' + esc(id) + '">' +
    sizeOptions + "</select>" +
    '<p class="pdp-size-note">' + esc((category && category.sizeNote) || "") + "</p>" +
    "</div>" +
    '<div class="pdp-actions">' +
    '<button class="add-btn pdp-add" type="button" data-add="' + esc(id) + '">Add to bag</button>' +
    '<a class="order-btn pdp-wa" data-wa-link href="' +
    esc(waLink("Hi " + cfg.brand.name + "! I want to order the " + product.name + " in " +
      firstColour + ". Size: " + firstSize + ".")) +
    '" target="_blank" rel="noreferrer"><span>Order on WhatsApp</span> ↗</a>' +
    "</div>" +
    '<ul class="pdp-assurances">' +
    "<li>Secure card, bank &amp; wallet checkout</li>" +
    "<li>Made to order in " + esc(production) + " days</li>" +
    "<li>Tracked delivery in " + esc(shipping) + " days</li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    '<section class="pdp-details">' +
    '<div class="pdp-details-copy">' +
    '<h2 class="display pdp-section-title">Product details</h2>' +
    '<p class="pdp-story">' + esc(info.story || product.description) + "</p>" +
    (bullets ? '<ul class="pdp-bullets">' + bullets + "</ul>" : "") +
    "</div>" +
    '<div class="pdp-specs">' +
    '<h3 class="pdp-spec-title">At a glance</h3>' +
    '<dl class="pdp-spec-list">' +
    "<dt>Category</dt><dd>" + esc(category ? category.label : product.category) + "</dd>" +
    "<dt>Colour</dt><dd data-spec-colour>" + esc(firstColour) + "</dd>" +
    "<dt>Sizes</dt><dd>" + esc(sizes.join(" · ")) + "</dd>" +
    "<dt>Availability</dt><dd>Made to order</dd>" +
    "<dt>Production</dt><dd>" + esc(production) + " days</dd>" +
    "<dt>Shipping</dt><dd>" + esc(shipping) + " days</dd>" +
    "</dl>" +
    "</div>" +
    "</section>";

  var relatedHost = document.querySelector("[data-pdp-related]");
  if (relatedHost) {
    var related = cfg.products
      .filter(function (p) {
        return p.category === product.category && p.id !== id;
      })
      .slice(0, 4);
    if (!related.length) {
      related = cfg.products.filter(function (p) { return p.id !== id; }).slice(0, 4);
    }
    relatedHost.innerHTML =
      '<h2 class="display pdp-section-title">Customers also viewed</h2>' +
      '<div class="pdp-related-grid">' +
      related
        .map(function (p) {
          return (
            '<a class="pdp-related-card" href="product-' + esc(p.id) + '.html">' +
            '<img src="assets/' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" loading="lazy">' +
            '<span class="pdp-related-name">' + esc(p.name) + "</span>" +
            '<span class="pdp-related-price">' + money(p.price) + "</span>" +
            "</a>"
          );
        })
        .join("") +
      "</div>";
  }

  var crumb = host.querySelector("[data-pdp-crumb]");
  if (crumb) crumb.textContent = category ? category.label : "Collection";

  var colourSelect = host.querySelector('[data-colour-for="' + id + '"]');
  var sizeSelect = host.querySelector('[data-size-for="' + id + '"]');
  var wa = host.querySelector("[data-wa-link]");
  var colourLabel = host.querySelector("[data-colour-label]");
  var specColour = host.querySelector("[data-spec-colour]");
  var imageNote = host.querySelector(".pdp-image-note");

  function updateWa() {
    if (!wa) return;
    var colour = colourSelect ? colourSelect.value : firstColour;
    var size = sizeSelect ? sizeSelect.value : firstSize;
    wa.href = waLink(
      "Hi " + cfg.brand.name + "! I want to order the " + product.name +
      " in " + colour + ". Size: " + size + "."
    );
  }

  host.addEventListener("click", function (e) {
    var swatch = e.target.closest("[data-colour]");
    if (swatch && colourSelect) {
      var name = swatch.getAttribute("data-colour");
      colourSelect.value = name;
      host.querySelectorAll("[data-colour]").forEach(function (el) {
        var active = el === swatch;
        el.classList.toggle("is-active", active);
        el.setAttribute("aria-pressed", String(active));
      });
      if (colourLabel) colourLabel.textContent = name;
      if (specColour) specColour.textContent = name;
      if (imageNote) imageNote.textContent = "Shown in " + product.variant + ". Selected colour: " + name + ".";
      updateWa();
      return;
    }

    var thumb = e.target.closest("[data-view]");
    if (thumb) {
      var view = thumb.getAttribute("data-view");
      var img = host.querySelector(".pdp-main-img");
      if (img) img.className = "pdp-main-img view-" + view;
      host.querySelectorAll("[data-view]").forEach(function (el) {
        var active = el === thumb;
        el.classList.toggle("is-active", active);
        el.setAttribute("aria-pressed", String(active));
      });
    }
  });

  if (sizeSelect) sizeSelect.addEventListener("change", updateWa);
  updateWa();
})();
