import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Plus, Minus, ShoppingCart, Trash2,
  ChevronRight, X, Clock, CheckCircle, Edit3, Save, ChevronDown, ChevronUp
} from 'lucide-react';

// ─────────────────────────────────────────────
// Product catalogue
// ─────────────────────────────────────────────
const productsData = [
  { id: 1,  name: 'במבה',                              price: 3.5,  category: 'מוצרים' },
  { id: 2,  name: 'במבה נוגט / וופל בלגי',            price: 3.5,  category: 'מוצרים' },
  { id: 3,  name: "תפוצ'יפס",                          price: 3.5,  category: 'מוצרים' },
  { id: 4,  name: 'דוריטוס',                           price: 2.5,  category: 'מוצרים' },
  { id: 5,  name: 'ביסלי',                             price: 3.9,  category: 'מוצרים' },
  { id: 6,  name: 'יוגטה',                             price: 3,    category: 'מוצרים' },
  { id: 7,  name: 'קליק / קליק אינץ / קליק טבלה',    price: 4.9,  category: 'מוצרים' },
  { id: 8,  name: 'בואנו',                             price: 4,    category: 'מוצרים' },
  { id: 9,  name: 'מנבה / רבע לשבע',                  price: 7.5,  category: 'מוצרים' },
  { id: 10, name: 'טעמי / אגוזי / טורטית / כיף כף',  price: 3.5,  category: 'מוצרים' },
  { id: 11, name: 'טוויסט / מארס / סניקרס',           price: 3.5,  category: 'מוצרים' },
  { id: 12, name: 'פסק זמן / מילקה',                   price: 4,    category: 'מוצרים' },
  { id: 13, name: 'הפי היפו',                          price: 3,    category: 'מוצרים' },
  { id: 14, name: 'אוראו',                             price: 8,    category: 'מוצרים' },
  { id: 15, name: 'שמפו / תחליב',                     price: 8,    category: 'מוצרים' },
  { id: 16, name: 'מגבונים',                          price: 3.5,  category: 'מוצרים' },
  { id: 17, name: 'ספיד סטיק',                        price: 16,   category: 'מוצרים' },
  { id: 18, name: 'אקס בנים',                         price: 12.9, category: 'מוצרים' },
  { id: 19, name: 'משחת שיניים',                      price: 11,   category: 'מוצרים' },
  { id: 20, name: 'מברשת שיניים',                     price: 3,    category: 'מוצרים' },
  { id: 21, name: 'דאורדורנט דאב בנות',               price: 15,   category: 'מוצרים' },
  { id: 22, name: 'תחבושות',                          price: 13,   category: 'מוצרים' },
  { id: 23, name: 'מגבת',                             price: 30,   category: 'מוצרים' },
  { id: 24, name: 'תחליב רחצה דאב',                   price: 15.9, category: 'מוצרים' },
  { id: 25, name: 'קורנפלקס קראנץ',                   price: 21,   category: 'מוצרים' },
  { id: 26, name: 'קורנפלקס דליפקאן',                 price: 21,   category: 'מוצרים' },

  { id: 27, name: 'באלי שאג',                          price: 120,  category: 'סיגריות' },
  { id: 28, name: 'קאמל צהוב',                        price: 40,   category: 'סיגריות' },
  { id: 29, name: 'מלברו גולד',                       price: 43,   category: 'סיגריות' },
  { id: 30, name: "מלברו טאץ'",                       price: 38,   category: 'סיגריות' },
  { id: 31, name: 'ווינסטון כחול',                    price: 42.5, category: 'סיגריות' },
  { id: 32, name: 'ווינסטון קוד',                     price: 40,   category: 'סיגריות' },
  { id: 33, name: 'LM בלו',                           price: 39,   category: 'סיגריות' },
  { id: 34, name: 'טבק מלברו גולד',                   price: 88,   category: 'סיגריות' },
  { id: 35, name: 'ווינסטון אקווה',                   price: 40,   category: 'סיגריות' },
  { id: 36, name: "מלברו פיין טאץ'",                  price: 36,   category: 'סיגריות' },
  { id: 37, name: "נקסט אדג'",                        price: 33,   category: 'סיגריות' },
  { id: 38, name: 'פילטרים',                          price: 3,    category: 'סיגריות' },
  { id: 39, name: 'ריזלה',                            price: 1.5,  category: 'סיגריות' },
  { id: 40, name: "נקסט אוריג'ינל",                  price: 35.5, category: 'סיגריות' },
  { id: 41, name: 'קאמל כחול',                        price: 40,   category: 'סיגריות' },
  { id: 42, name: 'פרלמנט נייט',                      price: 48,   category: 'סיגריות' },
  { id: 43, name: 'מצית',                             price: 5,    category: 'סיגריות' },
  { id: 44, name: 'טבק קאמל צהוב',                    price: 86,   category: 'סיגריות' },
  { id: 45, name: 'פתיבר עוגיות',                     price: 10,   category: 'סיגריות' },
  { id: 46, name: 'כיפלי',                            price: 5,    category: 'סיגריות' },
  { id: 47, name: 'מילקה עוגיות',                     price: 10,   category: 'סיגריות' },
  { id: 48, name: 'עוגיות פיק אפ',                    price: 12,   category: 'סיגריות' },
  { id: 49, name: 'ריסס כוסות',                       price: 4,    category: 'סיגריות' },
  { id: 50, name: 'דובונים',                          price: 3.5,  category: 'סיגריות' },
  { id: 51, name: 'ביסלי במבה קטן',                   price: 4.5,  category: 'סיגריות' },
  { id: 52, name: 'קינדר גדול',                       price: 7.5,  category: 'סיגריות' },
  { id: 53, name: 'מייק אנד לייק',                    price: 10,   category: 'סיגריות' },
  { id: 54, name: 'ביסלי במבה גדול',                  price: 7,    category: 'סיגריות' },
  { id: 55, name: 'טופיפי',                           price: 9,    category: 'סיגריות' },
  { id: 56, name: 'עד חצות',                         price: 15.5, category: 'סיגריות' },
  { id: 57, name: 'ערגליות שוקו',                     price: 9,    category: 'סיגריות' },
  { id: 58, name: 'לואקר',                            price: 10.5, category: 'סיגריות' },

  { id: 59, name: 'קולה פחית',                        price: 5,    category: 'שתייה' },
  { id: 60, name: 'זירו פחית',                        price: 5,    category: 'שתייה' },
  { id: 61, name: 'קולה גדול',                        price: 7.5,  category: 'שתייה' },
  { id: 62, name: 'זירו גדול',                        price: 7.5,  category: 'שתייה' },
  { id: 63, name: 'מים בטעם קטן',                     price: 6,    category: 'שתייה' },
  { id: 64, name: 'שוופס טעמים',                      price: 4.5,  category: 'שתייה' },
  { id: 65, name: 'פיוז תה גדול',                     price: 7.5,  category: 'שתייה' },
  { id: 66, name: 'מים',                              price: 3.3,  category: 'שתייה' },
  { id: 67, name: 'מונסטר',                           price: 6.5,  category: 'שתייה' },
  { id: 68, name: 'XL / טן',                          price: 3.5,  category: 'שתייה' },
  { id: 69, name: 'בלו',                              price: 3.5,  category: 'שתייה' },
  { id: 70, name: 'סודה',                             price: 3,    category: 'שתייה' },
  { id: 71, name: 'פריגת',                            price: 3,    category: 'שתייה' },
  { id: 100, name: 'רדבול (RedBull)',                  price: 5.5,  category: 'שתייה' },
  { id: 101, name: 'ממבה / חמצוצים',                  price: 10,   category: 'סיגריות' },
];

