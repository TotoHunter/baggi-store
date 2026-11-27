/* ============================================================
   BAGGI STORE — EDIT THIS FILE TO MANAGE YOUR SHOP
   ------------------------------------------------------------
   • Change prices, product names and descriptions here.
   • Change your WhatsApp number and social links under "contact".
   • Payment buttons are configured under "payments".
   • Supplier costs and SKUs live on each product under "supplier".
   • Secret API keys NEVER go here — they belong in server/.env
   ============================================================ */

window.BAGGI_CONFIG = {
  /* ---------- Brand ---------- */
  brand: {
    name: "BAGGI",
    dot: ".",
    tagline: "Plain denim. Big fits.",
    copyrightYear: 2026
  },

  /* ---------- Where customers reach you ---------- */
  contact: {
    // WhatsApp number in international format, digits only (no + or spaces)
    whatsapp: "2349065694156",
    instagramUrl: "https://instagram.com/baggiclothingco",
    instagramHandle: "@baggiclothingco",
    email: "hello@baggiclothingco.com"
  },

  /* ---------- Checkout ---------- */
  // Public HTTPS tunnel to the local API. Paystack webhook URL:
  // https://sought-exhibits-advantages-apr.trycloudflare.com/webhooks/paystack
  // "" = call the same origin. Works locally (http://localhost:3001) and on any
  // public host without hard-coding a tunnel URL that changes on restart.
  backendUrl: "",
  shipping: {
    flatFee: 0,
    freeAbove: 999999999,
    note: "Delivery is calculated per item at checkout and covers real CJ freight."
  },

  payments: {
    currency: "NGN",
    symbol: "₦",
    methods: [
      {
        id: "paystack",
        label: "Paystack",
        description: "Card, bank transfer, USSD",
        enabled: true,
        publicKey: "pk_live_aace3771ad0902dc8138b27ad7cb81e2151aac29"
      },
      {
        id: "flutterwave",
        label: "Flutterwave",
        description: "Card, bank transfer, mobile money",
        enabled: true,
        publicKey: ""
      },
      {
        id: "stripe",
        label: "Stripe",
        description: "International cards",
        enabled: true,
        publicKey: ""
      },
      {
        id: "paypal",
        label: "PayPal",
        description: "Pay with your PayPal account",
        enabled: true,
        publicKey: ""
      },
      {
        id: "bank",
        label: "Palmpay",
        description: "Direct transfer to Palmpay, then confirm on WhatsApp",
        enabled: true,
        publicKey: ""
      },
      {
        id: "whatsapp",
        label: "WhatsApp confirmation",
        description: "We'll send payment details in chat",
        enabled: true,
        publicKey: ""
      }
    ],
    bank: {
      bankName: "Palmpay",
      accountName: "Patrick Ibiso Wolugbom",
      accountNumber: "8923133406",
      note: "Transfer to the account above, then confirm on WhatsApp."
    }
  },

  /* ---------- Supplier ----------
     Secret keys are in server/.env, not here.
     costCny is what you pay the supplier per item in Chinese yuan.
  -------------------------------- */
  supplier: {
    name: "CJ Dropshipping",
    mode: "api", // "api" or "manual"
    costCurrency: "CNY",
    exchangeRateToNgn: 240,
    productionDays: "3–7",
    shippingDays: "7–14"
  },

  /* ---------- Text shown around the store ---------- */
  copy: {
    homeEyebrow: "Drop 01 — Out now",
    heroTitleTop: "Plain.",
    heroTitleMiddle: "Baggy.",
    heroTitleBottom: "Loud.",
    heroText:
      "Heavy denim cut extra wide. No logos, no rips, no noise — the fit does the talking.",
    heroBadge: "14oz denim",
    collectionEyebrow: "Drop 01",
    collectionTitle: "Collection",
    collectionText:
      "Jeans, hoodies, shirts, cargos and plain staples. All big, all BAGGI. Add to bag or order on WhatsApp. Design previews are WhatsApp-only.",
    aboutEyebrow: "The story",
    aboutTitleTop: "Less",
    aboutTitleMiddle: "noise.",
    aboutTitleBottom: "More leg.",
    aboutParagraphs: [
      "BAGGI started with one idea: the perfect pair of baggy jeans doesn't need a logo on the back pocket. It needs weight, width and a wash that ages right.",
      "Every pair is cut from heavy cotton denim, finished plain, and built to be worn hard — on the street, on the stage, everywhere. Design previews are confirmed on WhatsApp before we arrange any one-off production."
    ],
    designEyebrow: "Made to order · Pre-order",
    designTitleTop: "Design",
    designTitleBottom: "yours.",
    designText:
      "Pick jeans, a hoodie or a tee and describe the design in your head. Custom printing is not connected to CJ yet, so we'll confirm the one-off order with you on WhatsApp before any payment.",
    contactEyebrow: "Get yours",
    contactTitleTop: "Hit us",
    contactTitleBottom: "up.",
    contactText:
      "Send your waist size and the wash you want. We'll confirm price and delivery."
  },

  /* ---------- Scrolling marquee strips ---------- */
  marquees: {
    home: ["No logos", "Extra wide", "Heavy denim", "Made to order"],
    about: ["Built heavy", "Cut wide", "Kept plain"]
  },

  /* ---------- Home page feature strip ---------- */
  features: [
    { num: "01", title: "Wide", text: "Cut extra wide from hip to hem." },
    { num: "02", title: "Heavy", text: "14oz cotton denim that holds its shape." },
    { num: "03", title: "Yours", text: "Plain staples, or design previews confirmed on WhatsApp." }
  ],

  /* ---------- Professional trust signals ---------- */
  trust: [
    { title: "Secure checkout", text: "Card, bank & wallet payments" },
    { title: "Made to order", text: "Every piece cut for you" },
    { title: "Fast delivery", text: "Tracked to your door" },
    { title: "Real support", text: "Talk to us on WhatsApp" }
  ],

  heroPoints: ["Heavyweight fabrics", "Plain by design", "Made to order"],

  /* ---------- How it works ---------- */
  steps: [
    { num: "01", title: "Pick your piece", text: "Browse plain staples and add your size to the bag. For custom artwork, send a design preview on WhatsApp." },
    { num: "02", title: "Check out securely", text: "Pay with card, bank transfer or WhatsApp. Design previews are confirmed before any payment." },
    { num: "03", title: "We make & ship", text: "Your order is made to order and tracked all the way to your door." }
  ],

  /* ---------- Intro copy for each product type page ---------- */
  categoryIntros: {
    jeans: "Heavy denim cut extra wide. Plain washes, real weight and a straight leg that holds its shape all day.",
    hoodies: "Oversized heavy fleece with dropped shoulders and a big kangaroo pocket. Built to layer and wear hard.",
    shirts: "Boxy heavyweight tees and long sleeves with a thick collar. Plain by design, made to sit right.",
    cargo: "Wide-leg utility pieces with deep pockets and heavy cotton. Relaxed fit, zero noise.",
    outerwear: "Boxy 14oz denim built to go over any hoodie. Structured, heavy and plain.",
    accessories: "One-size pieces made to match every BAGGI fit. Plain, heavy and ready to wear.",
    custom: "Design previews only. Custom printing is not connected to CJ yet — send your artwork on WhatsApp and we will confirm the one-off order before any payment."
  },

  /* ---------- Categories, sizes and sizing advice ---------- */
  categories: [
    {
      id: "jeans",
      label: "Jeans",
      sizes: ["W28", "W30", "W32", "W34", "W36", "W38"],
      sizeNote:
        "Runs true to waist size — size down one for a slightly less baggy look."
    },
    {
      id: "hoodies",
      label: "Hoodies",
      sizes: ["S", "M", "L", "XL", "XXL"],
      sizeNote:
        "Cut oversized with dropped shoulders — take your usual size for the full boxy look."
    },
    {
      id: "shirts",
      label: "Shirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      sizeNote: "Boxy oversized tees — size down one if you want a closer fit."
    },
    {
      id: "cargo",
      label: "Cargo",
      sizes: ["W28", "W30", "W32", "W34", "W36", "W38"],
      sizeNote: "Relaxed cargo fit with a wide leg — take your usual waist size."
    },
    {
      id: "outerwear",
      label: "Outerwear",
      sizes: ["S", "M", "L", "XL", "XXL"],
      sizeNote: "Boxy oversized jackets — take your usual size for the full fit."
    },
    {
      id: "accessories",
      label: "Accessories",
      sizes: ["One size"],
      sizeNote: "One size. Built to match every BAGGI fit."
    },
    {
      id: "custom",
      label: "Custom",
      sizes: ["S", "M", "L", "XL", "XXL"],
      sizeNote:
        "Design preview only. Confirm your size and artwork on WhatsApp before paying."
    }
  ],

  /* ---------- Your products ----------
     The storefront is text-only: no photo fields are used.
     price        = what the customer pays (naira)
     supplier.costCny = what you pay the supplier (yuan)
     supplier.sku = the product code in your supplier account
     customizable = customer can add their own design
  ------------------------------------- */
  products: [
    {
      id: "og-baggi-indigo",
      category: "jeans",
      name: "OG BAGGI",
      variant: "Mid Indigo",
      index: "01",
      image: "og-baggi.jpg",
      imageAlt: "Model wearing blue denim jeans",
      price: 32000,
      description: "The everyday one. Heavy 14oz denim, wide straight leg.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX214221302BY", vid: "2409200336291616600", costCny: 106, deliveryNgn: 37500, sizes: { "W28": { sku: "CJXX214221301AZ", vid: "2409200336291616400" }, "W30": { sku: "CJXX214221302BY", vid: "2409200336291616600" }, "W32": { sku: "CJXX214221303CX", vid: "2409200336291616700" }, "W34": { sku: "CJXX214221304DW", vid: "2409200336291616900" }, "W36": { sku: "CJXX214221305EV", vid: "2409200336291617100" }, "W38": { sku: "CJXX214221305EV", vid: "2409200336291617100" } } }
    },
    {
      id: "night-baggi-black",
      category: "jeans",
      name: "Night BAGGI",
      variant: "Washed Black",
      index: "02",
      image: "night-baggi.jpg",
      imageAlt: "Model wearing black denim jeans",
      price: 48000,
      description: "Faded black wash that only gets better with wear.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX218563306FU", vid: "2411070721091604700", costCny: 177, deliveryNgn: 30000, sizes: { "W28": { sku: "CJXX218563302BY", vid: "2411070721091603700" }, "W30": { sku: "CJXX218563304DW", vid: "2411070721091604300" }, "W32": { sku: "CJXX218563306FU", vid: "2411070721091604700" }, "W34": { sku: "CJXX218563308HS", vid: "2411070721091605100" }, "W36": { sku: "CJXX218563309IR", vid: "2411070721091605200" }, "W38": { sku: "CJXX218563310JQ", vid: "2411070721091605400" } } }
    },
    {
      id: "sky-baggi-light",
      category: "jeans",
      name: "Sky BAGGI",
      variant: "Light Stone",
      index: "03",
      image: "sky-baggi.jpg",
      imageAlt: "Model wearing light blue denim jeans",
      price: 26000,
      description: "Bleached stone wash. Loud fit, zero logos.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX234012402BY", vid: "2503290128001627700", costCny: 81, deliveryNgn: 31000, sizes: { "W28": { sku: "CJXX234012401AZ", vid: "2503290128001627500" }, "W30": { sku: "CJXX234012402BY", vid: "2503290128001627700" }, "W32": { sku: "CJXX234012403CX", vid: "2503290128001627900" }, "W34": { sku: "CJXX234012404DW", vid: "2503290128001628100" }, "W36": { sku: "CJXX234012405EV", vid: "2503290128001628300" }, "W38": { sku: "CJXX234012405EV", vid: "2503290128001628300" } } }
    },
    {
      id: "heavy-hood-black",
      category: "hoodies",
      name: "Heavy Hood",
      variant: "Jet Black",
      index: "01",
      image: "heavy-hood.jpg",
      imageAlt: "Model wearing a black hoodie",
      price: 27000,
      description: "Thick fleece, oversized body, big kangaroo pocket. No logos.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJWY206111507GT", vid: "2406150750401608100", costCny: 87, deliveryNgn: 28000, sizes: {"S":{"sku":"CJWY206111507GT","vid":"2406150750401608100"},"M":{"sku":"CJWY206111508HS","vid":"2406150750401608200"},"L":{"sku":"CJWY206111509IR","vid":"2406150750401608400"},"XL":{"sku":"CJWY206111510JQ","vid":"2406150750401608500"},"XXL":{"sku":"CJWY206111511KP","vid":"2406150750401608700"}} }
    },
    {
      id: "ash-hood-grey",
      category: "hoodies",
      name: "Ash Hood",
      variant: "Washed Grey",
      index: "02",
      image: "ash-hood.jpg",
      imageAlt: "Model wearing a grey hoodie",
      price: 27000,
      description: "Vintage washed grey that pairs with every BAGGI denim.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJWY206111513MN", vid: "2406150750401609000", costCny: 87, deliveryNgn: 28000, sizes: {"S":{"sku":"CJWY206111513MN","vid":"2406150750401609000"},"M":{"sku":"CJWY206111514NM","vid":"2406150750401609100"},"L":{"sku":"CJWY206111515OL","vid":"2406150750401609300"},"XL":{"sku":"CJWY206111516PK","vid":"2406150750401609400"},"XXL":{"sku":"CJWY206111517QJ","vid":"2406150750401609500"}} }
    },
    {
      id: "box-tee-white",
      category: "shirts",
      name: "Box Tee",
      variant: "Off White",
      index: "01",
      image: "box-tee-white.jpg",
      imageAlt: "Model wearing a white t-shirt",
      price: 10000,
      description: "Heavyweight boxy tee with a thick ribbed collar.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJYH206124501AZ", vid: "2406150921401622900", costCny: 30, deliveryNgn: 11500, sizes: {"S":{"sku":"CJYH206124501AZ","vid":"2406150921401622900"},"M":{"sku":"CJYH206124502BY","vid":"2406150921401623100"},"L":{"sku":"CJYH206124503CX","vid":"2406150921401623300"},"XL":{"sku":"CJYH206124504DW","vid":"2406150921401623500"},"XXL":{"sku":"CJYH206124505EV","vid":"2406150921401623700"}} }
    },
    {
      id: "box-tee-black",
      category: "shirts",
      name: "Box Tee",
      variant: "Faded Black",
      index: "02",
      image: "box-tee-black.jpg",
      imageAlt: "Model wearing a black t-shirt",
      price: 11000,
      description: "Same boxy cut, washed for a soft, faded black.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJYH206124506FU", vid: "2406150921401623800", costCny: 30, deliveryNgn: 10500, sizes: {"S":{"sku":"CJYH206124506FU","vid":"2406150921401623800"},"M":{"sku":"CJYH206124507GT","vid":"2406150921401624000"},"L":{"sku":"CJYH206124508HS","vid":"2406150921401624200"},"XL":{"sku":"CJYH206124509IR","vid":"2406150921401624400"},"XXL":{"sku":"CJYH206124510JQ","vid":"2406150921401624600"}} }
    },
    {
      id: "gods-plan-tee",
      category: "shirts",
      name: "God's Plan Tee",
      variant: "Off White",
      index: "03",
      image: "gods-plan-tee.jpg",
      imageAlt: "White t-shirt with black and white paint splat design",
      price: 10000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: false,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJYH206124501AZ", vid: "2406150921401622900", costCny: 30, deliveryNgn: 11500, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp.", sizes: {"S":{"sku":"CJYH206124501AZ","vid":"2406150921401622900"},"M":{"sku":"CJYH206124502BY","vid":"2406150921401623100"},"L":{"sku":"CJYH206124503CX","vid":"2406150921401623300"},"XL":{"sku":"CJYH206124504DW","vid":"2406150921401623500"},"XXL":{"sku":"CJYH206124505EV","vid":"2406150921401623700"}} }
    },

    /* ---------- New streetwear ---------- */
    {
      id: "cargo-olive",
      category: "cargo",
      name: "Cargo Pant",
      variant: "Olive",
      index: "01",
      image: "cargo-olive.jpg",
      imageAlt: "Model wearing olive cargo pants",
      price: 35000,
      description: "Wide-leg cargo pants with deep utility pockets. Heavy cotton.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX214169402BY", vid: "2409190824521617300", costCny: 119, deliveryNgn: 33500, sizes: { "W28": { sku: "CJXX214169401AZ", vid: "2409190824521617100" }, "W30": { sku: "CJXX214169402BY", vid: "2409190824521617300" }, "W32": { sku: "CJXX214169403CX", vid: "2409190824521617700" }, "W34": { sku: "CJXX214169404DW", vid: "2409190824521617900" }, "W36": { sku: "CJXX214169405EV", vid: "2409190824521618100" }, "W38": { sku: "CJXX214169405EV", vid: "2409190824521618100" } } }
    },
    {
      id: "denim-jacket",
      category: "outerwear",
      name: "BAGGI Jacket",
      variant: "Mid Indigo",
      index: "01",
      image: "baggi-jacket.jpg",
      imageAlt: "Model wearing a denim jacket",
      price: 30000,
      description: "Boxy 14oz denim jacket, cut to layer over every hoodie.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXZ106624614NM", vid: "1378909718768128000", costCny: 92, deliveryNgn: 35000, sizes: { "S": { sku: "CJXZ106624613MN", vid: "1378909718701019136" }, "M": { sku: "CJXZ106624614NM", vid: "1378909718768128000" }, "L": { sku: "CJXZ106624615OL", vid: "1378909718835236864" }, "XL": { sku: "CJXZ106624616PK", vid: "1378909718902345728" }, "XXL": { sku: "CJXZ106624617QJ", vid: "1378909719003009024" } } }
    },
    {
      id: "baggy-shorts",
      category: "cargo",
      name: "BAGGI Short",
      variant: "Washed Black",
      index: "02",
      image: "baggi-short.jpg",
      imageAlt: "Model wearing black denim shorts",
      price: 14000,
      description: "Knee-length wide shorts with the same heavy wash as Night BAGGI.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX207177202BY", vid: "2406290914111627100", costCny: 43, deliveryNgn: 15000, sizes: { "S": { sku: "CJXX207177201AZ", vid: "2406290914111626700" }, "M": { sku: "CJXX207177202BY", vid: "2406290914111627100" }, "L": { sku: "CJXX207177203CX", vid: "2406290914111627300" }, "XL": { sku: "CJXX207177204DW", vid: "2406290914111627500" }, "XXL": { sku: "CJXX207177205EV", vid: "2406290914111627700" } } }
    },
    {
      id: "long-sleeve-white",
      category: "shirts",
      name: "Long Sleeve",
      variant: "Off White",
      index: "04",
      image: "long-sleeve.jpg",
      imageAlt: "Model wearing a white long sleeve top",
      price: 16000,
      description: "Heavyweight long sleeve with a boxy body and ribbed cuffs.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJDS1836000-White-M", vid: "1697504300173774853", costCny: 53, deliveryNgn: 14500, sizes: { "S": { sku: "CJDS1836000-White-S", vid: "1697504300173774848" }, "M": { sku: "CJDS1836000-White-M", vid: "1697504300173774853" }, "L": { sku: "CJDS1836000-White-L", vid: "1697504300173774858" }, "XL": { sku: "CJDS1836000-White-XL", vid: "1697504300173774863" }, "XXL": { sku: "CJDS1836000-White-2XL", vid: "1697504300173774868" } } }
    },
    {
      id: "bucket-hat",
      category: "accessories",
      name: "Bucket Hat",
      variant: "Jet Black",
      index: "01",
      image: "bucket-hat.jpg",
      imageAlt: "Model wearing a black bucket hat",
      price: 7500,
      description: "Plain heavy cotton bucket hat. One size, made to match.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJBQ220327102BY", vid: "2411210815431610700", costCny: 25, deliveryNgn: 5000 }
    },
    {
      id: "canvas-tote",
      category: "accessories",
      name: "Canvas Tote",
      variant: "Natural",
      index: "02",
      image: "canvas-tote.jpg",
      imageAlt: "Model holding a canvas tote bag",
      price: 14000,
      description: "Plain natural canvas tote with long straps. One size. Sold blank.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJYD235483101AZ", vid: "2504160359071611600", costCny: 44, deliveryNgn: 7500, note: "CJ natural canvas tote, exact colour match" }
    },

    /* ---------- Custom / print-on-demand ---------- */
    {
      id: "custom-jeans",
      category: "custom",
      name: "Custom BAGGI Jeans",
      variant: "Your design",
      index: "01",
      image: "custom-jeans.jpg",
      imageAlt: "Model wearing custom denim jeans",
      price: 34000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: false,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJXX214221302BY", vid: "2409200336291616600", costCny: 106, deliveryNgn: 35500, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp.", sizes: { "W28": { sku: "CJXX214221301AZ", vid: "2409200336291616400" }, "W30": { sku: "CJXX214221302BY", vid: "2409200336291616600" }, "W32": { sku: "CJXX214221303CX", vid: "2409200336291616700" }, "W34": { sku: "CJXX214221304DW", vid: "2409200336291616900" }, "W36": { sku: "CJXX214221305EV", vid: "2409200336291617100" }, "W38": { sku: "CJXX214221305EV", vid: "2409200336291617100" } } }
    },
    {
      id: "custom-tee",
      category: "custom",
      name: "Custom Box Tee",
      variant: "Your design",
      index: "02",
      image: "custom-tee.jpg",
      imageAlt: "T-shirt with custom paint splat design",
      price: 11000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: true,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJYH206124501AZ", vid: "2406150921401622900", costCny: 30, deliveryNgn: 10500, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp.", sizes: {"S":{"sku":"CJYH206124501AZ","vid":"2406150921401622900"},"M":{"sku":"CJYH206124502BY","vid":"2406150921401623100"},"L":{"sku":"CJYH206124503CX","vid":"2406150921401623300"},"XL":{"sku":"CJYH206124504DW","vid":"2406150921401623500"},"XXL":{"sku":"CJYH206124505EV","vid":"2406150921401623700"}} }
    },
    {
      id: "custom-hoodie",
      category: "custom",
      name: "Custom Heavy Hood",
      variant: "Your design",
      index: "03",
      image: "custom-hoodie.jpg",
      imageAlt: "Black hoodie with custom white deer design",
      price: 28000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: false,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJWY206111507GT", vid: "2406150750401608100", costCny: 87, deliveryNgn: 27000, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp.", sizes: {"S":{"sku":"CJWY206111507GT","vid":"2406150750401608100"},"M":{"sku":"CJWY206111508HS","vid":"2406150750401608200"},"L":{"sku":"CJWY206111509IR","vid":"2406150750401608400"},"XL":{"sku":"CJWY206111510JQ","vid":"2406150750401608500"},"XXL":{"sku":"CJWY206111511KP","vid":"2406150750401608700"}} }
    },
    {
      id: "custom-mug",
      category: "custom",
      name: "Custom Mug",
      variant: "Your design",
      index: "04",
      image: "custom-mug.jpg",
      imageAlt: "Person holding a custom printed mug",
      price: 7000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: false,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJYD225590702BY", vid: "2412280733131621000", costCny: 16, deliveryNgn: 19500, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp." }
    },
    {
      id: "custom-poster",
      category: "custom",
      name: "Custom Poster",
      variant: "Your design",
      index: "05",
      image: "custom-poster.jpg",
      imageAlt: "Person holding a custom printed poster",
      price: 2000,
      description:
        "Design preview only. Custom printing is not connected to CJ yet — ask us on WhatsApp before ordering.",
      featured: false,
      customizable: false,
      podPending: true,
      supplier: { type: "cj", sku: "CJZW108595101AZ", vid: "1383962869925810176", costCny: 4, deliveryNgn: 2500, note: "Design preview only — POD not verified; paid CJ checkout disabled. Ask on WhatsApp." }
    },

    /* ---------- Extended collection ---------- */
    {
      id: "sweatpant-black",
      category: "cargo",
      name: "BAGGI Sweat",
      variant: "Washed Black",
      index: "03",
      image: "sweatpant-black.jpg",
      imageAlt: "Model wearing washed black wide-leg sweatpants",
      price: 22000,
      description: "Heavy fleece, wide leg and a plain washed-black finish.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX212921606FU", vid: "2409050811321618800", costCny: 65, deliveryNgn: 23000, note: "Generic CJ match — plain black sweatpant in a similar colourway. Not an exact BAGGI-branded item; check fabric and fit before live orders.", sizes: { "S": { sku: "CJXX212921606FU", vid: "2409050811321618800" }, "M": { sku: "CJXX212921607GT", vid: "2409050811321619100" }, "L": { sku: "CJXX212921608HS", vid: "2409050811321619600" }, "XL": { sku: "CJXX212921609IR", vid: "2409050811331610400" }, "2XL": { sku: "CJXX212921610JQ", vid: "2409050811331610700" } } }
    },
    {
      id: "zip-hoodie-grey",
      category: "hoodies",
      name: "Zip Hood",
      variant: "Washed Grey",
      index: "03",
      image: "zip-hoodie-grey.jpg",
      imageAlt: "Model wearing a washed grey oversized zip-up hoodie",
      price: 32000,
      description: "Oversized heavy fleece zip hoodie with a double-layer hood.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJWY236413905EV", vid: "2504280202111610000", costCny: 95, deliveryNgn: 30000, note: "Generic CJ match — plain washed-grey zip hoodie in a similar colourway. Not an exact BAGGI-branded item; check fabric and fit before live orders.", sizes: { "M": { sku: "CJWY236413905EV", vid: "2504280202111610000" }, "L": { sku: "CJWY236413906FU", vid: "2504280202111610400" }, "XL": { sku: "CJWY236413907GT", vid: "2504280202111611100" }, "2XL": { sku: "CJWY236413908HS", vid: "2504280202111611800" } } }
    },
    {
      id: "denim-shirt-indigo",
      category: "shirts",
      name: "Denim Shirt",
      variant: "Mid Indigo",
      index: "05",
      image: "denim-shirt-indigo.jpg",
      imageAlt: "Model wearing a boxy mid-indigo denim shirt",
      price: 28000,
      description: "Boxy 14oz denim shirt built to layer over a plain tee.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJDS224282901AZ", vid: "2412130724411614100", costCny: 85, deliveryNgn: 30000, note: "Generic CJ match — indigo denim shirt in a similar colourway. Not an exact BAGGI-branded item; check cut and wash before live orders.", sizes: { "M": { sku: "CJDS224282901AZ", vid: "2412130724411614100" }, "L": { sku: "CJDS224282902BY", vid: "2412130724411614300" }, "XL": { sku: "CJDS224282903CX", vid: "2412130724411614500" }, "2XL": { sku: "CJDS224282904DW", vid: "2412130724411614700" }, "3XL": { sku: "CJDS224282905EV", vid: "2412130724411614800" } } }
    },
    {
      id: "cargo-vest-olive",
      category: "outerwear",
      name: "Utility Vest",
      variant: "Olive",
      index: "02",
      image: "cargo-vest-olive.jpg",
      imageAlt: "Model wearing an olive heavy cotton utility vest",
      price: 24000,
      description: "Plain heavy cotton utility vest with deep pockets.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJYD192286225YB", vid: "1736247422583574528", costCny: 72, deliveryNgn: 26000, note: "Generic CJ match — army-green utility vest in a similar colourway. Not an exact BAGGI-branded item; check pockets and fit before live orders.", sizes: { "S": { sku: "CJYD192286225YB", vid: "1736247422583574528" }, "M": { sku: "CJYD192286226ZA", vid: "1736247422633906176" }, "L": { sku: "CJYD192286227AZ", vid: "1736247422675849216" }, "XL": { sku: "CJYD192286228BY", vid: "1736247422721986560" }, "2XL": { sku: "CJYD192286229CX", vid: "1736247422768123904" } } }
    },
    {
      id: "beanie-black",
      category: "accessories",
      name: "BAGGI Beanie",
      variant: "Jet Black",
      index: "03",
      image: "beanie-black.jpg",
      imageAlt: "Plain black ribbed knit beanie",
      price: 6000,
      description: "Plain ribbed knit beanie. One size, no logo.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJRN169931201AZ", vid: "1632633322612469760", costCny: 18, deliveryNgn: 5000, note: "CJ black ribbed beanie, exact colour match", sizes: { "One size": { sku: "CJRN169931201AZ", vid: "1632633322612469760" } } }
    },
    {
      id: "crossbody-bag",
      category: "accessories",
      name: "Crossbody Bag",
      variant: "Jet Black",
      index: "04",
      image: "crossbody-bag.jpg",
      imageAlt: "Model wearing a plain black canvas crossbody bag",
      price: 12000,
      description: "Heavy canvas crossbody bag with a long strap. One size.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJYD206111207GT", vid: "2406150745061606600", costCny: 36, deliveryNgn: 7000, note: "CJ black canvas crossbody bag, exact colour match", sizes: { "One size": { sku: "CJYD206111207GT", vid: "2406150745061606600" } } }
    },
    {
      id: "socks-black",
      category: "accessories",
      name: "BAGGI Socks",
      variant: "Jet Black",
      index: "05",
      image: "socks-black.jpg",
      imageAlt: "Plain black heavy ribbed crew socks",
      price: 4000,
      description: "Heavy ribbed crew socks in plain black. One size.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJWZ220154703CX", vid: "2411200547501613500", costCny: 12, deliveryNgn: 3000, note: "CJ black free-size socks, exact colour match", sizes: { "One size": { sku: "CJWZ220154703CX", vid: "2411200547501613500" } } }
    },
    {
      id: "custom-cap",
      category: "accessories",
      name: "BAGGI Cap",
      variant: "Jet Black",
      index: "06",
      image: "custom-cap.jpg",
      imageAlt: "Plain black heavy cotton cap with an adjustable fit",
      price: 9000,
      description: "Plain black heavy cotton cap with a curved brim and adjustable fit. One size.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJBQ110108101AZ", vid: "1386867611375112192", costCny: 28, deliveryNgn: 6000, note: "CJ black adjustable blank cap, exact colour match", sizes: { "One size": { sku: "CJBQ110108101AZ", vid: "1386867611375112192" } } }
    }
  ],

  /* ---------- Design-your-own form options ---------- */
  designOptions: {
    categories: ["Jeans", "Hoodies", "Shirts"],
    // Reference only. Design previews are never added to the paid bag.
    productMap: {
      Jeans: "custom-jeans",
      Hoodies: "custom-hoodie",
      Shirts: "custom-tee"
    },
    fits: ["Super baggy", "Relaxed baggy", "Straight & wide", "Stacked at the ankle"],
    notice: "Design previews only — custom printing is not connected to CJ. Send your artwork on WhatsApp to confirm a one-off order before any payment."
  }
};
