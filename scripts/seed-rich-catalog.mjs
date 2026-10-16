import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const STORE_ID = '11111111-1111-1111-1111-111111111111';

const CATALOG = [
  // ==========================================
  // 1. Fresh Fruits & Vegetables (c0000000-0000-0000-0000-000000000001)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Fresh Red Onions (Pyaaz)',
    slug: 'fresh-red-onions',
    description: 'Crisp and pungent red onions, daily staple for Indian curries and salads.',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '1 kg', price: 38, discountedPrice: 32, stock: 150, sku: 'VEG-ONION-1KG' },
      { title: '5 kg Bag', price: 180, discountedPrice: 155, stock: 60, sku: 'VEG-ONION-5KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Hybrid Juicy Red Tomatoes (Tamatar)',
    slug: 'hybrid-red-tomatoes',
    description: 'Farm-fresh, plump and firm red tomatoes rich in lycopene and vitamin C.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '1 kg', price: 40, discountedPrice: 34, stock: 120, sku: 'VEG-TOMATO-1KG' },
      { title: '500 g', price: 22, discountedPrice: 18, stock: 80, sku: 'VEG-TOMATO-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Fresh New Harvest Potatoes (Aloo)',
    slug: 'fresh-potatoes-aloo',
    description: 'Versatile, earthy new crop potatoes perfect for dum aloo, parathas, and curries.',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 3,
    variations: [
      { title: '1 kg', price: 35, discountedPrice: 28, stock: 200, sku: 'VEG-POTATO-1KG' },
      { title: '2 kg', price: 68, discountedPrice: 54, stock: 90, sku: 'VEG-POTATO-2KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Farm Fresh Green Coriander (Dhaniya)',
    slug: 'fresh-green-coriander',
    description: 'Aromatic green coriander bunch, harvested early morning for maximum aroma and zest.',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 4,
    variations: [
      { title: '100 g Bunch', price: 15, discountedPrice: 12, stock: 140, sku: 'VEG-DHANIYA-100G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Robusta Golden Bananas (Kela)',
    slug: 'robusta-golden-bananas',
    description: 'Naturally ripened sweet bananas, high in potassium and quick daily energy.',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 5,
    variations: [
      { title: '6 pcs (Half Dozen)', price: 42, discountedPrice: 36, stock: 100, sku: 'FRUIT-BANANA-6P' },
      { title: '12 pcs (1 Dozen)', price: 80, discountedPrice: 68, stock: 80, sku: 'FRUIT-BANANA-12P' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Royal Delicious Red Apples (Seb)',
    slug: 'royal-delicious-red-apples',
    description: 'Crispy, sweet Himalayan apples with vibrant red skin and tender juicy flesh.',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 6,
    variations: [
      { title: '4 pcs (~600g)', price: 130, discountedPrice: 109, stock: 75, sku: 'FRUIT-APPLE-4P' },
      { title: '1 kg Box', price: 210, discountedPrice: 179, stock: 50, sku: 'FRUIT-APPLE-1KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Tender Green Capsicum (Shimla Mirch)',
    slug: 'tender-green-capsicum',
    description: 'Crispy bell peppers ideal for Chinese stir fry, pizza toppings, and sabzi.',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '500 g', price: 45, discountedPrice: 36, stock: 90, sku: 'VEG-CAPSICUM-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000001',
    name: 'Fresh Tender Spinach (Palak)',
    slug: 'fresh-tender-spinach-palak',
    description: 'Iron-rich, clean leafy spinach greens, hydroponically grown and free of grit.',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '250 g Bunch', price: 25, discountedPrice: 20, stock: 85, sku: 'VEG-PALAK-250G' },
    ]
  },

  // ==========================================
  // 2. Dairy, Bread & Eggs (c0000000-0000-0000-0000-000000000002)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Amul Taaza Homogenised Toned Milk',
    slug: 'amul-taaza-toned-milk',
    description: 'Pasteurized toned milk with 3.0% fat and 8.5% SNF. India\'s favorite everyday tea and cereal milk.',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '500 ml Pouch', price: 28, discountedPrice: 27, stock: 200, sku: 'DAIRY-AMUL-500ML' },
      { title: '1 Litre Pouch', price: 56, discountedPrice: 54, stock: 150, sku: 'DAIRY-AMUL-1L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Amul Salted Pasteurized Butter',
    slug: 'amul-salted-butter',
    description: 'Utterly Butterly Delicious! Iconic pure cream salted butter for hot toasts, parathas, and baking.',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '100 g Pack', price: 60, discountedPrice: 56, stock: 180, sku: 'DAIRY-BUTTER-100G' },
      { title: '500 g Family Brick', price: 285, discountedPrice: 268, stock: 90, sku: 'DAIRY-BUTTER-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Mother Dairy Fresh Malai Paneer',
    slug: 'mother-dairy-fresh-malai-paneer',
    description: 'Soft and succulent malai paneer packed with high dairy protein for shahi paneer and tikkas.',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '200 g Vacuum Pack', price: 95, discountedPrice: 88, stock: 110, sku: 'DAIRY-PANEER-200G' },
      { title: '400 g Pack', price: 185, discountedPrice: 172, stock: 65, sku: 'DAIRY-PANEER-400G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Britannia 100% Whole Wheat Brown Bread',
    slug: 'britannia-whole-wheat-brown-bread',
    description: 'High-fibre, whole wheat sliced bread with zero trans fat. Baked fresh daily.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 4,
    variations: [
      { title: '400 g Loaf', price: 55, discountedPrice: 50, stock: 130, sku: 'BAKE-BREAD-400G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Farm Fresh White Table Eggs',
    slug: 'farm-fresh-white-table-eggs',
    description: 'Graded, sanitized fresh white eggs rich in natural protein and choline.',
    imageUrl: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 5,
    variations: [
      { title: '6 Eggs Pack', price: 54, discountedPrice: 48, stock: 160, sku: 'EGG-WHITE-6P' },
      { title: '30 Eggs Tray', price: 230, discountedPrice: 205, stock: 70, sku: 'EGG-WHITE-30T' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Amul Masti Dahi (Curd)',
    slug: 'amul-masti-dahi-curd',
    description: 'Rich, creamy and thick pasteurized dahi prepared with pure milk cultures.',
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '400 g Tub', price: 42, discountedPrice: 40, stock: 140, sku: 'DAIRY-DAHI-400G' },
      { title: '1 kg Bucket', price: 90, discountedPrice: 85, stock: 60, sku: 'DAIRY-DAHI-1KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Amul Processed Cheese Slices',
    slug: 'amul-cheese-slices',
    description: 'Individually wrapped creamy cheddar cheese slices for homemade burgers and melts.',
    imageUrl: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '10 Slices (200g)', price: 145, discountedPrice: 135, stock: 95, sku: 'DAIRY-CHEESE-10S' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000002',
    name: 'Mother Dairy Cow Ghee',
    slug: 'mother-dairy-cow-ghee',
    description: 'Granular, aromatic golden cow ghee crafted using traditional bilona technique.',
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '1 Litre Tin', price: 680, discountedPrice: 620, stock: 50, sku: 'DAIRY-GHEE-1L' },
    ]
  },

  // ==========================================
  // 3. Snacks & Munchies (c0000000-0000-0000-0000-000000000003)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Lay\'s India\'s Magic Masala Potato Chips',
    slug: 'lays-magical-masala-chips',
    description: 'Thin, crispy sliced potato chips seasoned with authentic hot Indian spice mix.',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '50 g Pouch', price: 20, discountedPrice: 20, stock: 250, sku: 'SNAK-LAYS-50G' },
      { title: '115 g Party Pack', price: 50, discountedPrice: 45, stock: 120, sku: 'SNAK-LAYS-115G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Kurkure Masala Munch Crunchy Snacks',
    slug: 'kurkure-masala-munch',
    description: 'Tedha hai par mera hai! Crispy spiced corn & dal curls with irresistible tangy chatpata taste.',
    imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '85 g Pack', price: 20, discountedPrice: 20, stock: 220, sku: 'SNAK-KURK-85G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Haldiram\'s Nagpur Aloo Bhujia',
    slug: 'haldirams-aloo-bhujia',
    description: 'Iconic crunchy mint-and-potato sev snack. The quintessential Indian evening tea companion.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '200 g Pack', price: 65, discountedPrice: 59, stock: 180, sku: 'SNAK-BHUJIA-200G' },
      { title: '400 g Family Pack', price: 120, discountedPrice: 105, stock: 95, sku: 'SNAK-BHUJIA-400G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Act II Butter Lovers Instant Popcorn',
    slug: 'act-ii-butter-lovers-popcorn',
    description: 'Hot, fluffy and fragrant microwave popcorn loaded with rich golden butter flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 4,
    variations: [
      { title: '70 g Pressure Cooker Pack', price: 35, discountedPrice: 32, stock: 140, sku: 'SNAK-POPCORN-70G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Doritos Cheese Supreme Nachos',
    slug: 'doritos-cheese-supreme-nachos',
    description: 'Intense crunch triangular corn chips dusted with tangy melted cheese seasoning.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 5,
    variations: [
      { title: '60 g Pack', price: 30, discountedPrice: 28, stock: 160, sku: 'SNAK-DORITOS-60G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Bikano Navratan Mix Mixture Namkeen',
    slug: 'bikano-navratan-mixture',
    description: 'Crisp blend of fried lentils, sev, roasted peanuts, and spicy flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '400 g Pack', price: 110, discountedPrice: 99, stock: 110, sku: 'SNAK-NAVRATAN-400G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Uncle Chipps Spicy Treat Potato Wafers',
    slug: 'uncle-chipps-spicy-treat',
    description: 'Bole mere lips, I love Uncle Chipps! Nostalgic ridged potato chips with traditional Indian spices.',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '50 g Pouch', price: 20, discountedPrice: 20, stock: 190, sku: 'SNAK-UNCLE-50G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000003',
    name: 'Pringles Original Salted Potato Crisps',
    slug: 'pringles-original-salted',
    description: 'Once you pop, the fun don\'t stop! Perfectly curved saddle crisps in iconic cylinder canister.',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 8,
    variations: [
      { title: '107 g Can', price: 115, discountedPrice: 99, stock: 80, sku: 'SNAK-PRINGLES-107G' },
    ]
  },

  // ==========================================
  // 4. Bakery & Biscuits (c0000000-0000-0000-0000-000000000004)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Parle-G Original Gluco Biscuits',
    slug: 'parle-g-original-gluco-biscuits',
    description: 'The world\'s largest selling biscuit. Loaded with wheat and milk nutrition, best with hot tea.',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '250 g Pack', price: 25, discountedPrice: 24, stock: 300, sku: 'BIS-PARLEG-250G' },
      { title: '800 g Value Pack', price: 80, discountedPrice: 72, stock: 120, sku: 'BIS-PARLEG-800G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Britannia Good Day Butter Cookies',
    slug: 'britannia-good-day-butter-cookies',
    description: 'Smile more with rich buttery crunch cookies baked to golden perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '200 g Multi-pack', price: 40, discountedPrice: 36, stock: 190, sku: 'BIS-GOODDAY-200G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Cadbury Dairy Milk Silk Chocolate Bar',
    slug: 'cadbury-dairy-milk-silk-bar',
    description: 'Unbelievably smooth, rich, and creamy milk chocolate melt-in-your-mouth experience.',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '60 g Bar', price: 90, discountedPrice: 85, stock: 140, sku: 'CHO-SILK-60G' },
      { title: '150 g Large Bar', price: 195, discountedPrice: 175, stock: 85, sku: 'CHO-SILK-150G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Oreo Original Vanilla Crème Sandwich Biscuits',
    slug: 'oreo-vanilla-creme-biscuits',
    description: 'Twist, lick, and dunk! Dark cocoa cookies filled with smooth vanilla cream.',
    imageUrl: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 4,
    variations: [
      { title: '120 g Pack', price: 35, discountedPrice: 32, stock: 175, sku: 'BIS-OREO-120G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Nutella Hazelnut Spread with Cocoa',
    slug: 'nutella-hazelnut-spread',
    description: 'Iconic creamy Italian hazelnut and cocoa spread for breakfast breads and pancakes.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 5,
    variations: [
      { title: '350 g Glass Jar', price: 395, discountedPrice: 349, stock: 60, sku: 'SPR-NUTELLA-350G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Sunfeast Dark Fantasy Choco Fills',
    slug: 'dark-fantasy-choco-fills',
    description: 'Crisp biscuit shell with a molten chocolate cream filling inside.',
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '300 g Family Pack', price: 150, discountedPrice: 129, stock: 90, sku: 'BIS-DARKFANTASY-300G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Britannia Toastea Premium Wheat Rusk',
    slug: 'britannia-toastea-wheat-rusk',
    description: 'Double baked crispy tea toast infused with aromatic elaichi (cardamom).',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '400 g Pack', price: 60, discountedPrice: 54, stock: 130, sku: 'BAKE-RUSK-400G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000004',
    name: 'Hershey\'s Chocolate Syrup',
    slug: 'hersheys-chocolate-syrup',
    description: 'Rich chocolate dessert topping for ice cream sundaes and chocolate milkshakes.',
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '623 g Squeeze Bottle', price: 230, discountedPrice: 199, stock: 70, sku: 'SYR-HERSHEY-623G' },
    ]
  },

  // ==========================================
  // 5. Cold Drinks & Juices (c0000000-0000-0000-0000-000000000005)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Coca-Cola Refreshing Soft Drink Bottle',
    slug: 'coca-cola-soft-drink',
    description: 'The real taste of sparkling refreshment. Best served chilled with ice.',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '750 ml Bottle', price: 40, discountedPrice: 40, stock: 240, sku: 'BEV-COKE-750ML' },
      { title: '2 Litre Family Bottle', price: 95, discountedPrice: 88, stock: 110, sku: 'BEV-COKE-2L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Thums Up Charged Carbonated Drink',
    slug: 'thums-up-charged-drink',
    description: 'Taste the Thunder! Intense spicy fizz drink crafted for bold taste seekers.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '750 ml Bottle', price: 40, discountedPrice: 40, stock: 220, sku: 'BEV-THUMS-750ML' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Red Bull Energy Drink Can',
    slug: 'red-bull-energy-drink',
    description: 'Red Bull gives you wings. High taurine & B-complex vitality drink for active days.',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '250 ml Can', price: 125, discountedPrice: 120, stock: 150, sku: 'BEV-REDBULL-250ML' },
      { title: 'Pack of 4 Cans', price: 500, discountedPrice: 459, stock: 60, sku: 'BEV-REDBULL-4PK' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Real Fruit Power Mixed Fruit Juice',
    slug: 'real-mixed-fruit-juice',
    description: 'No added preservatives. Blended with real mango, apple, guava, and orange pulp.',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 4,
    variations: [
      { title: '1 Litre Tetra Pack', price: 130, discountedPrice: 115, stock: 140, sku: 'BEV-REAL-1L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Bisleri Packaged Drinking Water Bottle',
    slug: 'bisleri-packaged-drinking-water',
    description: 'Treated with 10-step purification process with added minerals for pure taste.',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 5,
    variations: [
      { title: '1 Litre Bottle', price: 20, discountedPrice: 20, stock: 400, sku: 'BEV-BISLERI-1L' },
      { title: '5 Litre Jar', price: 75, discountedPrice: 70, stock: 90, sku: 'BEV-BISLERI-5L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Sprite Lemon Lime Carbonated Soda',
    slug: 'sprite-lemon-lime-soda',
    description: 'Clear, crisp and refreshing citrus soda with 100% natural lemon flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '750 ml Bottle', price: 40, discountedPrice: 40, stock: 180, sku: 'BEV-SPRITE-750ML' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Tata Tea Premium Desh Ki Chai',
    slug: 'tata-tea-premium-chai',
    description: 'Unique blend of big tea leaves for great taste and small tea grains for strength.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '500 g Pouch', price: 290, discountedPrice: 260, stock: 120, sku: 'TEA-TATA-500G' },
      { title: '1 kg Pack', price: 560, discountedPrice: 499, stock: 60, sku: 'TEA-TATA-1KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000005',
    name: 'Nescafe Classic Instant Coffee Powder',
    slug: 'nescafe-classic-instant-coffee',
    description: '100% pure roasted robusta coffee beans deliver unmistakable aroma and taste.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '100 g Glass Jar', price: 340, discountedPrice: 299, stock: 95, sku: 'COF-NESCAFE-100G' },
    ]
  },

  // ==========================================
  // 6. Atta, Rice & Dals (c0000000-0000-0000-0000-000000000006)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
    slug: 'aashirvaad-shudh-chakki-atta',
    description: '100% MP wheat ground in traditional stone chakki. Ensures soft rotis with dietary fiber.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '5 kg Bag', price: 285, discountedPrice: 249, stock: 130, sku: 'ATT-AASH-5KG' },
      { title: '10 kg Bag', price: 540, discountedPrice: 479, stock: 90, sku: 'ATT-AASH-10KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    slug: 'fortune-sunlite-sunflower-oil',
    description: 'Light and healthy edible oil enriched with Vitamin A & D. Low absorption technology.',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '1 Litre Pouch', price: 165, discountedPrice: 145, stock: 150, sku: 'OIL-FORT-1L' },
      { title: '5 Litre Can', price: 790, discountedPrice: 699, stock: 50, sku: 'OIL-FORT-5L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'India Gate Basmati Rice Rozzana',
    slug: 'india-gate-basmati-rice-rozzana',
    description: 'Aromatic, long slender aged grains ideal for daily pulao, jeera rice, and biryani.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '1 kg Pouch', price: 110, discountedPrice: 94, stock: 140, sku: 'RIC-INDGATE-1KG' },
      { title: '5 kg Bag', price: 495, discountedPrice: 429, stock: 80, sku: 'RIC-INDGATE-5KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Tata Sampann Unpolished Toor Dal (Arhar)',
    slug: 'tata-sampann-unpolished-toor-dal',
    description: 'Naturally rich in protein with zero water, oil, or leather polishing. Retains wholesome goodness.',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 4,
    variations: [
      { title: '1 kg Pack', price: 185, discountedPrice: 165, stock: 120, sku: 'DAL-TOOR-1KG' },
      { title: '500 g Pack', price: 95, discountedPrice: 85, stock: 90, sku: 'DAL-TOOR-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    slug: 'tata-salt-iodized',
    description: 'Desh Ka Namak! India\'s trusted source of iodine for mental development and pure flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 5,
    variations: [
      { title: '1 kg Pack', price: 28, discountedPrice: 26, stock: 300, sku: 'SALT-TATA-1KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Fortune Pure Kachi Ghani Mustard Oil',
    slug: 'fortune-mustard-oil-kachi-ghani',
    description: 'Cold pressed mustard oil with strong pungency for authentic North & East Indian cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '1 Litre Bottle', price: 175, discountedPrice: 155, stock: 110, sku: 'OIL-MUST-1L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Tata Sampann Chana Dal',
    slug: 'tata-sampann-chana-dal',
    description: 'Unpolished split Bengal gram dal, high in iron and protein for dal tadka and snacks.',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '1 kg Pack', price: 120, discountedPrice: 105, stock: 95, sku: 'DAL-CHANA-1KG' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000006',
    name: 'Madhur Pure & Hygienic Refined Sugar',
    slug: 'madhur-pure-refined-sugar',
    description: 'Sulphur-free sparkling white sugar crystals processed untouched by hands.',
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '1 kg Pack', price: 55, discountedPrice: 49, stock: 220, sku: 'SUG-MADHUR-1KG' },
      { title: '5 kg Bag', price: 260, discountedPrice: 235, stock: 80, sku: 'SUG-MADHUR-5KG' },
    ]
  },

  // ==========================================
  // 7. Instant & Frozen Food (c0000000-0000-0000-0000-000000000007)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    slug: 'maggi-2-minute-masala-noodles',
    description: 'India\'s most loved snack! Fortified with Iron and authentic taste tastemaker spice sachet.',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: 'Pack of 4 (280g)', price: 56, discountedPrice: 52, stock: 250, sku: 'NOOD-MAGGI-4PK' },
      { title: 'Pack of 12 (840g)', price: 168, discountedPrice: 152, stock: 120, sku: 'NOOD-MAGGI-12PK' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'McCain French Fries Crispy Potato Snack',
    slug: 'mccain-french-fries-crispy',
    description: 'Restaurant-style crispy golden fries ready to air fry or deep fry in just 3 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '420 g Pack', price: 130, discountedPrice: 115, stock: 90, sku: 'FROZ-MCCAIN-420G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'Safal Frozen Tender Green Peas (Matar)',
    slug: 'safal-frozen-green-peas-matar',
    description: 'Individually Quick Frozen (IQF) sweet tender peas. No preservatives, preserves garden fresh sweetness.',
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '1 kg Family Pack', price: 160, discountedPrice: 139, stock: 110, sku: 'FROZ-SAFAL-1KG' },
      { title: '500 g Pack', price: 85, discountedPrice: 75, stock: 85, sku: 'FROZ-SAFAL-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'Knorr Classic Mixed Vegetable Soup',
    slug: 'knorr-mixed-veg-soup',
    description: 'Warm comfort in 3 minutes! Made with 100% real vegetables and aromatic spices.',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 4,
    variations: [
      { title: '53 g 4-Serve Pouch', price: 40, discountedPrice: 38, stock: 140, sku: 'SOUP-KNORR-53G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'Ching\'s Secret Hakka Noodles',
    slug: 'chings-secret-hakka-noodles',
    description: 'Desi Chinese at home! Non-sticky al dente noodles for street style chowmein.',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 5,
    variations: [
      { title: '150 g Pack', price: 45, discountedPrice: 42, stock: 160, sku: 'NOOD-CHINGS-150G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'ITC Master Chef Crispy Chicken Nuggets',
    slug: 'itc-master-chef-chicken-nuggets',
    description: 'Juicy chicken mince coated with crispy breadcrumbs. Flash frozen for restaurant crunch.',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: '500 g Pack', price: 295, discountedPrice: 259, stock: 65, sku: 'FROZ-NUGGETS-500G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'MTR Ready-To-Eat Paneer Butter Masala',
    slug: 'mtr-paneer-butter-masala',
    description: 'Authentic Punjabi recipe with cottage cheese cubes in rich cashew-tomato gravy. Heat & eat.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: '300 g Retort Pouch', price: 140, discountedPrice: 125, stock: 80, sku: 'RTE-PANEER-300G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000007',
    name: 'Yummiez Chicken Breakfast Sausages',
    slug: 'yummiez-chicken-breakfast-sausages',
    description: 'Succulent chicken sausages spiced with cracked black pepper and herbs. Great with breakfast eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: '250 g Pack', price: 190, discountedPrice: 169, stock: 70, sku: 'FROZ-SAUSAGE-250G' },
    ]
  },

  // ==========================================
  // 8. Cleaning & Household (c0000000-0000-0000-0000-000000000008)
  // ==========================================
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Surf Excel Matic Front Load Liquid Detergent',
    slug: 'surf-excel-matic-liquid-detergent',
    description: 'Tough stain removal in washing machines with 100% stain removal power and long-lasting fresh fragrance.',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 1,
    variations: [
      { title: '1 Litre Pouch', price: 230, discountedPrice: 205, stock: 120, sku: 'CLN-SURF-1L' },
      { title: '2 Litre Family Can', price: 440, discountedPrice: 389, stock: 65, sku: 'CLN-SURF-2L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Vim Lemon Dishwash Gel with Real Lime',
    slug: 'vim-dishwash-gel-lemon',
    description: 'Removes deep grease in 1 swipe with 1 spoonful gel. Gentle on hands, tough on oily utensils.',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 2,
    variations: [
      { title: '750 ml Bottle', price: 155, discountedPrice: 139, stock: 160, sku: 'CLN-VIM-750ML' },
      { title: '250 ml Mini Bottle', price: 60, discountedPrice: 55, stock: 110, sku: 'CLN-VIM-250ML' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Dettol Antiseptic Disinfectant Liquid',
    slug: 'dettol-antiseptic-liquid',
    description: 'Be 100% sure! First aid antiseptic for cuts, personal hygiene, and household surface disinfection.',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    displayOrder: 3,
    variations: [
      { title: '550 ml Bottle', price: 215, discountedPrice: 195, stock: 130, sku: 'MED-DETTOL-550ML' },
      { title: '1 Litre Can', price: 380, discountedPrice: 335, stock: 75, sku: 'MED-DETTOL-1L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Harpic Power Plus Disinfectant Toilet Cleaner',
    slug: 'harpic-power-plus-toilet-cleaner',
    description: '10x better stain removal than bleach. Kills 99.9% germs and removes yellow scale deposits.',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 4,
    variations: [
      { title: '1 Litre Original Blue', price: 210, discountedPrice: 189, stock: 140, sku: 'CLN-HARPIC-1L' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Colgate Strong Teeth Anticavity Toothpaste',
    slug: 'colgate-strong-teeth-toothpaste',
    description: 'With Amino Shakti power! Adds natural calcium to strengthen tooth enamel and fight cavities.',
    imageUrl: 'https://images.unsplash.com/photo-1559656914-a30970c1affd?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 5,
    variations: [
      { title: '300 g Saver Twin Pack', price: 190, discountedPrice: 169, stock: 120, sku: 'CARE-COLGATE-300G' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Origami Soft 3-Ply Facial Tissues Box',
    slug: 'origami-facial-tissues-box',
    description: 'Ultra absorbent 100% virgin pulp facial tissues. Soft and dermatologically safe.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 6,
    variations: [
      { title: 'Pack of 2 (200 pulls)', price: 160, discountedPrice: 139, stock: 90, sku: 'CLN-TISSUE-2PK' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Goodknight Gold Flash Mosquito Vaporizer Refill',
    slug: 'goodknight-gold-flash-refill',
    description: 'Instant knockdown formula protects your family against dengue, malaria, and chikungunya mosquitoes.',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 7,
    variations: [
      { title: 'Twin Pack (2 x 45ml)', price: 165, discountedPrice: 148, stock: 110, sku: 'CLN-GOODKNIGHT-2PK' },
    ]
  },
  {
    categoryId: 'c0000000-0000-0000-0000-000000000008',
    name: 'Scotch-Brite Heavy Duty Scrub Sponge',
    slug: 'scotch-brite-scrub-sponge',
    description: 'Thick cellulose sponge backing with tough green abrasive scrub web for stainless steel & kadais.',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    isFeatured: false,
    displayOrder: 8,
    variations: [
      { title: 'Pack of 3', price: 90, discountedPrice: 79, stock: 180, sku: 'CLN-SCOTCH-3PK' },
    ]
  }
];

async function seed() {
  console.log(`Starting real-world catalog seeding (${CATALOG.length} products)...`);

  for (const item of CATALOG) {
    // 1. Upsert Product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .upsert({
        store_id: STORE_ID,
        category_id: item.categoryId,
        name: item.name,
        slug: item.slug,
        description: item.description,
        image_url: item.imageUrl,
        is_active: true,
        is_featured: item.isFeatured,
        display_order: item.displayOrder,
      }, { onConflict: 'store_id,slug' })
      .select('id')
      .single();

    if (prodErr || !product) {
      console.error(`Failed upserting product ${item.name}:`, prodErr?.message);
      continue;
    }

    // 2. Clear old variations for this product and insert updated ones
    await supabase.from('product_variations').delete().eq('product_id', product.id);

    const variationRows = item.variations.map((v) => ({
      product_id: product.id,
      title: v.title,
      price: v.price,
      discounted_price: v.discountedPrice || null,
      stock_quantity: v.stock,
      is_in_stock: v.stock > 0,
      sku: v.sku,
    }));

    const { error: varErr } = await supabase.from('product_variations').insert(variationRows);
    if (varErr) {
      console.error(`Failed variations for ${item.name}:`, varErr.message);
    } else {
      console.log(`✓ Seeded: ${item.name} (${item.variations.length} variations)`);
    }
  }

  console.log('\n✅ Successfully seeded 64 branded everyday products across all 8 aisles!');
}

seed().catch(console.error);
