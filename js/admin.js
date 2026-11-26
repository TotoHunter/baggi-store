/* BAGGI STORE — local admin helper (no server required) */
(function () {
  "use strict";

  var cfg = window.BAGGI_CONFIG;
  if (!cfg) return;

  var draft = JSON.parse(JSON.stringify(cfg));
  var tbody = document.getElementById("admin-products");
  var settingsHost = document.getElementById("admin-settings");
  var status = document.getElementById("admin-status");

  function attr(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getPath(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, draft);
  }

  function setPath(path, value) {
    var parts = path.split(".");
    var obj = draft;
    for (var i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = value;
  }

  function notify(message) {
    if (status) status.textContent = message;
  }

  /* ---------- Settings ---------- */
  var settingFields = [
    ["brand.name", "Brand name", "text"],
    ["brand.tagline", "Tagline", "text"],
    ["contact.whatsapp", "WhatsApp number (digits only)", "text"],
    ["contact.instagramUrl", "Instagram URL", "text"],
    ["contact.instagramHandle", "Instagram handle", "text"],
    ["contact.email", "Email address", "text"],
    ["backendUrl", "Backend URL", "text"],
    ["shipping.flatFee", "Delivery fee (₦)", "number"],
    ["shipping.freeAbove", "Free delivery above (₦)", "number"],
    ["supplier.name", "Supplier name", "text"],
    ["supplier.mode", "Supplier mode (api / manual)", "text"],
    ["supplier.exchangeRateToNgn", "CNY → NGN rate", "number"],
    ["payments.bank.bankName", "Bank name", "text"],
    ["payments.bank.accountName", "Account name", "text"],
    ["payments.bank.accountNumber", "Account number", "text"]
  ];

  settingsHost.innerHTML = settingFields
    .map(function (f) {
      return (
        '<label class="admin-label">' +
        f[1] +
        '<input type="' +
        (f[2] || "text") +
        '" data-path="' +
        f[0] +
        '" value="' +
        attr(getPath(f[0])) +
        '"></label>'
      );
    })
    .join("");

  settingsHost.addEventListener("input", function (e) {
    var path = e.target.getAttribute("data-path");
    if (!path) return;
    setPath(path, e.target.type === "number" ? Number(e.target.value) || 0 : e.target.value);
  });

  /* ---------- Products ---------- */
  function renderProducts() {
    tbody.innerHTML = draft.products
      .map(function (p, i) {
        var categories = draft.categories
          .map(function (c) {
            return (
              '<option value="' +
              attr(c.id) +
              '"' +
              (c.id === p.category ? " selected" : "") +
              ">" +
              attr(c.label) +
              "</option>"
            );
          })
          .join("");

        return (
          "<tr>" +
          '<td><select data-idx="' + i + '" data-field="category">' + categories + "</select></td>" +
          '<td><input type="text" data-idx="' + i + '" data-field="name" value="' + attr(p.name) + '"></td>' +
          '<td><input type="text" data-idx="' + i + '" data-field="variant" value="' + attr(p.variant) + '"></td>' +
          '<td><input type="number" min="0" step="100" data-idx="' + i + '" data-field="price" value="' + attr(p.price) + '"></td>' +
          '<td><input type="text" data-idx="' + i + '" data-field="image" value="' + attr(p.image) + '"></td>' +
          '<td><textarea data-idx="' + i + '" data-field="description">' + attr(p.description) + "</textarea></td>" +
          '<td><input type="text" data-idx="' + i + '" data-field="supplierSku" value="' + attr(p.supplier && p.supplier.sku) + '"></td>' +
          '<td><input type="text" data-idx="' + i + '" data-field="supplierVid" value="' + attr(p.supplier && p.supplier.vid) + '"></td>' +
          '<td><input type="number" min="0" step="1" data-idx="' + i + '" data-field="supplierCostCny" value="' + attr(p.supplier && p.supplier.costCny) + '"></td>' +
          '<td><input type="number" min="0" step="100" data-idx="' + i + '" data-field="deliveryNgn" value="' + attr(p.supplier && p.supplier.deliveryNgn) + '"></td>' +
          '<td><input type="checkbox" data-idx="' + i + '" data-field="customizable"' + (p.customizable ? " checked" : "") + "></td>" +
          '<td><input type="checkbox" data-idx="' + i + '" data-field="featured"' + (p.featured ? " checked" : "") + "></td>" +
          '<td><button class="admin-delete" type="button" data-delete="' + i + '">Delete</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function updateFromEvent(e) {
    var field = e.target.getAttribute("data-field");
    if (!field) return;
    var idx = Number(e.target.getAttribute("data-idx"));
    var product = draft.products[idx];
    if (!product) return;
    if (field === "featured" || field === "customizable") product[field] = e.target.checked;
    else if (field === "price") product[field] = Number(e.target.value) || 0;
    else if (field === "supplierSku" || field === "supplierVid" ||
             field === "supplierCostCny" || field === "deliveryNgn") {
      if (!product.supplier) product.supplier = { type: "cj" };
      var prop = field === "supplierSku" ? "sku"
        : field === "supplierVid" ? "vid"
        : field === "supplierCostCny" ? "costCny" : "deliveryNgn";
      product.supplier[prop] = (field === "supplierSku" || field === "supplierVid")
        ? e.target.value
        : (Number(e.target.value) || 0);
    } else product[field] = e.target.value;
  }

  tbody.addEventListener("input", updateFromEvent);
  tbody.addEventListener("change", updateFromEvent);

  tbody.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-delete]");
    if (!btn) return;
    draft.products.splice(Number(btn.getAttribute("data-delete")), 1);
    renderProducts();
  });

  document.getElementById("add-product").addEventListener("click", function () {
    draft.products.push({
      id: "product-" + Date.now(),
      category: draft.categories[0] ? draft.categories[0].id : "jeans",
      name: "New product",
      variant: "New colour",
      index: String(draft.products.length + 1).padStart(2, "0"),
      price: 15000,
      image: "your-image.jpg",
      imageAlt: "New product in New colour",
      description: "Short product description.",
      customizable: false,
      featured: false,
      supplier: { type: "cj", sku: "", vid: "", costCny: 0, deliveryNgn: 0 }
    });
    renderProducts();
    notify("Product added — fill in its details, then download config.js.");
  });

  renderProducts();

  /* ---------- Export ---------- */
  function configText() {
    return (
      "/* BAGGI STORE — generated by admin.html */\n" +
      "window.BAGGI_CONFIG = " +
      JSON.stringify(draft, null, 2) +
      ";\n"
    );
  }

  document.getElementById("download-config").addEventListener("click", function () {
    var blob = new Blob([configText()], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    notify("Downloaded config.js — replace the file in the js folder.");
  });

  document.getElementById("copy-config").addEventListener("click", function () {
    var text = configText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          notify("Config copied to clipboard.");
        },
        function () {
          fallbackCopy(text);
        }
      );
    } else {
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      notify("Config copied to clipboard.");
    } catch (e) {
      notify("Copy failed — use Download config.js instead.");
    }
    ta.remove();
  }
})();
