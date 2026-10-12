export type Tag = 'V' | 'VG' | 'GF'

export interface Dish {
  name: string
  desc?: string
  price?: string
  tags?: Tag[]
}

export interface MenuSection {
  id: string
  title: string
  note?: string
  price?: string
  items: Dish[]
}

export const BAR_SNACKS: MenuSection = {
  id: 'snacks',
  title: 'Bar snacks',
  items: [
    {
      name: "Mac 'n' cheese croquettes",
      desc: 'Gluten-free breadcrumb and pasta, creamy three-cheese sauce',
      price: '£7.50',
      tags: ['V', 'GF'],
    },
    {
      name: 'Smoked chilli calamari',
      desc: 'Spring onion, Spanish chilli, sweet chilli-soy dressing',
      price: '£8.50',
    },
    {
      name: 'Crispy pork bites',
      desc: 'Slow-roasted pork belly, spicy Caesar dip',
      price: '£9.50',
    },
    {
      name: 'Honey & mustard mini sausages',
      desc: 'Mini Cumberlands, acacia honey, wholegrain mustard',
      price: '£8.50',
    },
    {
      name: 'Beer-battered cod goujons',
      desc: 'Lemon, tartare sauce',
      price: '£8.50',
    },
    {
      name: 'Whole baked petite Camembert',
      desc: 'Toasted hazelnuts, acacia honey, toasted sourdough',
      price: '£8.50',
      tags: ['V'],
    },
    {
      name: 'Mini mixed board',
      desc: 'Homemade hummus, marinated olives, toasted pitta',
      price: '£7.95',
      tags: ['V'],
    },
    {
      name: 'Halloumi fries',
      desc: 'Pomegranate, spring onion, Spanish chilli, lemon, smoky chipotle sauce',
      price: '£7.95',
    },
    {
      name: 'Truffle & Parmesan tater tots',
      desc: 'White truffle, Grana Padano, creamy truffle mayo',
      price: '£7.95',
      tags: ['V'],
    },
    {
      name: 'Mexican sweet potato fries',
      desc: 'Nacho cheese sauce, jalapeños, chunky salsa, sour cream',
      price: '£8.95',
      tags: ['V'],
    },
    {
      name: 'Hot buffalo wings',
      desc: 'Celery, blue cheese dip',
      price: '£8.50',
    },
    {
      name: 'Spicy BBQ wings',
      desc: 'Celery, blue cheese dip',
      price: '£8.50',
    },
    {
      name: 'Smoky corn ribs',
      desc: 'Grana Padano, smoked paprika, chipotle sauce',
      price: '£6.95',
      tags: ['V'],
    },
    {
      name: 'Vegan sausage roll',
      desc: 'Puff pastry, pea protein and oyster mushroom sausage, vegan honey-mustard mayo',
      price: '£7.50',
      tags: ['VG'],
    },
  ],
}

export const MAINS: MenuSection = {
  id: 'mains',
  title: 'Mains',
  note: 'Burgers, hotdog and wrap come with skinny fries and house dip. Burgers come on a toasted brioche bun.',
  items: [
    {
      name: 'The Vic Wagyu beef burger',
      desc: 'Mild cheddar, smoky bacon, Boston lettuce, vine tomato, caramelised and red onion',
      price: '£20.50',
    },
    {
      name: 'Grilled halloumi & roast pepper burger',
      price: '£17.95',
      tags: ['V'],
    },
    { name: 'Chicken fillet & Spanish chorizo burger', price: '£17.95' },
    { name: 'BBQ pulled pork & coleslaw burger', price: '£17.95' },
    {
      name: 'Beer-battered cod burger',
      desc: 'Boston lettuce, vine tomato, red onion',
      price: '£15.95',
    },
    {
      name: 'Loaded gourmet hotdog',
      desc: 'Wild boar sausage, caramelised onion, cheddar, jalapeños, pickles, wild rocket, ketchup, American mustard',
      price: '£15.95',
    },
    {
      name: 'Grilled chicken Caesar wrap',
      desc: 'Smoked streaky bacon, Boston lettuce, Caesar dressing, Grana Padano',
      price: '£16.50',
    },
    {
      name: "Baked goat's cheese & beetroot salad",
      desc: 'Toasted walnuts, mixed leaves, balsamic glaze, pomegranate, pesto dressing',
      price: '£14.95',
      tags: ['V'],
    },
    {
      name: 'Grilled chicken Caesar salad',
      desc: 'Streaky bacon, Boston lettuce, Parmesan, croutons, boiled egg, anchovies',
      price: '£15.50',
    },
    {
      name: 'Black Angus ribeye 330g',
      desc: 'Hand-cut chips, house dip, sautéed field mushroom, roast tomato, wild rocket',
      price: '£26.95',
    },
    {
      name: 'Donald Russell sausage & mash',
      desc: "Chef's red wine jus, crispy red onions",
      price: '£16.95',
    },
    {
      name: "Mac 'n' cheese with black summer truffle",
      desc: 'Curly macaroni, smoked streaky bacon, three-cheese sauce, white truffle oil (veggie option available)',
      price: '£14.50',
    },
    {
      name: 'Beer-battered cod & chips',
      desc: 'Chunky chips, tartare, mushy peas, lemon',
      price: '£16.95',
    },
  ],
}

