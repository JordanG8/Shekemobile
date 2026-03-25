import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, Download, Truck, 
  Package, ShoppingBag, LayoutDashboard, ChevronDown, ChevronUp,
  FileText, LogOut, CheckCircle, AlertCircle
} from 'lucide-react';
import Head from 'next/head';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

// Helper for currency formatting
const fmt = (n) => Number(n).toFixed(2);

// Admin Sidebar Component
function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
    { id: 'products', label: 'ניהול מוצרים', icon: Package },
    { id: 'trips', label: 'ניהול נסיעות', icon: Truck },
    { id: 'reports', label: 'דוחות', icon: FileText },
  ];

  return (
    <div className="w-72 bg-black text-white h-screen sticky top-0 flex flex-col border-l border-white/5">
      <div className="p-8 border-b border-white/5">
        <div className="bg-yellow-400 text-black w-12 h-12 rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
          <ShoppingBag size={24} className="stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-yellow-400">שק"מ נייד</h1>
        <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-[0.2em]">ממשק ניהול</p>
      </div>
      
      <nav className="flex-1 p-6 space-y-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold ${
              activeTab === tab.id 
                ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/10 scale-[1.02]' 
                : 'hover:bg-white/5 text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? 'stroke-[2.5]' : 'stroke-[2]'} />
            <span className="text-sm tracking-wide">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 font-black transition-all text-sm uppercase tracking-wider"
        >
          <LogOut size={20} className="stroke-[2.5]" />
          התנתקות
        </button>
      </div>
    </div>
  );
}

