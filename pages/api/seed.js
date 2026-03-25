import { getDb, initDb } from '../../lib/db';

const productsData = [
  { name: 'במבה', price: 3.5, category: 'מוצרים' },
  { name: 'במבה נוגט / וופל בלגי', price: 3.5, category: 'מוצרים' },
  { name: "תפוצ'יפס", price: 3.5, category: 'מוצרים' },
  { name: 'דוריטוס', price: 2.5, category: 'מוצרים' },
  { name: 'ביסלי', price: 3.9, category: 'מוצרים' },
  { name: 'יוגטה', price: 3, category: 'מוצרים' },
  { name: 'קליק / קליק אינץ / קליק טבלה', price: 4.9, category: 'מוצרים' },
  { name: 'בואנו', price: 4, category: 'מוצרים' },
  { name: 'מנבה / רבע לשבע', price: 7.5, category: 'מוצרים' },
  { name: 'טעמי / אגוזי / טורטית / כיף כף', price: 3.5, category: 'מוצרים' },
  { name: 'טוויסט / מארס / סניקרס', price: 3.5, category: 'מוצרים' },
  { name: 'פסק זמן / מילקה', price: 4, category: 'מוצרים' },
  { name: 'הפי היפו', price: 3, category: 'מוצרים' },
  { name: 'אוראו', price: 8, category: 'מוצרים' },
  { name: 'שמפו / תחליב', price: 8, category: 'מוצרים' },
  { name: 'מגבונים', price: 3.5, category: 'מוצרים' },
  { name: 'ספיד סטיק', price: 16, category: 'מוצרים' },
  { name: 'אקס בנים', price: 12.9, category: 'מוצרים' },
  { name: 'משחת שיניים', price: 11, category: 'מוצרים' },
  { name: 'מברשת שיניים', price: 3, category: 'מוצרים' },
  { name: 'דאורדורנט דאב בנות', price: 15, category: 'מוצרים' },
  { name: 'תחבושות', price: 13, category: 'מוצרים' },
  { name: 'מגבת', price: 30, category: 'מוצרים' },
  { name: 'תחליב רחצה דאב', price: 15.9, category: 'מוצרים' },
  { name: 'קורנפלקס קראנץ', price: 21, category: 'מוצרים' },
  { name: 'קורנפלקס דליפקאן', price: 21, category: 'מוצרים' },
  { name: 'באלי שאג', price: 120, category: 'סיגריות' },
  { name: 'קאמל צהוב', price: 40, category: 'סיגריות' },
  { name: 'מלברו גולד', price: 43, category: 'סיגריות' },
  { name: "מלברו טאץ'", price: 38, category: 'סיגריות' },
  { name: 'ווינסטון כחול', price: 42.5, category: 'סיגריות' },
  { name: 'ווינסטון קוד', price: 40, category: 'סיגריות' },
  { name: 'LM בלו', price: 39, category: 'סיגריות' },
  { name: 'טבק מלברו גולד', price: 88, category: 'סיגריות' },
  { name: 'ווינסטון אקווה', price: 40, category: 'סיגריות' },
  { name: "מלברו פיין טאץ'", price: 36, category: 'סיגריות' },
  { name: "נקסט אדג'", price: 33, category: 'סיגריות' },
  { name: 'פילטרים', price: 3, category: 'סיגריות' },
  { name: 'ריזלה', price: 1.5, category: 'סיגריות' },
  { name: "נקסט אוריג'ינל", price: 35.5, category: 'סיגריות' },
  { name: 'קאמל כחול', price: 40, category: 'סיגריות' },
  { name: 'פרלמנט נייט', price: 48, category: 'סיגריות' },
  { name: 'מצית', price: 5, category: 'סיגריות' },
  { name: 'טבק קאמל צהוב', price: 86, category: 'סיגריות' },
  { name: 'פתיבר עוגיות', price: 10, category: 'סיגריות' },
  { name: 'כיפלי', price: 5, category: 'סיגריות' },
  { name: 'מילקה עוגיות', price: 10, category: 'סיגריות' },
  { name: 'עוגיות פיק אפ', price: 12, category: 'סיגריות' },
  { name: 'ריסס כוסות', price: 4, category: 'סיגריות' },
  { name: 'דובונים', price: 3.5, category: 'סיגריות' },
  { name: 'ביסלי במבה קטן', price: 4.5, category: 'סיגריות' },
  { name: 'קינדר גדול', price: 7.5, category: 'סיגריות' },
  { name: 'מייק אנד לייק', price: 10, category: 'סיגריות' },
  { name: 'ביסלי במבה גדול', price: 7, category: 'סיגריות' },
  { name: 'טופיפי', price: 9, category: 'סיגריות' },
  { name: 'עד חצות', price: 15.5, category: 'סיגריות' },
  { name: 'ערגליות שוקו', price: 9, category: 'סיגריות' },
  { name: 'לואקר', price: 10.5, category: 'סיגריות' },
  { name: 'קולה פחית', price: 5, category: 'שתייה' },
  { name: 'זירו פחית', price: 5, category: 'שתייה' },
  { name: 'קולה גדול', price: 7.5, category: 'שתייה' },
  { name: 'זירו גדול', price: 7.5, category: 'שתייה' },
  { name: 'מים בטעם קטן', price: 6, category: 'שתייה' },
  { name: 'שוופס טעמים', price: 4.5, category: 'שתייה' },
  { name: 'פיוז תה גדול', price: 7.5, category: 'שתייה' },
  { name: 'מים', price: 3.3, category: 'שתייה' },
  { name: 'מונסטר', price: 6.5, category: 'שתייה' },
  { name: 'XL / טן', price: 3.5, category: 'שתייה' },
  { name: 'בלו', price: 3.5, category: 'שתייה' },
  { name: 'סודה', price: 3, category: 'שתייה' },
  { name: 'פריגת', price: 3, category: 'שתייה' },
  { name: 'רדבול (RedBull)', price: 5.5, category: 'שתייה' },
  { name: 'ממבה / חמצוצים', price: 10, category: 'סיגריות' },
];

export default async function handler(req, res) {
  try {
    await initDb();
    const sql = getDb();
    
    const [count] = await sql`SELECT COUNT(*) FROM products;`;
    if (parseInt(count.count) > 0) {
      return res.status(200).json({ message: 'DB already seeded' });
    }

    for (const p of productsData) {
      await sql`
        INSERT INTO products (name, price, category)
        VALUES (${p.name}, ${p.price}, ${p.category});
      `;
    }

    return res.status(200).json({ message: 'Seeded successfully', count: productsData.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