export const SIDES: MenuSection = {
  id: 'sides',
  title: 'Sides',
  price: '£4.95 each',
  items: [
    { name: 'Tenderstem broccoli', tags: ['VG'] },
    { name: 'Creamy mash' },
    { name: 'Chunky coleslaw' },
    { name: 'Wild rocket & Parmesan salad' },
    { name: 'Skin-on fries with house dip', tags: ['V'] },
    { name: 'Chunky chips with tartare' },
    { name: 'Sweet potato fries with house dip', price: '£5.95', tags: ['V'] },
  ],
}

export const DESSERTS: MenuSection = {
  id: 'desserts',
  title: 'Desserts',
  price: '£7.50 each',
  items: [
    { name: 'Frozen raspberry soufflé' },
    { name: 'Chocolate & caramel salty duo' },
    { name: 'Sticky toffee pudding', tags: ['GF'] },
    { name: 'Mini Nutella doughnut balls' },
    { name: 'Oreo doughnuts with Biscoff dipping sauce', tags: ['V'] },
    {
      name: 'Frozen salted pistachio semifreddo with white chocolate curls',
      tags: ['V'],
    },
  ],
}

export const VEGAN: MenuSection = {
  id: 'vegan',
  title: 'Vegan',
  note: 'All served with skinny fries and spicy vegan house dip.',
  items: [
    {
      name: 'Vegan cheeseburger',
      desc: 'Moving Mountains patty, toasted vegan bun, caramelised and red onion, Boston lettuce, spicy vegan mayo',
      price: '£16.95',
      tags: ['VG'],
    },
    {
      name: 'Spicy BBQ jackfruit burger',
      desc: 'With vegan coleslaw',
      price: '£16.50',
      tags: ['VG'],
    },
    {
      name: 'Loaded vegan hotdog',
      desc: 'Moving Mountains sausage, vegan cheese, caramelised onion, jalapeños, pickles, wild rocket, ketchup, American mustard',
      price: '£16.95',
      tags: ['VG'],
    },
    {
      name: 'Vegan cheese & falafel wrap',
      desc: 'Hummus, red cabbage slaw, with sweet potato fries and salsa dip (instead of skinny fries)',
      price: '£16.95',
      tags: ['VG'],
    },
  ],
}

/** Vegan dishes that live elsewhere on the menu, shown on the vegan tab too. */
export const VEGAN_ELSEWHERE: MenuSection = {
  id: 'vegan-also',
  title: 'Also vegan',
  items: [
    {
      name: 'Vegan sausage roll',
      desc: 'Bar snacks',
      price: '£7.50',
      tags: ['VG'],
    },
    {
      name: 'Tenderstem broccoli',
      desc: 'Sides',
      price: '£4.95',
      tags: ['VG'],
    },
  ],
}

export const BRUNCH: MenuSection = {
  id: 'brunch',
  title: 'Saturday brunch',
  note: 'Saturdays, 12–4pm.',
  items: [
    {
      name: 'Full English',
      desc: 'Sausage, bacon, tomato, hash brown, eggs',
      price: '£12.50',
    },
    {
      name: 'Eggs Benedict',
      desc: 'Ham, English muffin, poached eggs, hollandaise',
      price: '£12.50',
    },
    {
      name: 'Eggs Royale',
      desc: 'Smoked salmon, English muffin, poached eggs, hollandaise',
      price: '£12.95',
    },
    {
      name: 'Eggs Florentine',
      desc: 'Spinach, poached eggs, hollandaise',
      price: '£12.95',
    },
    {
      name: 'Smoked kipper',
      desc: 'Poached eggs, toasted sourdough, lemon butter',
      price: '£12.25',
    },
    {
      name: 'The Frenchie',
      desc: 'Ham, fried egg, croissant, béchamel',
      price: '£9.25',
    },
    {
      name: 'Bacon roll',
      desc: 'Bacon, croissant, brown sauce',
      price: '£8.25',
    },
    {
      name: 'Veggie full',
      desc: 'Spinach, veggie sausage, tomato, mushroom, hash brown, eggs',
      price: '£11.95',
    },
    {
      name: 'Slutty eggs',
      desc: 'Nduja, tomato, peppers, sourdough',
      price: '£12.95',
    },
  ],
}

