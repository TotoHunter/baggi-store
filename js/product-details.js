/* BAGGI STORE — extra copy and colour choices for individual product pages.
   Add or edit a product's entry here to change its detail page. */
(function () {
  "use strict";

  var palettes = {
    denim: [
      { name: "Mid Indigo", hex: "#3b5a86" },
      { name: "Washed Black", hex: "#232327" },
      { name: "Light Stone", hex: "#a8b6c6" }
    ],
    hoodie: [
      { name: "Jet Black", hex: "#17171a" },
      { name: "Washed Grey", hex: "#8b8d90" },
      { name: "Off White", hex: "#e8e5dc" }
    ],
    tee: [
      { name: "Off White", hex: "#e8e5dc" },
      { name: "Faded Black", hex: "#2b2b2e" },
      { name: "Olive", hex: "#6b7250" }
    ],
    cargo: [
      { name: "Olive", hex: "#6b7250" },
      { name: "Washed Black", hex: "#232327" },
      { name: "Sand", hex: "#b9a88a" }
    ],
    jacket: [
      { name: "Mid Indigo", hex: "#3b5a86" },
      { name: "Washed Black", hex: "#232327" }
    ],
    hat: [
      { name: "Jet Black", hex: "#17171a" },
      { name: "Off White", hex: "#e8e5dc" },
      { name: "Olive", hex: "#6b7250" }
    ],
    tote: [
      { name: "Natural", hex: "#d8c6a4" },
      { name: "Jet Black", hex: "#17171a" },
      { name: "Olive", hex: "#6b7250" }
    ],
    mug: [
      { name: "White", hex: "#f2f0ea" },
      { name: "Jet Black", hex: "#17171a" }
    ],
    poster: [
      { name: "Matte White", hex: "#f2f0ea" },
      { name: "Matte Black", hex: "#17171a" }
    ],
    sweat: [
      { name: "Washed Black", hex: "#232327" },
      { name: "Washed Grey", hex: "#8b8d90" }
    ],
    zip: [
      { name: "Washed Grey", hex: "#8b8d90" },
      { name: "Jet Black", hex: "#17171a" }
    ],
    denimshirt: [
      { name: "Mid Indigo", hex: "#3b5a86" },
      { name: "Washed Black", hex: "#232327" }
    ],
    vest: [
      { name: "Olive", hex: "#6b7250" },
      { name: "Washed Black", hex: "#232327" }
    ],
    beanie: [
      { name: "Jet Black", hex: "#17171a" }
    ],
    bag: [
      { name: "Jet Black", hex: "#17171a" }
    ],
    socks: [
      { name: "Jet Black", hex: "#17171a" }
    ],
    cap: [
      { name: "Jet Black", hex: "#17171a" }
    ],
    custom: [
      { name: "Your design", hex: "#b9b2a0" }
    ]
  };

  /* BAGGI runs on two brand colours: near-black and electric lime.
     Add lime to every palette so one colour visibly pops out on each
     product page, matching the accent used across the website. */
  var popColour = { name: "BAGGI Lime", hex: "#eaff00", pop: true };
  Object.keys(palettes).forEach(function (key) {
    palettes[key].push(popColour);
  });

  window.BAGGI_PRODUCT_DETAILS = {
    "og-baggi-indigo": {
      colours: palettes.denim,
      story:
        "The pair BAGGI started with. Cut from heavy 14oz denim with a straight, extra-wide leg, it has enough weight to hang clean and enough room to move. The mid indigo wash is plain, deep and made to fade with wear instead of screaming for attention.",
      bullets: [
        "14oz cotton denim, cut extra wide from hip to hem",
        "Classic five-pocket build with a plain back pocket",
        "Mid indigo wash that softens and fades naturally",
        "Made to order in 3–7 days, then tracked to your door"
      ]
    },
    "night-baggi-black": {
      colours: palettes.denim,
      story:
        "A black wash with character. Night BAGGI is the same heavy denim and wide straight cut, washed until the black turns soft and uneven. Every pair ages a little differently, which is exactly the point.",
      bullets: [
        "Heavyweight 14oz denim with a wide straight leg",
        "Faded black wash with natural variation",
        "Reinforced seams and a plain, logo-free finish",
        "Made to order in 3–7 days, then tracked to your door"
      ]
    },
    "sky-baggi-light": {
      colours: palettes.denim,
      story:
        "The loud one, kept plain. A bleached stone wash gives Sky BAGGI a pale, sun-faded look while the cut stays extra wide and the fabric stays heavy. Wear it with a black hoodie and let the denim do the talking.",
      bullets: [
        "14oz cotton denim with an extra-wide straight leg",
        "Light stone wash with a lived-in finish",
        "No logos, no rips, no noise",
        "Made to order in 3–7 days, then tracked to your door"
      ]
    },
    "heavy-hood-black": {
      colours: palettes.hoodie,
      story:
        "Built to sit heavy on the shoulders. Thick fleece, dropped shoulders and an oversized body make this hoodie a layer rather than an afterthought. The kangaroo pocket is deep enough for a phone, keys and both hands.",
      bullets: [
        "Heavyweight fleece with a brushed inner face",
        "Oversized body with dropped shoulders",
        "Large kangaroo pocket and double-layer hood",
        "Plain finish — no logo, no drawcord branding"
      ]
    },
    "ash-hood-grey": {
      colours: palettes.hoodie,
      story:
        "Our heavy hood in a vintage washed grey. The wash gives the fleece a soft, broken-in feel from day one, and the grey pairs with every denim wash in the BAGGI line-up.",
      bullets: [
        "Heavyweight fleece with a vintage wash",
        "Oversized boxy body and dropped shoulders",
        "Deep kangaroo pocket, double-layer hood",
        "Plain finish made to layer over any tee"
      ]
    },
    "box-tee-white": {
      colours: palettes.tee,
      story:
        "A tee with actual structure. Heavyweight cotton and a thick ribbed collar keep the boxy shape wash after wash. Off white is the cleanest base in the collection — wear it alone or under the Heavy Hood.",
      bullets: [
        "Heavyweight cotton jersey with a boxy cut",
        "Thick ribbed collar that holds its shape",
        "Off-white colour with a clean plain finish",
        "Made to order in 3–7 days"
      ]
    },
    "box-tee-black": {
      colours: palettes.tee,
      story:
        "The black version of our box tee, washed back for a soft faded finish. Same heavy fabric and thick collar, with a little less contrast and a lot more wearability.",
      bullets: [
        "Heavyweight cotton jersey with a boxy cut",
        "Faded black wash for a broken-in feel",
        "Thick ribbed collar, plain finish",
        "Made to order in 3–7 days"
      ]
    },
    "gods-plan-tee": {
      colours: palettes.tee,
      story:
        "A design preview with a hand-painted feel. GOD'S PLAN sits across the front with black thunder lines and white cracks. Custom printing is not connected to CJ yet, so this piece is previewed here and confirmed on WhatsApp only — no paid CJ order is placed for it.",
      bullets: [
        "Design preview of GOD'S PLAN artwork on a boxy white tee",
        "Black thunder lines and white crack details shown in the preview",
        "WhatsApp only — confirm artwork and one-off production there",
        "Paid CJ checkout is disabled for this preview"
      ]
    },
    "cargo-olive": {
      colours: palettes.cargo,
      story:
        "Utility without the noise. Wide legs, deep utility pockets and heavy cotton give these cargos a relaxed shape that still holds up. Olive is the everyday colour; black and sand are there when you want a different mood.",
      bullets: [
        "Heavy cotton with a wide-leg relaxed fit",
        "Deep side utility pockets",
        "Elasticated waist with a clean plain finish",
        "Made to order in 3–7 days"
      ]
    },
    "denim-jacket": {
      colours: palettes.jacket,
      story:
        "A boxy 14oz denim jacket cut specifically to go over a hoodie. Structured shoulders and a straight body keep the BAGGI silhouette, while the plain mid-indigo finish works over everything from tees to heavy fleece.",
      bullets: [
        "14oz structured denim",
        "Boxy cut that layers over a hoodie",
        "Plain front with no branded patches",
        "Made to order in 3–7 days"
      ]
    },
    "baggy-shorts": {
      colours: palettes.cargo,
      story:
        "Knee-length wide shorts with the same heavy wash as Night BAGGI. They keep the volume of the full jeans without the length — built for hot days, layered fits and easy movement.",
      bullets: [
        "Heavy denim with a wide knee-length cut",
        "Washed black finish with natural variation",
        "Plain five-pocket build",
        "Made to order in 3–7 days"
      ]
    },
    "long-sleeve-white": {
      colours: palettes.tee,
      story:
        "The long sleeve version of our box tee. Heavyweight cotton, a boxy body and ribbed cuffs keep the shape clean. Off white makes it an easy layer under the denim jacket or over a plain tee.",
      bullets: [
        "Heavyweight cotton jersey",
        "Boxy body with ribbed cuffs",
        "Off-white plain finish",
        "Made to order in 3–7 days"
      ]
    },
    "bucket-hat": {
      colours: palettes.hat,
      story:
        "One size, done properly. Heavy cotton, a structured crown and a plain finish make this bucket hat the easiest way to tie a BAGGI fit together.",
      bullets: [
        "Heavy cotton with a structured crown",
        "One size fits most",
        "Plain finish with no logo",
        "Pairs with every BAGGI colourway"
      ]
    },
    "canvas-tote": {
      colours: palettes.tote,
      story:
        "A heavy natural canvas tote with long straps, built for the market, the studio and everything between. It ships plain and blank — no printing is included or sent to CJ.",
      bullets: [
        "Heavy natural canvas",
        "Long shoulder straps",
        "One size, plain blank finish",
        "Sold blank; artwork requests are handled on WhatsApp"
      ]
    },
    "custom-jeans": {
      colours: palettes.custom,
      story:
        "A preview of your artwork on our widest denim. Custom printing is not connected to CJ yet, so this is a design preview only. Send the idea, your size and placement notes on WhatsApp to confirm a one-off order before any payment.",
      bullets: [
        "Design preview — the printed pair is not shipped by CJ",
        "Send artwork, wash and size on WhatsApp",
        "Front, back or both placements discussed in chat",
        "Paid checkout is disabled until POD is verified"
      ]
    },
    "custom-tee": {
      colours: palettes.custom,
      story:
        "A preview of your print on the heavyweight box tee we already know fits right. This is not a paid CJ print order: send your artwork and placement notes on WhatsApp, and we will confirm the one-off order before payment.",
      bullets: [
        "Design preview on a heavyweight boxy tee",
        "WhatsApp-only confirmation — no printed item ships from CJ",
        "Front, back or both placements discussed in chat",
        "Paid checkout is disabled until POD is verified"
      ]
    },
    "custom-hoodie": {
      colours: palettes.custom,
      story:
        "A preview of your artwork on our oversized heavy hood. Printing and embroidery are not connected to CJ, so this preview is confirmed on WhatsApp only. No paid CJ order is placed for it.",
      bullets: [
        "Design preview on a heavy hood blank",
        "Print or embroidery confirmed on WhatsApp",
        "Oversized body with dropped shoulders",
        "Paid checkout is disabled until POD is verified"
      ]
    },
    "custom-mug": {
      colours: palettes.custom,
      story:
        "A preview of your artwork on an 11oz ceramic mug. Custom printing is not connected to CJ, so this is a WhatsApp-only design preview — no printed mug is shipped by CJ.",
      bullets: [
        "Design preview of an 11oz ceramic mug",
        "Send your artwork on WhatsApp to confirm",
        "Blank mug fulfilment only; printing is not included",
        "Paid checkout is disabled until POD is verified"
      ]
    },
    "custom-poster": {
      colours: palettes.custom,
      story:
        "A preview of your design as a matte poster in A2 or A3. Printing is not connected to CJ, so send the artwork and size on WhatsApp to confirm a one-off order before any payment.",
      bullets: [
        "Design preview for an A2 or A3 matte poster",
        "Artwork and size confirmed on WhatsApp",
        "No CJ print order is created from this preview",
        "Paid checkout is disabled until POD is verified"
      ]
    },
    "sweatpant-black": {
      colours: palettes.sweat,
      story:
        "The off-duty half of the BAGGI fit. Heavy fleece with a wide straight leg and a clean washed-black finish, so it hangs with the same weight as the denim and keeps the silhouette going from waist to hem.",
      bullets: [
        "Heavyweight fleece with a brushed inner face",
        "Wide straight leg with an elasticated waist",
        "Plain washed-black finish, no branding",
        "Made to order in 3–7 days"
      ]
    },
    "zip-hoodie-grey": {
      colours: palettes.zip,
      story:
        "All the weight of our Heavy Hood with a full zip for days when you need to open up. Oversized body, dropped shoulders and a double-layer hood, washed back to a soft vintage grey.",
      bullets: [
        "Heavyweight fleece with a vintage grey wash",
        "Full-length zip and double-layer hood",
        "Oversized boxy body with dropped shoulders",
        "Deep kangaroo pocket and plain finish"
      ]
    },
    "denim-shirt-indigo": {
      colours: palettes.denimshirt,
      story:
        "A shirt built like our jeans. The same 14oz indigo denim, cut into a boxy oversized shape that works open over a tee or buttoned up on its own. Plain pockets, plain back, no branding.",
      bullets: [
        "14oz structured denim in mid indigo",
        "Boxy oversized cut that layers easily",
        "Buttoned front with two plain chest pockets",
        "Made to order in 3–7 days"
      ]
    },
    "cargo-vest-olive": {
      colours: palettes.vest,
      story:
        "A layer with somewhere to put things. Heavy cotton, a straight boxy body and deep utility pockets, kept plain so the shape does the talking. Olive is the everyday colourway.",
      bullets: [
        "Heavy cotton with a boxy straight cut",
        "Deep utility pockets front and back",
        "Full zip front, plain unbranded finish",
        "Made to order in 3–7 days"
      ]
    },
    "beanie-black": {
      colours: palettes.beanie,
      story:
        "One size, done properly. A thick ribbed knit beanie with a clean fold and no logo, built to sit under a hood or pull on when the weather turns.",
      bullets: [
        "Thick ribbed knit with a clean fold",
        "One size fits most",
        "Plain finish with no logo",
        "Pairs with every BAGGI colourway"
      ]
    },
    "crossbody-bag": {
      colours: palettes.bag,
      story:
        "The small bag that keeps the basics close. Heavy canvas, an adjustable strap and one clean compartment, finished plain so it works with every fit.",
      bullets: [
        "Heavy canvas with an adjustable long strap",
        "One main compartment with a zip closure",
        "One size, plain finish",
        "Made to order in 3–7 days"
      ]
    },
    "socks-black": {
      colours: palettes.socks,
      story:
        "Heavy ribbed crew socks in plain black. Thick enough to hold their shape and simple enough to disappear under any BAGGI fit.",
      bullets: [
        "Heavyweight ribbed cotton blend",
        "Plain black finish, no branding",
        "One size, easy to pair with any BAGGI fit",
        "Made to order and shipped tracked"
      ]
    },
    "custom-cap": {
      colours: palettes.cap,
      story:
        "A plain black heavy cotton cap with a structured crown and adjustable fit. One size, ready to wear or customise after delivery.",
      bullets: [
        "Plain black finish, no branding",
        "Heavy cotton with a structured crown",
        "Curved brim and adjustable fit",
        "Ships as a blank cap from CJ"
      ]
    }
  };
})();
