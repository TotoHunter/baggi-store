/* ============================================================
   BAGGI STORE — EDIT THIS FILE TO MANAGE YOUR SHOP
   ------------------------------------------------------------
   • Change prices, product names, descriptions and photos here.
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
    instagramUrl: "https://instagram.com",
    instagramHandle: "@baggi.jeans",
    email: "hello@baggi.store"
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
    note: "Delivery is calculated per item from live CJ freight rates and shown at checkout."
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
        enabled: false,
        publicKey: ""
      },
      {
        id: "stripe",
        label: "Stripe",
        description: "International cards",
        enabled: false,
        publicKey: ""
      },
      {
        id: "paypal",
        label: "PayPal",
        description: "Pay with your PayPal account",
        enabled: false,
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
      "Jeans, hoodies, shirts, cargos and custom pieces. All plain, all big. Add to bag or order straight on WhatsApp.",
    aboutEyebrow: "The story",
    aboutTitleTop: "Less",
    aboutTitleMiddle: "noise.",
    aboutTitleBottom: "More leg.",
    aboutParagraphs: [
      "BAGGI started with one idea: the perfect pair of baggy jeans doesn't need a logo on the back pocket. It needs weight, width and a wash that ages right.",
      "Every pair is cut from heavy cotton denim, finished plain, and built to be worn hard — on the street, on the stage, everywhere. Custom pieces are made to order by our production partner."
    ],
    designEyebrow: "Made to order · Pre-order",
    designTitleTop: "Design",
    designTitleBottom: "yours.",
    designText:
      "Pick jeans, a hoodie or a tee and describe the design in your head. We'll turn it into a one-off pre-order made just for you.",
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
    { num: "03", title: "Yours", text: "Plain staples or custom pieces made to order." }
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
    { num: "01", title: "Pick your piece", text: "Browse the collection or design your own. Choose your size and add to bag." },
    { num: "02", title: "Check out securely", text: "Pay with card, bank transfer or WhatsApp. You get an order ID straight away." },
    { num: "03", title: "We make & ship", text: "Your piece is made to order and tracked all the way to your door." }
  ],

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
        "Made to order from your design. Upload or send your artwork after checkout."
    }
  ],

  /* ---------- Your products ----------
     price        = what the customer pays (naira)
     supplier.costCny = what you pay the supplier (yuan)
     supplier.sku = the product code in your supplier account
     customizable = customer can add their own design
  ------------------------------------- */
  products: [
    {
      id: "og-baggi-indigo",
      category: "jeans",
      name: "OG Baggi",
      variant: "Mid Indigo",
      index: "01",
      price: 45000,
      image: "model-jeans-indigo.jpg",
      imageAlt: "OG Baggi in Mid Indigo",
      description: "The everyday one. Heavy 14oz denim, wide straight leg.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX214221302BY", vid: "2409200336291616600", costCny: 106, deliveryNgn: 43440, sizes: { "W28": { sku: "CJXX214221301AZ", vid: "2409200336291616400" }, "W30": { sku: "CJXX214221302BY", vid: "2409200336291616600" }, "W32": { sku: "CJXX214221303CX", vid: "2409200336291616700" }, "W34": { sku: "CJXX214221304DW", vid: "2409200336291616900" }, "W36": { sku: "CJXX214221305EV", vid: "2409200336291617100" }, "W38": { sku: "CJXX214221305EV", vid: "2409200336291617100" } } }
    },
    {
      id: "night-baggi-black",
      category: "jeans",
      name: "Night Baggi",
      variant: "Washed Black",
      index: "02",
      price: 60000,
      image: "model-jeans-black.jpg",
      imageAlt: "Night Baggi in Washed Black",
      description: "Faded black wash that only gets better with wear.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX218563306FU", vid: "2411070721091604700", costCny: 177, deliveryNgn: 31200, sizes: { "W28": { sku: "CJXX218563302BY", vid: "2411070721091603700" }, "W30": { sku: "CJXX218563304DW", vid: "2411070721091604300" }, "W32": { sku: "CJXX218563306FU", vid: "2411070721091604700" }, "W34": { sku: "CJXX218563308HS", vid: "2411070721091605100" }, "W36": { sku: "CJXX218563309IR", vid: "2411070721091605200" }, "W38": { sku: "CJXX218563310JQ", vid: "2411070721091605400" } } }
    },
    {
      id: "sky-baggi-light",
      category: "jeans",
      name: "Sky Baggi",
      variant: "Light Stone",
      index: "03",
      price: 38000,
      image: "model-jeans-light.jpg",
      imageAlt: "Sky Baggi in Light Stone",
      description: "Bleached stone wash. Loud fit, zero logos.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX234012402BY", vid: "2503290128001627700", costCny: 81, deliveryNgn: 36960, sizes: { "W28": { sku: "CJXX234012401AZ", vid: "2503290128001627500" }, "W30": { sku: "CJXX234012402BY", vid: "2503290128001627700" }, "W32": { sku: "CJXX234012403CX", vid: "2503290128001627900" }, "W34": { sku: "CJXX234012404DW", vid: "2503290128001628100" }, "W36": { sku: "CJXX234012405EV", vid: "2503290128001628300" }, "W38": { sku: "CJXX234012405EV", vid: "2503290128001628300" } } }
    },
    {
      id: "heavy-hood-black",
      category: "hoodies",
      name: "Heavy Hood",
      variant: "Jet Black",
      index: "01",
      price: 38000,
      image: "model-hoodie-black.jpg",
      imageAlt: "Heavy Hood in Jet Black",
      description: "Thick fleece, oversized body, big kangaroo pocket. No logos.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJWY236413910JQ", vid: "2504280202111613700", costCny: 87, deliveryNgn: 33120, sizes: { "S": { sku: "CJWY236413909IR", vid: "2504280202111612900" }, "M": { sku: "CJWY236413910JQ", vid: "2504280202111613700" }, "L": { sku: "CJWY236413911KP", vid: "2504280202111614200" }, "XL": { sku: "CJWY236413912LO", vid: "2504280202111614700" }, "XXL": { sku: "CJWY236413912LO", vid: "2504280202111614700" } } }
    },
    {
      id: "ash-hood-grey",
      category: "hoodies",
      name: "Ash Hood",
      variant: "Washed Grey",
      index: "02",
      price: 38000,
      image: "model-hoodie-grey.jpg",
      imageAlt: "Ash Hood in Washed Grey",
      description: "Vintage washed grey that pairs with every BAGGI denim.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJWY236413906FU", vid: "2504280202111610400", costCny: 87, deliveryNgn: 33120, sizes: { "S": { sku: "CJWY236413905EV", vid: "2504280202111610000" }, "M": { sku: "CJWY236413906FU", vid: "2504280202111610400" }, "L": { sku: "CJWY236413907GT", vid: "2504280202111611100" }, "XL": { sku: "CJWY236413908HS", vid: "2504280202111611800" }, "XXL": { sku: "CJWY236413908HS", vid: "2504280202111611800" } } }
    },
    {
      id: "box-tee-white",
      category: "shirts",
      name: "Box Tee",
      variant: "Off White",
      index: "01",
      price: 14000,
      image: "model-tee-white.jpg",
      imageAlt: "Box Tee in Off White",
      description: "Heavyweight boxy tee with a thick ribbed collar.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJDS212420102BY", vid: "2408300732091605400", costCny: 30, deliveryNgn: 11280, sizes: { "S": { sku: "CJDS212420101AZ", vid: "2408300732091605200" }, "M": { sku: "CJDS212420102BY", vid: "2408300732091605400" }, "L": { sku: "CJDS212420103CX", vid: "2408300732091605500" }, "XL": { sku: "CJDS212420104DW", vid: "2408300732091605700" }, "XXL": { sku: "CJDS212420105EV", vid: "2408300732091605900" } } }
    },
    {
      id: "box-tee-black",
      category: "shirts",
      name: "Box Tee",
      variant: "Faded Black",
      index: "02",
      price: 15000,
      image: "model-tee-black.jpg",
      imageAlt: "Box Tee in Faded Black",
      description: "Same boxy cut, washed for a soft, faded black.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJDS212420122VE", vid: "2505280837081610500", costCny: 30, deliveryNgn: 13200, sizes: { "S": { sku: "CJDS212420123WD", vid: "2505280837081610700" }, "M": { sku: "CJDS212420122VE", vid: "2505280837081610500" }, "L": { sku: "CJDS212420121UF", vid: "2505280837081610300" }, "XL": { sku: "CJDS212420124XC", vid: "2505280837081610900" }, "XXL": { sku: "CJDS212420117QJ", vid: "2505280837071619500" } } }
    },
    {
      id: "gods-plan-tee",
      category: "shirts",
      name: "God's Plan Tee",
      variant: "White · Hand-painted",
      index: "03",
      price: 14000,
      image: "model-tee-gods-plan.jpg",
      imageAlt: "God's Plan Tee in White · Hand-painted",
      description:
        "Pre-order. Boxy white tee with GOD'S PLAN, black thunder lines and white cracks.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJDS212420102BY", vid: "2408300732091605400", costCny: 30, deliveryNgn: 11280, sizes: { "S": { sku: "CJDS212420101AZ", vid: "2408300732091605200" }, "M": { sku: "CJDS212420102BY", vid: "2408300732091605400" }, "L": { sku: "CJDS212420103CX", vid: "2408300732091605500" }, "XL": { sku: "CJDS212420104DW", vid: "2408300732091605700" }, "XXL": { sku: "CJDS212420105EV", vid: "2408300732091605900" } } }
    },

    /* ---------- New streetwear ---------- */
    {
      id: "cargo-olive",
      category: "cargo",
      name: "Cargo Pant",
      variant: "Olive",
      index: "01",
      price: 48000,
      image: "model-cargo-olive.jpg",
      imageAlt: "Olive baggy cargo pants",
      description: "Wide-leg cargo pants with deep utility pockets. Heavy cotton.",
      featured: true,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX214169402BY", vid: "2409190824521617300", costCny: 119, deliveryNgn: 38640, sizes: { "W28": { sku: "CJXX214169401AZ", vid: "2409190824521617100" }, "W30": { sku: "CJXX214169402BY", vid: "2409190824521617300" }, "W32": { sku: "CJXX214169403CX", vid: "2409190824521617700" }, "W34": { sku: "CJXX214169404DW", vid: "2409190824521617900" }, "W36": { sku: "CJXX214169405EV", vid: "2409190824521618100" }, "W38": { sku: "CJXX214169405EV", vid: "2409190824521618100" } } }
    },
    {
      id: "denim-jacket",
      category: "outerwear",
      name: "Baggi Jacket",
      variant: "Mid Indigo",
      index: "01",
      price: 45000,
      image: "model-denim-jacket.jpg",
      imageAlt: "Oversized mid indigo denim jacket",
      description: "Boxy 14oz denim jacket, cut to layer over every hoodie.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXZ106624614NM", vid: "1378909718768128000", costCny: 92, deliveryNgn: 41760, sizes: { "S": { sku: "CJXZ106624613MN", vid: "1378909718701019136" }, "M": { sku: "CJXZ106624614NM", vid: "1378909718768128000" }, "L": { sku: "CJXZ106624615OL", vid: "1378909718835236864" }, "XL": { sku: "CJXZ106624616PK", vid: "1378909718902345728" }, "XXL": { sku: "CJXZ106624617QJ", vid: "1378909719003009024" } } }
    },
    {
      id: "baggy-shorts",
      category: "cargo",
      name: "Baggi Short",
      variant: "Washed Black",
      index: "02",
      price: 20000,
      image: "model-baggy-shorts.jpg",
      imageAlt: "Washed black baggy shorts",
      description: "Knee-length wide shorts with the same heavy wash as Night Baggi.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJXX207177202BY", vid: "2406290914111627100", costCny: 43, deliveryNgn: 18000, sizes: { "S": { sku: "CJXX207177201AZ", vid: "2406290914111626700" }, "M": { sku: "CJXX207177202BY", vid: "2406290914111627100" }, "L": { sku: "CJXX207177203CX", vid: "2406290914111627300" }, "XL": { sku: "CJXX207177204DW", vid: "2406290914111627500" }, "XXL": { sku: "CJXX207177205EV", vid: "2406290914111627700" } } }
    },
    {
      id: "long-sleeve-white",
      category: "shirts",
      name: "Long Sleeve",
      variant: "Off White",
      index: "04",
      price: 22000,
      image: "model-long-sleeve.jpg",
      imageAlt: "Off white heavyweight long sleeve tee",
      description: "Heavyweight long sleeve with a boxy body and ribbed cuffs.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJDS1836000-White-M", vid: "1697504300173774853", costCny: 53, deliveryNgn: 17280, sizes: { "S": { sku: "CJDS1836000-White-S", vid: "1697504300173774848" }, "M": { sku: "CJDS1836000-White-M", vid: "1697504300173774853" }, "L": { sku: "CJDS1836000-White-L", vid: "1697504300173774858" }, "XL": { sku: "CJDS1836000-White-XL", vid: "1697504300173774863" }, "XXL": { sku: "CJDS1836000-White-2XL", vid: "1697504300173774868" } } }
    },
    {
      id: "bucket-hat",
      category: "accessories",
      name: "Bucket Hat",
      variant: "Jet Black",
      index: "01",
      price: 9000,
      image: "model-bucket-hat.jpg",
      imageAlt: "Black bucket hat",
      description: "Plain heavy cotton bucket hat. One size, made to match.",
      featured: false,
      customizable: false,
      supplier: { type: "cj", sku: "CJBQ220327102BY", vid: "2411210815431610700", costCny: 25, deliveryNgn: 6240 }
    },
    {
      id: "canvas-tote",
      category: "accessories",
      name: "Canvas Tote",
      variant: "Natural",
      index: "02",
      price: 18000,
      image: "model-tote-bag.jpg",
      imageAlt: "Natural canvas tote bag",
      description: "Heavy natural canvas tote with long straps. One size.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJYD210245719SH", vid: "2408050905501606200", costCny: 44, deliveryNgn: 13200 }
    },

    /* ---------- Custom / print-on-demand ---------- */
    {
      id: "custom-jeans",
      category: "custom",
      name: "Custom Baggi Jeans",
      variant: "Your design",
      index: "01",
      price: 48000,
      image: "model-custom-jeans.jpg",
      imageAlt: "Custom made baggy jeans",
      description: "Send your artwork or idea. We make a one-off pair just for you.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJXX214221302BY", vid: "2409200336291616600", costCny: 106, deliveryNgn: 43440, note: "blank for custom print", sizes: { "W28": { sku: "CJXX214221301AZ", vid: "2409200336291616400" }, "W30": { sku: "CJXX214221302BY", vid: "2409200336291616600" }, "W32": { sku: "CJXX214221303CX", vid: "2409200336291616700" }, "W34": { sku: "CJXX214221304DW", vid: "2409200336291616900" }, "W36": { sku: "CJXX214221305EV", vid: "2409200336291617100" }, "W38": { sku: "CJXX214221305EV", vid: "2409200336291617100" } } }
    },
    {
      id: "custom-tee",
      category: "custom",
      name: "Custom Box Tee",
      variant: "Your design",
      index: "02",
      price: 15000,
      image: "model-custom-tee.jpg",
      imageAlt: "Custom printed boxy tee",
      description: "Your print on a heavyweight boxy tee. Front, back or both.",
      featured: true,
      customizable: true,
      supplier: { type: "cj", sku: "CJDS212420102BY", vid: "2408300732091605400", costCny: 30, deliveryNgn: 11280, note: "blank for custom print", sizes: { "S": { sku: "CJDS212420101AZ", vid: "2408300732091605200" }, "M": { sku: "CJDS212420102BY", vid: "2408300732091605400" }, "L": { sku: "CJDS212420103CX", vid: "2408300732091605500" }, "XL": { sku: "CJDS212420104DW", vid: "2408300732091605700" }, "XXL": { sku: "CJDS212420105EV", vid: "2408300732091605900" } } }
    },
    {
      id: "custom-hoodie",
      category: "custom",
      name: "Custom Heavy Hood",
      variant: "Your design",
      index: "03",
      price: 40000,
      image: "model-custom-hoodie.jpg",
      imageAlt: "Custom printed oversized hoodie",
      description: "Your design printed or embroidered on our oversized heavy hood.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJWY236413910JQ", vid: "2504280202111613700", costCny: 87, deliveryNgn: 33120, note: "blank for custom print", sizes: { "S": { sku: "CJWY236413909IR", vid: "2504280202111612900" }, "M": { sku: "CJWY236413910JQ", vid: "2504280202111613700" }, "L": { sku: "CJWY236413911KP", vid: "2504280202111614200" }, "XL": { sku: "CJWY236413912LO", vid: "2504280202111614700" }, "XXL": { sku: "CJWY236413912LO", vid: "2504280202111614700" } } }
    },
    {
      id: "custom-mug",
      category: "custom",
      name: "Custom Mug",
      variant: "Your design",
      index: "04",
      price: 12000,
      image: "model-custom-mug.jpg",
      imageAlt: "Custom printed mug",
      description: "11oz ceramic mug printed with your artwork.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJYD225590702BY", vid: "2412280733131621000", costCny: 16, deliveryNgn: 22080 }
    },
    {
      id: "custom-poster",
      category: "custom",
      name: "Custom Poster",
      variant: "Your design",
      index: "05",
      price: 3500,
      image: "model-custom-poster.jpg",
      imageAlt: "Custom printed poster",
      description: "A2/A3 matte poster printed from your design.",
      featured: false,
      customizable: true,
      supplier: { type: "cj", sku: "CJZW108595101AZ", vid: "1383962869925810176", costCny: 4, deliveryNgn: 3360 }
    }
  ],

  /* ---------- Design-your-own form options ---------- */
  designOptions: {
    categories: ["Jeans", "Hoodies", "Shirts"],
    // Which catalog product receives a custom design from each option
    productMap: {
      Jeans: "custom-jeans",
      Hoodies: "custom-hoodie",
      Shirts: "custom-tee"
    },
    fits: ["Super baggy", "Relaxed baggy", "Straight & wide", "Stacked at the ankle"]
  }
};