// Product Management Component
function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'מוצרים' });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: '', price: '', category: 'מוצרים' });
    fetchProducts();
  };

  const handleUpdate = async (id, data) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-black">ניהול מוצרים</h2>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold border border-yellow-200">
          {products.length} מוצרים במלאי
        </div>
      </div>

      {/* Add Product Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border-2 border-black shadow-sm flex gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-black uppercase text-gray-500 mr-1">שם המוצר</label>
          <input 
            required
            className="w-full border-2 border-gray-100 focus:border-yellow-400 rounded-xl px-4 py-2.5 outline-none transition-all"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            placeholder="לדוגמה: במבה..."
          />
        </div>
        <div className="w-32 space-y-1">
          <label className="text-xs font-black uppercase text-gray-500 mr-1">מחיר</label>
          <input 
            required
            type="number"
            step="0.1"
            className="w-full border-2 border-gray-100 focus:border-yellow-400 rounded-xl px-4 py-2.5 outline-none transition-all"
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            placeholder="₪"
          />
        </div>
        <div className="w-48 space-y-1">
          <label className="text-xs font-black uppercase text-gray-500 mr-1">קטגוריה</label>
          <select 
            className="w-full border-2 border-gray-100 focus:border-yellow-400 rounded-xl px-4 py-2.5 outline-none transition-all appearance-none"
            value={newProduct.category}
            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
          >
            <option>מוצרים</option>
            <option>סיגריות</option>
            <option>שתייה</option>
          </select>
        </div>
        <button type="submit" className="bg-black text-yellow-400 px-8 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition-all border-2 border-black">
          הוסף מוצר
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b-2 border-black">
            <tr>
              <th className="px-6 py-4 font-black text-gray-600 uppercase text-xs">שם</th>
              <th className="px-6 py-4 font-black text-gray-600 uppercase text-xs">קטגוריה</th>
              <th className="px-6 py-4 font-black text-gray-600 uppercase text-xs">מחיר</th>
              <th className="px-6 py-4 font-black text-gray-600 uppercase text-xs text-left">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-yellow-50/30 transition-colors">
                {editingId === p.id ? (
                  <>
                    <td className="px-6 py-3">
                      <input className="w-full border rounded-lg px-2 py-1" value={p.name} onChange={e => handleUpdateInLocal(p.id, {name: e.target.value})} />
                    </td>
                    <td className="px-6 py-3">
                      <select className="border rounded-lg px-2 py-1" value={p.category} onChange={e => handleUpdateInLocal(p.id, {category: e.target.value})}>
                        <option>מוצרים</option>
                        <option>סיגריות</option>
                        <option>שתייה</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <input type="number" step="0.1" className="w-20 border rounded-lg px-2 py-1" value={p.price} onChange={e => handleUpdateInLocal(p.id, {price: e.target.value})} />
                    </td>
                    <td className="px-6 py-3 text-left">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleUpdate(p.id, p)} className="p-2 bg-green-500 text-white rounded-lg"><Save size={16}/></button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-gray-400 text-white rounded-lg"><X size={16}/></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-black">₪{fmt(p.price)}</td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(p.id)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={18}/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function handleUpdateInLocal(id, data) {
    setProducts(products.map(p => p.id === id ? { ...p, ...data } : p));
  }
}

// Trip Manager Component
function TripManager() {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [newTripName, setNewTripName] = useState('');

  const fetchTrips = async () => {
    const res = await fetch('/api/trips');
    const data = await res.json();
    setTrips(data);
    setActiveTrip(data.find(t => t.status === 'active'));
  };

  useEffect(() => { fetchTrips(); }, []);

  const handleStartTrip = async () => {
    await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', name: newTripName }),
    });
    setNewTripName('');
    fetchTrips();
  };

  const handleEndTrip = async (id) => {
    if (!confirm('האם לסגור את הנסיעה הנוכחית?')) return;
    await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close', id }),
    });
    fetchTrips();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-black">ניהול נסיעות</h2>
      </div>

      {/* Active Trip Status */}
      <div className={`p-8 rounded-3xl border-2 transition-all ${activeTrip ? 'bg-yellow-400 border-black shadow-xl shadow-yellow-400/20' : 'bg-white border-dashed border-gray-300'}`}>
        {activeTrip ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-black text-yellow-400 p-4 rounded-2xl shadow-lg">
                <Truck size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-black animate-pulse"></span>
                  <p className="text-xs font-black uppercase text-black/60 tracking-widest">נסיעה פעילה כרגע</p>
                </div>
                <h3 className="text-3xl font-black text-black mt-1">{activeTrip.name}</h3>
                <p className="text-black/60 font-bold">החלה ב: {new Date(activeTrip.start_time).toLocaleString('he-IL')}</p>
              </div>
            </div>
            <button 
              onClick={() => handleEndTrip(activeTrip.id)}
              className="bg-black text-yellow-400 px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              סיום נסיעה
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="inline-flex flex-col items-center">
              <Truck size={48} className="text-gray-300 mb-4" />
              <h3 className="text-2xl font-black text-gray-400">אין נסיעה פעילה</h3>
              <p className="text-gray-500">פתח נסיעה חדשה כדי להתחיל לקבל הזמנות</p>
            </div>
            
            <div className="max-w-md mx-auto flex gap-3">
              <input 
                className="flex-1 border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-yellow-400 transition-all font-bold"
                placeholder="שם הנסיעה (לדוגמה: יום ראשון - סבב בוקר)"
                value={newTripName}
                onChange={e => setNewTripName(e.target.value)}
              />
              <button 
                onClick={handleStartTrip}
                className="bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black hover:bg-yellow-400 hover:text-black transition-all border-2 border-black whitespace-nowrap"
              >
                התחל נסיעה
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <h4 className="text-xl font-black text-black">היסטוריית נסיעות</h4>
        <div className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-sm">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b-2 border-black">
              <tr>
                <th className="px-8 py-5 font-black text-gray-600 text-xs uppercase tracking-widest">שם</th>
                <th className="px-8 py-5 font-black text-gray-600 text-xs uppercase tracking-widest">זמן התחלה</th>
                <th className="px-8 py-5 font-black text-gray-600 text-xs uppercase tracking-widest">זמן סיום</th>
                <th className="px-8 py-5 font-black text-gray-600 text-xs uppercase tracking-widest">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.map(t => (
                <tr key={t.id} className="hover:bg-yellow-50/20 transition-colors">
                  <td className="px-8 py-5 font-bold">{t.name}</td>
                  <td className="px-8 py-5 text-gray-500 font-medium">{new Date(t.start_time).toLocaleString('he-IL')}</td>
                  <td className="px-8 py-5 text-gray-500 font-medium">{t.end_time ? new Date(t.end_time).toLocaleString('he-IL') : '-'}</td>
                  <td className="px-8 py-5">
                    {t.status === 'active' ? (
                      <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase border border-green-200">פעיל</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black uppercase border border-gray-200">סגור</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Report Component (PDF Generation)
function Reports() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [orders, setOrders] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/trips').then(res => res.json()).then(setTrips);
  }, []);

  const loadTripData = async (trip) => {
    setSelectedTrip(trip);
    const res = await fetch(`/api/orders?trip_id=${trip.id}`);
    setOrders(await res.json());
  };

  const generatePDF = async () => {
    if (!selectedTrip) return;
    setGenerating(true);
    const element = document.getElementById('pdf-report-template');
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`report-${selectedTrip.name}-${new Date().toLocaleDateString()}.pdf`);
    } finally {
      element.style.display = 'none';
      setGenerating(false);
    }
  };

  const totals = useMemo(() => {
    const summary = { totalRevenue: 0, itemsCount: {}, categories: {} };
    orders.forEach(o => {
      summary.totalRevenue += parseFloat(o.total);
      const items = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
      items.forEach(i => {
        summary.itemsCount[i.name] = (summary.itemsCount[i.name] || 0) + i.quantity;
      });
    });
    return summary;
  }, [orders]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-black">דוחות וסיכומים</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trips List */}
        <div className="col-span-1 space-y-3">
          <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mr-2">בחר נסיעה להפקה</h4>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {trips.map(t => (
              <button
                key={t.id}
                onClick={() => loadTripData(t)}
                className={`w-full text-right p-5 rounded-2xl border-2 transition-all ${
                  selectedTrip?.id === t.id ? 'bg-yellow-400 border-black shadow-lg translate-x-1' : 'bg-white border-gray-100 hover:border-yellow-200'
                }`}
              >
                <p className="font-black text-lg">{t.name}</p>
                <p className="text-xs font-bold opacity-60">{new Date(t.start_time).toLocaleDateString('he-IL')}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview & Action */}
        <div className="col-span-2">
          {selectedTrip ? (
            <div className="bg-white rounded-3xl border-2 border-black p-8 space-y-8 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black">{selectedTrip.name}</h3>
                  <p className="text-gray-500 font-bold">{new Date(selectedTrip.start_time).toLocaleString('he-IL')}</p>
                </div>
                <button 
                  onClick={generatePDF}
                  disabled={generating}
                  className="flex items-center gap-2 bg-black text-yellow-400 px-6 py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                >
                  <Download size={20} />
                  {generating ? 'מפיק...' : 'ייצוא ל-PDF'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black uppercase text-gray-400 tracking-tighter">סה"כ הכנסות</p>
                  <p className="text-4xl font-black text-black mt-1">₪{fmt(totals.totalRevenue)}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black uppercase text-gray-400 tracking-tighter">מספר הזמנות</p>
                  <p className="text-4xl font-black text-black mt-1">{orders.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black border-b-2 border-yellow-400 pb-2 inline-block">פירוט מכירות</h4>
                <div className="space-y-2">
                  {Object.entries(totals.itemsCount).map(([name, qty]) => (
                    <div key={name} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="font-bold">{name}</span>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-black text-sm">x{qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl p-20">
              <FileText size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-black uppercase tracking-widest">בחר נסיעה מהרשימה להצגת נתונים</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden PDF Template */}
      <div id="pdf-report-template" style={{ display: 'none', width: '210mm', padding: '20mm', background: 'white', direction: 'rtl', fontFamily: 'Arial' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '5px solid black', paddingBottom: '10px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0', letterSpacing: '-2px' }}>דו"ח סיכום נסיעה</h1>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#666' }}>שק"מ נייד - שירות שטח</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0', fontWeight: '900' }}>תאריך הפקה: {new Date().toLocaleDateString('he-IL')}</p>
            <p style={{ margin: '0', fontWeight: '900', color: '#fbbf24' }}>#{selectedTrip?.id}</p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', marginBottom: '40px', border: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0' }}>{selectedTrip?.name}</h2>
          <div style={{ display: 'flex', gap: '40px' }}>
            <p><strong>התחלה:</strong> {new Date(selectedTrip?.start_time).toLocaleString('he-IL')}</p>
            <p><strong>סיום:</strong> {selectedTrip?.end_time ? new Date(selectedTrip?.end_time).toLocaleString('he-IL') : 'פעיל'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'black', color: '#fbbf24', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', opacity: '0.8' }}>סה"כ הכנסות</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '48px', fontWeight: '900' }}>₪{fmt(totals.totalRevenue)}</p>
          </div>
          <div style={{ background: '#fbbf24', color: 'black', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', opacity: '0.8' }}>מספר הזמנות</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '48px', fontWeight: '900' }}>{orders.length}</p>
          </div>
        </div>

        <h3 style={{ fontSize: '24px', fontWeight: '900', borderBottom: '3px solid #fbbf24', paddingBottom: '10px', marginBottom: '20px' }}>סיכום פריטים שנמכרו</h3>
        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '15px', borderBottom: '2px solid black' }}>מוצר</th>
              <th style={{ padding: '15px', borderBottom: '2px solid black', textAlign: 'center' }}>כמות</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(totals.itemsCount).map(([name, qty]) => (
              <tr key={name} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '15px', fontWeight: '700' }}>{name}</td>
                <td style={{ padding: '15px', fontWeight: '900', textAlign: 'center' }}>{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
          <p>© {new Date().getFullYear()} שק"מ נייד - מערכת ניהול הזמנות חכמה</p>
        </div>
      </div>
    </div>
  );
}

// Main Admin Page
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');

  // Use simple check for demo purposes, in production use actual auth
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1234') { // Simple password as requested
      setIsLoggedIn(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setError('סיסמה שגויה!');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 font-sans" dir="rtl">
        <Head><title>כניסת מנהל | שק"מ נייד</title></Head>
        <div className="bg-black p-10 rounded-[40px] shadow-2xl w-full max-w-md border-[6px] border-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="text-center mb-10">
            <div className="bg-yellow-400 text-black w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-xl shadow-yellow-400/20">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-4xl font-black text-yellow-400 tracking-tighter mb-2">שק"מ נייד</h1>
            <p className="text-yellow-600/70 text-sm font-bold uppercase tracking-[0.2em]">לוח בקרה למנהל</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-yellow-400/60 text-xs font-black uppercase mr-1 tracking-widest">סיסמת כניסה</label>
              <input 
                autoFocus
                type="password"
                className="w-full bg-yellow-900/20 border-2 border-yellow-900/30 rounded-2xl px-6 py-4 text-yellow-400 outline-none focus:border-yellow-400 transition-all text-center text-2xl font-black tracking-[0.5em]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-center text-sm font-bold border border-red-500/20 animate-shake">
                {error}
              </div>
            )}

            <button type="submit" className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-yellow-400/20">
              כניסה למערכת
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans" dir="rtl">
      <Head><title>ניהול | שק"מ נייד</title></Head>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-black tracking-tighter">שלום, המנהל! 👋</h1>
                <p className="text-gray-500 font-bold mt-1 text-lg">ברוך הבא למערכת הניהול של שק"מ נייד.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border-2 border-black flex items-center gap-4 shadow-sm">
                <div className="bg-yellow-400 p-3 rounded-xl"><Truck size={24}/></div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">סטטוס רכב</p>
                  <p className="font-black text-black">בנסיעה פעילה</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'הזמנות היום', value: '24', icon: ShoppingBag, color: 'bg-black' },
                { label: 'הכנסות היום', value: '₪1,240', icon: LayoutDashboard, color: 'bg-black' },
                { label: 'נסיעות החודש', value: '18', icon: Truck, color: 'bg-black' },
                { label: 'מוצרים חסרים', value: '3', icon: AlertCircle, color: 'bg-black' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:border-yellow-400 transition-all duration-300">
                  <div className={`${stat.color} text-yellow-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-black/5`}>
                    <stat.icon size={28} className="stroke-[2]" />
                  </div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-3xl font-black text-black mt-2 tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-black text-white p-10 rounded-[48px] relative overflow-hidden group border-4 border-black">
                <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-yellow-400/20 transition-all duration-500"></div>
                <h3 className="text-3xl font-black mb-4 relative z-10 text-yellow-400">ניהול מלאי מהיר</h3>
                <p className="text-gray-400 font-medium mb-8 relative z-10 leading-relaxed max-w-sm">עדכן מחירים ושמות מוצרים בתוך שניות כדי שהרכב יוכל להמשיך למכור.</p>
                <div className="flex gap-4 relative z-10">
                  <button onClick={() => setActiveTab('products')} className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-yellow-400/10">לניהול מוצרים</button>
                  <button 
                    onClick={async () => {
                      if(confirm('האם לייבא את רשימת המוצרים הראשונית?')) {
                        const res = await fetch('/api/seed');
                        const data = await res.json();
                        alert(data.message || 'בוצע!');
                      }
                    }} 
                    className="border-2 border-white/10 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/5 transition-all"
                  >
                    ייבוא ראשוני
                  </button>
                </div>
              </div>
              <div className="bg-yellow-400 text-black p-10 rounded-[48px] relative overflow-hidden group border-4 border-yellow-400 shadow-xl shadow-yellow-400/10">
                <div className="absolute top-0 right-0 w-80 h-80 bg-black/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-black/10 transition-all duration-500"></div>
                <h3 className="text-3xl font-black mb-4 relative z-10">דוחות ורווחים</h3>
                <p className="text-black/60 font-medium mb-8 relative z-10 leading-relaxed max-w-sm">הפק דוחות PDF מעוצבים לכל נסיעה כדי לעקוב אחרי הרווחים והמלאי.</p>
                <button onClick={() => setActiveTab('reports')} className="bg-black text-yellow-400 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-black/10">לצפייה בדוחות</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'trips' && <TripManager />}
        {activeTab === 'reports' && <Reports />}
      </main>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap');
        body { font-family: 'Rubik', sans-serif; background-color: #fcfcfc; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
