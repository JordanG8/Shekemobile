import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Plus, Minus, ShoppingCart, Trash2,
  ChevronRight, X, Clock, CheckCircle, Edit3, Save, ChevronDown, ChevronUp, Truck
} from 'lucide-react';
import Head from 'next/head';

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
function CartTab({ onOrderSaved, searchQuery, products, activeTrip }) {
  const [cart, setCart]               = useState({});
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [orderNote, setOrderNote]     = useState('');
  const [saving, setSaving]           = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');

  const categories = useMemo(() => ['הכל', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch   = p.name.includes(searchQuery);
      const matchesCategory = activeCategory === 'הכל' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, products]);

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
        body: JSON.stringify({ 
          items, 
          total: totalAmount, 
          note: orderNote,
          trip_id: activeTrip?.id 
        }),
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

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="bg-yellow-100 p-6 rounded-full mb-6 text-yellow-600">
          <Truck size={48} />
        </div>
        <h2 className="text-2xl font-black text-black">אין נסיעה פעילה</h2>
        <p className="text-gray-500 mt-2 font-bold">יש לפתוח נסיעה חדשה בלוח הבקרה של המנהל כדי להתחיל לקבל הזמנות.</p>
        <a href="/admin" className="mt-8 bg-black text-yellow-400 px-8 py-3 rounded-xl font-black shadow-lg">מעבר לניהול</a>
      </div>
    );
  }

  return (
    <div className="mb-24">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-yellow-400 px-8 py-4 rounded-2xl shadow-2xl z-50 text-sm font-black border-2 border-yellow-400 animate-bounce">
          {successMsg}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto bg-white px-4 py-3 border-b sticky top-[108px] z-10 gap-3 scrollbar-hide border-black/5">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-sm font-black transition-all border-2 ${
              activeCategory === cat ? 'bg-black text-yellow-400 border-black' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <main className="p-4 grid grid-cols-1 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id}
            className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-50 flex items-center justify-between hover:border-yellow-400 transition-all group">
            <div className="flex-1">
              <h3 className="font-black text-gray-800 text-lg">{product.name}</h3>
              <p className="text-black font-black mt-1 text-xl">₪{fmt(product.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              {cart[product.id] ? (
                <div className="flex items-center bg-black rounded-xl p-1.5 gap-1 border-2 border-black shadow-lg">
                  <button onClick={() => removeFromCart(product.id)}
                    className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors">
                    <Minus className="w-6 h-6" />
                  </button>
                  <span className="w-10 text-center font-black text-yellow-400 text-xl">{cart[product.id].quantity}</span>
                  <button onClick={() => addToCart(product)}
                    className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)}
                  className="bg-yellow-400 text-black p-3 rounded-xl hover:bg-black hover:text-yellow-400 transition-all border-2 border-transparent hover:border-black shadow-md font-black">
                  <Plus className="w-7 h-7" />
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-300">
             <Search size={48} className="mx-auto mb-4 opacity-20" />
             <p className="text-xl font-black">לא נמצאו מוצרים תואמים</p>
          </div>
        )}
      </main>

      {/* Floating Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-yellow-400 px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between z-20 border-t-4 border-yellow-400">
        <div>
          <p className="text-xs font-black uppercase text-yellow-400/60 tracking-widest">סה&quot;כ לתשלום</p>
          <p className="text-3xl font-black">₪{fmt(totalAmount)}</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} disabled={totalItems === 0}
          className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${
            totalItems > 0 ? 'bg-yellow-400 text-black scale-105 hover:scale-110 active:scale-95' : 'bg-yellow-900/20 text-yellow-900 cursor-not-allowed'
          }`}>
          סיכום ({totalItems})
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] max-h-[90vh] flex flex-col overflow-hidden border-4 border-black shadow-2xl animate-slide-up">
            <div className="p-6 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-2xl font-black text-black">פירוט ההזמנה</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black hover:text-yellow-400 rounded-2xl transition-all">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border-2 border-transparent hover:border-yellow-400 transition-all">
                  <div>
                    <p className="font-black text-lg">{item.name}</p>
                    <p className="text-sm text-gray-400 font-bold">{item.quantity} × ₪{fmt(item.price)}</p>
                  </div>
                  <p className="font-black text-xl">₪{fmt(item.price * item.quantity)}</p>
                </div>
              ))}

              {/* Note field */}
              <div className="mt-4">
                <label className="block text-xs font-black uppercase text-gray-400 mb-2 mr-1 tracking-widest">הערה להזמנה (אופציונלי)</label>
                <textarea
                  value={orderNote}
                  onChange={e => setOrderNote(e.target.value)}
                  placeholder="לדוגמה: דייר 15, חדר 3..."
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 text-lg font-bold resize-none focus:outline-none focus:border-yellow-400 transition-all"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-6 bg-black text-yellow-400">
              <div className="flex justify-between text-2xl font-black mb-6">
                <span>סה&quot;כ סופי:</span>
                <span className="text-3xl">₪{fmt(totalAmount)}</span>
              </div>
              <div className="flex gap-4 mb-4">
                <button onClick={clearCart}
                  className="flex-1 border-2 border-yellow-400/30 text-yellow-400/60 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                  <Trash2 className="w-5 h-5" /> נקה
                </button>
                <button onClick={completeOrder} disabled={saving}
                  className="flex-[2] bg-yellow-400 text-black py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-yellow-400/10">
                  <CheckCircle className="w-6 h-6" />
                  {saving ? 'שומר...' : 'אשר ושמור'}
                </button>
              </div>
              <button onClick={() => setIsCartOpen(false)}
                className="w-full text-yellow-400/40 py-2 rounded-xl text-sm font-black uppercase tracking-widest hover:text-yellow-400 transition-all">
                חזרה לקניות
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
      <div className="w-12 h-12 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin mb-4" />
      <p className="font-black">טוען היסטוריה...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-50 m-4 rounded-3xl border-2 border-red-100">
      <p className="text-red-500 mb-6 font-bold">{error}</p>
      <button onClick={fetchOrders} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black shadow-lg">נסה שוב</button>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
      <Clock className="w-16 h-16 mb-6 opacity-10" />
      <p className="text-2xl font-black">אין הזמנות עדיין</p>
      <p className="font-bold mt-2">הזמנות שתסיים יופיעו כאן</p>
    </div>
  );

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest">{orders.length} הזמנות רשומות</h2>
        <button onClick={fetchOrders} className="text-black text-sm font-black border-b-2 border-yellow-400">רענן רשימה</button>
      </div>

      {orders.map(order => {
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
        const isExpanded = expandedId === order.id;
        const isEditing  = editingId === order.id;

        return (
          <div key={order.id} className="bg-white rounded-3xl shadow-sm border-2 border-gray-50 overflow-hidden hover:border-yellow-400 transition-all">
            {/* Order header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-black text-yellow-400 px-3 py-1 rounded-full font-black">#{order.id}</span>
                    <span className="text-xs text-gray-400 font-bold">{formatDate(order.created_at)}</span>
                  </div>
                  <p className="text-2xl font-black text-black">₪{fmt(order.total)}</p>
                  <p className="text-sm text-gray-400 font-bold mt-1">{items.length} פריטים במארז</p>
                  {order.note && !isEditing && (
                    <div className="mt-3 bg-yellow-400/10 p-3 rounded-xl border-r-4 border-yellow-400">
                      <p className="text-sm text-black font-bold flex items-center gap-2">
                         <span className="text-lg">📝</span> {order.note}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-black text-yellow-400' : 'bg-gray-50 text-gray-400 hover:bg-yellow-400 hover:text-black'}`}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button onClick={() => { setEditingId(isEditing ? null : order.id); setEditNote(order.note || ''); }}
                    className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all">
                    <Edit3 size={20} />
                  </button>
                  <button onClick={() => deleteOrder(order.id)} disabled={deletingId === order.id}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Inline note editor */}
              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    placeholder="הוסף הערה..."
                    className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-yellow-400 transition-all"
                    onKeyDown={e => { if (e.key === 'Enter') saveNote(order.id); if (e.key === 'Escape') setEditingId(null); }}
                  />
                  <button onClick={() => saveNote(order.id)}
                    className="bg-black text-yellow-400 px-5 py-2 rounded-xl flex items-center gap-2 text-sm font-black shadow-lg">
                    <Save size={16} /> שמור
                  </button>
                </div>
              )}
            </div>

            {/* Expanded items list */}
            {isExpanded && (
              <div className="bg-gray-50 p-6 space-y-3 border-t-2 border-gray-100">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-black font-bold">{item.name} <span className="text-gray-400 mx-1">×</span> {item.quantity}</span>
                    <span className="font-black text-black">₪{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-lg text-black pt-4 border-t-2 border-gray-200 mt-2">
                  <span>סה&quot;כ לתשלום</span>
                  <span className="text-2xl">₪{fmt(order.total)}</span>
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
  const [products, setProducts]       = useState([]);
  const [activeTrip, setActiveTrip]   = useState(null);
  const [loading, setLoading]         = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, tripRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/trips?status=active')
      ]);
      setProducts(await prodRes.json());
      const trips = await tripRes.json();
      setActiveTrip(trips[0] || null);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const switchToHistory = () => {
    setActiveTab('history');
    setHistoryKey(k => k + 1); // force re-fetch
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400" dir="rtl">
        <div className="w-16 h-16 border-4 border-yellow-900/30 border-t-yellow-400 rounded-full animate-spin mb-6" />
        <h1 className="text-3xl font-black tracking-tighter">שק"מ נייד</h1>
        <p className="text-yellow-600 font-bold mt-2 uppercase tracking-widest text-sm">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans pb-10" dir="rtl">
      <Head>
        <title>שק"מ נייד | הזמנות</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
      </Head>
      
      {/* Header */}
      <header className="bg-black text-yellow-400 p-6 sticky top-0 z-30 shadow-2xl border-b-4 border-yellow-400">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-yellow-400 text-black p-2 rounded-xl shadow-lg rotate-3">
               <ShoppingCart className="w-6 h-6" />
             </div>
             <h1 className="text-3xl font-black tracking-tighter">שק"מ נייד</h1>
          </div>
          {activeTrip && (
            <div className="bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">נסיעה פעילה:</span>
              <span className="text-xs font-black">{activeTrip.name}</span>
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-4 mb-2">
          <button onClick={() => setActiveTab('cart')}
            className={`flex-1 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3 transition-all ${
              activeTab === 'cart' ? 'bg-yellow-400 text-black shadow-xl scale-105' : 'bg-yellow-900/20 text-yellow-600'
            }`}>
            <Plus className="w-5 h-5" /> הזמנה חדשה
          </button>
          <button onClick={switchToHistory}
            className={`flex-1 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3 transition-all ${
              activeTab === 'history' ? 'bg-yellow-400 text-black shadow-xl scale-105' : 'bg-yellow-900/20 text-yellow-600'
            }`}>
            <Clock className="w-5 h-5" /> היסטוריה
          </button>
        </div>

        {/* Search — only on cart tab */}
        {activeTab === 'cart' && (
          <div className="relative mt-6 animate-fade-in">
            <input type="text" placeholder="חפש מוצר שמתחשק לך..."
              className="w-full bg-white/5 border-2 border-yellow-900/20 p-4 pr-12 rounded-2xl text-yellow-400 placeholder:text-yellow-900/50 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all font-bold text-lg"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-5 text-yellow-900/50 w-6 h-6" />
          </div>
        )}
      </header>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'cart'
          ? <CartTab key="cart" searchQuery={searchQuery} onOrderSaved={switchToHistory} products={products} activeTrip={activeTrip} />
          : <HistoryTab key={historyKey} />
        }
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;900&display=swap');
        body { font-family: 'Heebo', sans-serif; -webkit-tap-highlight-color: transparent; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