export const ROAST: MenuSection = {
  id: 'roast',
  title: 'Sunday roast',
  note: "Sundays, 12–9pm, subject to availability. Every roast comes with Yorkshire pudding, parsnips, carrots, roast potatoes, broccoli and chef's red wine jus.",
  items: [
    {
      name: 'Slow-roasted pork belly & crackling',
      desc: 'White wine reduction',
      price: '£19.95',
    },
    { name: 'Black Angus sirloin', desc: 'Served rare', price: '£21.95' },
    {
      name: 'Herb-roasted free-range chicken',
      desc: 'White wine reduction',
      price: '£18.95',
    },
    {
      name: 'Plant-based beef roast',
      desc: 'Vegetable red wine jus',
      price: '£17.50',
      tags: ['V'],
    },
  ],
}

export interface Wine {
  name: string
  origin?: string
  glass?: string
  large?: string
  bottle: string
  /** Shown instead of the 175ml price, e.g. a single glass size. */
  glassLabel?: string
  sparkle?: boolean
}

export interface WineList {
  id: string
  title: string
  byGlass: Wine[]
  bottleOnly: Wine[]
}

export const WINES: WineList[] = [
  {
    id: 'white',
    title: 'White',
    byGlass: [
      {
        name: 'Morenito Macabeo',
        origin: 'Campo de Borja, Spain',
        glass: '£6.50',
        large: '£8.30',
        bottle: '£22.95',
      },
      {
        name: 'Ke Bontà Pinot Grigio',
        origin: 'Italy',
        glass: '£7.00',
        large: '£9.05',
        bottle: '£25.95',
      },
      {
        name: 'Santiago Sauvignon Blanc',
        origin: 'Chile',
        glass: '£7.25',
        large: '£9.50',
        bottle: '£26.95',
      },
      {
        name: 'Blockhead Chenin Blanc',
        origin: 'South Africa',
        glass: '£7.50',
        large: '£9.80',
        bottle: '£27.95',
      },
      {
        name: 'Coast to Coast Sauvignon Blanc',
        origin: 'Marlborough',
        glass: '£9.75',
        large: '£12.55',
        bottle: '£35.95',
      },
    ],
    bottleOnly: [
      { name: "Picpoul de Pinet 'Les Courtelles'", bottle: '£30.00' },
      { name: 'Ke Bontà Gavi DOCG', bottle: '£36.95' },
      { name: 'Chablis, Domaine Louis Robin', bottle: '£40.45' },
      { name: 'Sancerre, Domaine Tinel-Blondelet', bottle: '£43.95' },
    ],
  },
  {
    id: 'rose',
    title: 'Rosé',
    byGlass: [
      {
        name: 'La Source Réserve',
        glass: '£7.00',
        large: '£9.15',
        bottle: '£25.95',
      },
      {
        name: 'Mon Rosé de Montrose',
        origin: 'Languedoc',
        glass: '£7.50',
        large: '£9.30',
        bottle: '£27.95',
      },
    ],
    bottleOnly: [
      { name: 'Whispering Angel', bottle: '£49.95' },
      { name: 'Mon Rosé de Montrose magnum', origin: '1.5L', bottle: '£55.90' },
    ],
  },
  {
    id: 'red',
    title: 'Red',
    byGlass: [
      {
        name: 'Morenito Garnacha',
        glass: '£6.50',
        large: '£7.80',
        bottle: '£22.95',
      },
      {
        name: 'La Barbe Merlot',
        glass: '£7.25',
        large: '£9.50',
        bottle: '£26.95',
      },
      {
        name: 'Gran Bestia Malbec',
        origin: 'Mendoza',
        glass: '£7.75',
        large: '£10.15',
        bottle: '£28.50',
      },
      {
        name: 'Rioja Crianza',
        origin: 'Ruiz de Viñaspre',
        glass: '£7.75',
        large: '£10.15',
        bottle: '£28.95',
      },
    ],
    bottleOnly: [
      { name: 'Blockhead Shiraz', bottle: '£25.00' },
      { name: "Primitivo di Puglia 'Grifone'", bottle: '£27.00' },
      { name: 'Maray Pinot Noir', origin: 'Chile', bottle: '£29.95' },
      { name: 'Darriaud Cairanne', bottle: '£34.00' },
    ],
  },
  {
    id: 'sparkling',
    title: 'Sparkling',
    byGlass: [
      {
        name: 'Prosecco DOC Riondo',
        glass: '£6.75',
        glassLabel: 'Glass',
        bottle: '£31.95',
      },
    ],
    bottleOnly: [
      { name: 'Paul Langier Brut', bottle: '£42.50' },
      { name: 'Moët & Chandon Brut Impérial', bottle: '£64.95' },
      { name: 'Veuve Clicquot Yellow Label', bottle: '£69.95' },
      { name: 'Laurent-Perrier La Cuvée Rosé', bottle: '£69.95' },
      { name: 'Moët Ice Impérial', bottle: '£70.95' },
      { name: 'Dom Pérignon 2006', bottle: '£250' },
      {
        name: 'Dom Pérignon Special Light-Up 2009',
        bottle: '£275',
        sparkle: true,
      },
    ],
  },
]

export const SPARKLING = WINES.find((w) => w.id === 'sparkling')!
