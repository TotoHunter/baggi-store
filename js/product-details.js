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
    ]
  };

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
        "A pre-order piece with a hand-painted feel. GOD'S PLAN sits across the front with black thunder lines and white cracks, printed on our heavyweight boxy white tee. Each run is limited and made after you order.",
      bullets: [
        "Heavyweight boxy white tee",
        "Hand-painted GOD'S PLAN artwork with thunder lines",
        "Pre-order: made to order after checkout",
        "Plain back, no extra branding"
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
        "A heavy natural canvas tote with long straps, built for the market, the studio and everything between. Plain by design, and customisable if you want your own artwork on it.",
      bullets: [
        "Heavy natural canvas",
        "Long shoulder straps",
        "One size, plain finish",
        "Add your own design with the custom option"
      ]
    },
    "custom-jeans": {
      colours: palettes.denim,
      story:
        "Your artwork on our widest denim. Send an idea, a logo or a full graphic and we place it on a one-off pair made to your size. Choose your base wash and tell us where you want the print.",
      bullets: [
        "One-off pair made to your design",
        "Choose mid indigo, washed black or light stone",
        "Front, back or both placements",
        "Made to order in 3–7 days"
      ]
    },
    "custom-tee": {
      colours: palettes.tee,
      story:
        "Your print on the heavyweight box tee we already know fits right. Send your artwork and placement notes after checkout; we print it on a fresh blank and make only what you order.",
      bullets: [
        "Your design on a heavyweight boxy tee",
        "Choose off white, faded black or olive",
        "Front, back or both placements",
        "Made to order in 3–7 days"
      ]
    },
    "custom-hoodie": {
      colours: palettes.hoodie,
      story:
        "Our oversized heavy hood, made yours. Printed or embroidered artwork on a blank built with dropped shoulders and a deep pocket. Pick the base colour and send the design after checkout.",
      bullets: [
        "Your design printed or embroidered",
        "Choose jet black, washed grey or off white",
        "Oversized body with dropped shoulders",
        "Made to order in 3–7 days"
      ]
    },
    "custom-mug": {
      colours: palettes.mug,
      story:
        "An 11oz ceramic mug printed with your artwork. Simple, solid and made for daily use — a small way to put your design on something you reach for every morning.",
      bullets: [
        "11oz ceramic mug",
        "Printed with your artwork",
        "Choose white or jet black",
        "Made to order"
      ]
    },
    "custom-poster": {
      colours: palettes.poster,
      story:
        "A matte poster printed from your design, available in A2 or A3. Send the artwork after checkout and tell us the size you want. No frames, no fuss — just the print.",
      bullets: [
        "A2 or A3 matte print",
        "Your artwork, printed to order",
        "Choose matte white or matte black stock",
        "Ships flat and tracked"
      ]
    }
  };
})();