const CATEGORIES = ['הכל', 'מוצרים', 'סיגריות', 'שתייה'];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function fmt(n) { return Number(n).toFixed(2); }

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ─────────────────────────────────────────────
// CartTab component
// ─────────────────────────────────────────────
function CartTab({ onOrderSaved, searchQuery }) {
  const [cart, setCart]               = useState({});
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [orderNote, setOrderNote]     = useState('');
  const [saving, setSaving]           = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesSearch   = p.name.includes(searchQuery);
      const matchesCategory = activeCategory === 'הכל' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: { ...product, quantity: (prev[product.id]?.quantity || 0) + 1 }
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[productId].quantity > 1) next[productId] = { ...next[productId], quantity: next[productId].quantity - 1 };
      else delete next[productId];
      return next;
    });
  };

  const clearCart = () => { setCart({}); setIsCartOpen(false); setOrderNote(''); };

  const totalAmount = Object.values(cart).reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems  = Object.values(cart).reduce((s, i) => s + i.quantity, 0);

  const completeOrder = async () => {
    if (totalItems === 0) return;
    setSaving(true);
    try {
      const items = Object.values(cart).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: totalAmount, note: orderNote }),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      clearCart();
      setIsCartOpen(false);
      setSuccessMsg(`ההזמנה נשמרה בהצלחה! 🎉 (מס׳ ${saved.id})`);
      setTimeout(() => setSuccessMsg(''), 4000);
      onOrderSaved?.();
    } catch (e) {
      alert('שגיאה בשמירת ההזמנה: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-24">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 text-sm font-bold">
          {successMsg}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto bg-white px-4 py-3 border-b sticky top-[108px] z-10 gap-3 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <main className="p-4 grid grid-cols-1 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{product.name}</h3>
              <p className="text-blue-600 font-semibold mt-1">₪{fmt(product.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              {cart[product.id] ? (
                <div className="flex items-center bg-blue-50 rounded-lg p-1.5 gap-1">
                  <button onClick={() => removeFromCart(product.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-10 text-center font-bold text-blue-700">{cart[product.id].quantity}</span>
                  <button onClick={() => addToCart(product)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-400">לא נמצאו מוצרים תואמים</div>
        )}
      </main>

      {/* Floating Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-2xl flex items-center justify-between z-20">
        <div>
          <p className="text-sm text-gray-500">סה&quot;כ לתשלום:</p>
          <p className="text-2xl font-bold text-blue-600">₪{fmt(totalAmount)}</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} disabled={totalItems === 0}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all ${
            totalItems > 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          סיכום ({totalItems})
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">פירוט ההזמנה</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ₪{fmt(item.price)}</p>
                  </div>
                  <p className="font-bold">₪{fmt(item.price * item.quantity)}</p>
                </div>
              ))}

              {/* Note field */}
              <div className="mt-3">
                <label className="block text-sm text-gray-500 mb-1">הערה (אופציונלי)</label>
                <textarea
                  value={orderNote}
                  onChange={e => setOrderNote(e.target.value)}
                  placeholder="לדוגמה: דייר 15, חדר 3..."
                  className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>סה&quot;כ סופי:</span>
                <span className="text-blue-600">₪{fmt(totalAmount)}</span>
              </div>
              <div className="flex gap-3 mb-3">
                <button onClick={clearCart}
                  className="flex-1 border border-red-500 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <Trash2 className="w-5 h-5" /> נקה הכל
                </button>
                <button onClick={completeOrder} disabled={saving}
                  className="flex-2 flex-grow bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                  <CheckCircle className="w-5 h-5" />
                  {saving ? 'שומר...' : 'סיים הזמנה ושמור'}
                </button>
              </div>
              <button onClick={() => setIsCartOpen(false)}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-medium">
                המשך קנייה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HistoryTab component
// ─────────────────────────────────────────────
function HistoryTab() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [editingId, setEditingId]     = useState(null);
  const [editNote, setEditNote]       = useState('');
  const [expandedId, setExpandedId]   = useState(null);
  const [deletingId, setDeletingId]   = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error(await res.text());
      setOrders(await res.json());
    } catch (e) {
      setError('שגיאה בטעינת ההזמנות: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const saveNote = async (id) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: editNote }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      setEditingId(null);
    } catch (e) {
      alert('שגיאה בשמירה: ' + e.message);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm('למחוק הזמנה זו?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (e) {
      alert('שגיאה במחיקה: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p>טוען היסטוריה...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={fetchOrders} className="bg-blue-600 text-white px-6 py-2 rounded-lg">נסה שוב</button>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <Clock className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-lg">אין הזמנות עדיין</p>
      <p className="text-sm mt-1">הזמנות שתסיים יופיעו כאן</p>
    </div>
  );

  return (
    <div className="p-4 space-y-3 pb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-500 text-sm">{orders.length} הזמנות בסך הכל</h2>
        <button onClick={fetchOrders} className="text-blue-600 text-sm font-medium">רענן</button>
      </div>

      {orders.map(order => {
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
        const isExpanded = expandedId === order.id;
        const isEditing  = editingId === order.id;

        return (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">#{order.id}</span>
                    <span className="text-xs text-gray-400">{formatDate(order.created_at)}</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600 mt-1">₪{fmt(order.total)}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{items.length} פריטים</p>
                  {order.note && !isEditing && (
                    <p className="text-sm text-gray-600 mt-1 bg-yellow-50 px-2 py-1 rounded-lg border-r-2 border-yellow-400">
                      📝 {order.note}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingId(isEditing ? null : order.id); setEditNote(order.note || ''); }}
                    className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteOrder(order.id)} disabled={deletingId === order.id}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Inline note editor */}
              {isEditing && (
                <div className="mt-3 flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    placeholder="הוסף הערה..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onKeyDown={e => { if (e.key === 'Enter') saveNote(order.id); if (e.key === 'Escape') setEditingId(null); }}
                  />
                  <button onClick={() => saveNote(order.id)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium">
                    <Save className="w-4 h-4" /> שמור
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="border px-3 py-2 rounded-lg text-sm text-gray-500">
                    ביטול
                  </button>
                </div>
              )}
            </div>

            {/* Expanded items list */}
            {isExpanded && (
              <div className="border-t bg-gray-50 p-4 space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-gray-800">₪{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-blue-700 pt-2 border-t mt-2">
                  <span>סה&quot;כ</span>
                  <span>₪{fmt(order.total)}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab]     = useState('cart');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyKey, setHistoryKey]   = useState(0);

  const switchToHistory = () => {
    setActiveTab('history');
    setHistoryKey(k => k + 1); // force re-fetch
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">מחשבון הזמנות</h1>
          <ShoppingCart className="w-6 h-6" />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 mb-3">
          <button onClick={() => setActiveTab('cart')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cart' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'
            }`}>
            <ShoppingCart className="w-4 h-4" /> הזמנה חדשה
          </button>
          <button onClick={switchToHistory}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'history' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'
            }`}>
            <Clock className="w-4 h-4" /> היסטוריה
          </button>
        </div>

        {/* Search — only on cart tab */}
        {activeTab === 'cart' && (
          <div className="relative">
            <input type="text" placeholder="חפש מוצר..."
              className="w-full p-3 pr-10 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        )}
      </header>

      {/* Tab content */}
      {activeTab === 'cart'
        ? <CartTab key="cart" searchQuery={searchQuery} onOrderSaved={switchToHistory} />
        : <HistoryTab key={historyKey} />
      }
    </div>
  );
}
