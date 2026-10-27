import { useState, useEffect, useMemo } from 'react'

const fmt = n => n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + ' soʻm'
const CATS = ['Badiiy', 'Tarixiy', 'Bolalar', 'Biznes', 'Ilmiy']
const BOOKS = [
  { id: 1, t: 'Oʻtkan kunlar', a: 'Abdulla Qodiriy', c: 'Badiiy', p: 65000, r: 4.9, d: 'Oʻzbek adabiyotining ilk romani: Otabek va Kumushning ishqi hamda Turkiston tarixi.', g: ['#8a3b1e', '#d98e4a'] },
  { id: 2, t: 'Mehrobdan chayon', a: 'Abdulla Qodiriy', c: 'Badiiy', p: 58000, r: 4.8, d: 'Xon saroyidagi fitnalar va sodda yurakdagi muhabbat haqida qissa.', g: ['#2f5d50', '#7fb89f'] },
  { id: 3, t: 'Sariq devni minib', a: 'Xudoyberdi Toʻxtaboyev', c: 'Bolalar', p: 42000, r: 4.9, d: 'Hajviy va sarguzashtga boy, bolalar sevib oʻqiydigan qissa.', g: ['#c28a00', '#f2d16b'] },
  { id: 4, t: 'Temur tuzuklari', a: 'Amir Temur', c: 'Tarixiy', p: 72000, r: 4.7, d: 'Buyuk sohibqironning davlat boshqaruvi va harbiy ishlar haqidagi pandlari.', g: ['#1f3a5f', '#5c8ac4'] },
  { id: 5, t: 'Boburnoma', a: 'Zahiriddin Bobur', c: 'Tarixiy', p: 85000, r: 4.8, d: 'Bobur Mirzoning xotiralari: sarguzashtlar, tabiat va odamlar tasviri.', g: ['#5b2a4e', '#b573a3'] },
  { id: 6, t: 'Ikki eshik orasi', a: 'Oʻtkir Hoshimov', c: 'Badiiy', p: 61000, r: 4.8, d: 'Mustabid davr kishilari taqdiri aks etgan mashhur roman.', g: ['#3d4a2b', '#9bb36b'] },
  { id: 7, t: 'Dunyoning ishlari', a: 'Oʻtkir Hoshimov', c: 'Badiiy', p: 48000, r: 4.9, d: 'Ona, mehr va hayot haqidagi samimiy, yurakka yaqin qissa.', g: ['#7a2e2e', '#d77c7c'] },
  { id: 8, t: 'Boy ota, kambagʻal ota', a: 'Robert Kiyosaki', c: 'Biznes', p: 79000, r: 4.6, d: 'Pul, investitsiya va moliyaviy savodxonlik haqida eng mashhur kitoblardan biri.', g: ['#14532d', '#4ade80'] },
  { id: 9, t: 'Atom odatlar', a: 'James Clear', c: 'Biznes', p: 89000, r: 4.8, d: 'Kichik odatlar orqali katta natijalarga erishish yoʻllari.', g: ['#9a3412', '#fb923c'] },
  { id: 10, t: 'Qisqa vaqt tarixi', a: 'Stiven Xoking', c: 'Ilmiy', p: 92000, r: 4.7, d: 'Koinotning paydo boʻlishi va qora tuynuklar haqida oddiy tilda.', g: ['#1e1b4b', '#6366f1'] },
  { id: 11, t: 'Alisher Navoiy ertaklari', a: 'Toʻplam', c: 'Bolalar', p: 39000, r: 4.5, d: 'Navoiy hikmatlari asosidagi rangli bolalar ertaklari.', g: ['#0e7490', '#67e8f9'] },
  { id: 12, t: 'Xamsa', a: 'Alisher Navoiy', c: 'Tarixiy', p: 120000, r: 4.9, d: 'Besh dostondan iborat buyuk shoir asari, nasriy bayon bilan.', g: ['#713f12', '#eab308'] },
]

const load = (k, d) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d }
}
const save = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}
const grad = b => ({ background: `linear-gradient(160deg,${b.g[0]},${b.g[1]})` })

function Cover({ b }) {
  return (
    <div className="cover" style={grad(b)}>
      {b.t}
      <small>{b.a}</small>
    </div>
  )
}

function BookCard({ b, add, open }) {
  return (
    <div className="card">
      <div onClick={() => open(b)} style={{ cursor: 'pointer' }}><Cover b={b} /></div>
      <div className="info">
        <b>{b.t}</b>
        <span className="mute">{b.a}</span>
        <span className="mute">★ {b.r}</span>
        <span className="price">{fmt(b.p)}</span>
        <button className="btn" onClick={() => add(b)}>Savatga</button>
      </div>
    </div>
  )
}

function Home({ go, add, open, setCat }) {
  return (
    <div>
      <div className="hero">
        <h1>Oʻqigan kishi — oʻsgan kishi</h1>
        <p>Eng sara badiiy, tarixiy va ilmiy kitoblar. Tez yetkazib berish va qulay narxlar.</p>
        <button className="btn" onClick={() => go('catalog')}>Katalogni koʻrish</button>
      </div>
      <div className="sec"><h2>Kategoriyalar</h2></div>
      <div className="row" style={{ margin: 0 }}>
        {CATS.map(c => (
          <button key={c} className="chip" onClick={() => { setCat(c); go('catalog') }}>{c}</button>
        ))}
      </div>
      <div className="sec">
        <h2>Ommabop kitoblar</h2>
        <a onClick={() => go('catalog')}>Hammasi →</a>
      </div>
      <div className="grid">
        {BOOKS.filter(b => b.r >= 4.8).slice(0, 6).map(b => (
          <BookCard key={b.id} b={b} add={add} open={open} />
        ))}
      </div>
    </div>
  )
}

function Catalog({ add, open, cat, setCat }) {
  const [q, setQ] = useState('')
  const [s, setS] = useState('pop')
  const list = useMemo(() => {
    let l = BOOKS.filter(b => (cat === 'Hammasi' || b.c === cat) && (b.t + b.a).toLowerCase().includes(q.toLowerCase()))
    if (s === 'lo') l = [...l].sort((a, b) => a.p - b.p)
    if (s === 'hi') l = [...l].sort((a, b) => b.p - a.p)
    if (s === 'pop') l = [...l].sort((a, b) => b.r - a.r)
    return l
  }, [q, s, cat])

  return (
    <div>
      <h2>Katalog</h2>
      <div className="row">
        <input placeholder="Kitob yoki muallifni qidiring…" value={q} onChange={e => setQ(e.target.value)} />
        <select value={s} onChange={e => setS(e.target.value)}>
          <option value="pop">Mashhurlik</option>
          <option value="lo">Arzonroq</option>
          <option value="hi">Qimmatroq</option>
        </select>
      </div>
      <div className="row" style={{ marginTop: 0 }}>
        {['Hammasi', ...CATS].map(c => (
          <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {list.length ? (
        <div className="grid">
          {list.map(b => <BookCard key={b.id} b={b} add={add} open={open} />)}
        </div>
      ) : <p className="mute">Hech narsa topilmadi.</p>}
    </div>
  )
}

function Cart({ cart, setCart, checkout, go }) {
  const items = cart.map(i => ({ ...i, b: BOOKS.find(b => b.id === i.id) }))
  const total = items.reduce((s, i) => s + i.b.p * i.q, 0)
  const ship = total > 0 && total < 200000 ? 15000 : 0
  const chg = (id, d) => setCart(cart.map(i => (i.id === id ? { ...i, q: i.q + d } : i)).filter(i => i.q > 0))

  if (!items.length) {
    return (
      <div>
        <h2>Savat</h2>
        <p className="mute">Savatingiz boʻsh.</p>
        <button className="btn" onClick={() => go('catalog')}>Xarid qilishni boshlash</button>
      </div>
    )
  }
  const between = { display: 'flex', justifyContent: 'space-between' }
  return (
    <div>
      <h2>Savat</h2>
      <div className="row"></div>
      {items.map(i => (
        <div className="line" key={i.id}>
          <div className="cover" style={grad(i.b)}></div>
          <div style={{ flex: 1 }}>
            <b>{i.b.t}</b>
            <div className="mute">{i.b.a}</div>
            <div className="price">{fmt(i.b.p)}</div>
          </div>
          <div className="qty">
            <button onClick={() => chg(i.id, -1)}>−</button>
            {i.q}
            <button onClick={() => chg(i.id, 1)}>+</button>
          </div>
        </div>
      ))}
      <div className="sum">
        <div style={between}><span>Kitoblar</span><span>{fmt(total)}</span></div>
        <div style={between}><span>Yetkazib berish</span><span>{ship ? fmt(ship) : 'Bepul'}</span></div>
        <div style={{ ...between, fontWeight: 700, fontSize: 18 }}><span>Jami</span><span>{fmt(total + ship)}</span></div>
        <span className="mute">200 000 soʻmdan yuqori buyurtmalarda yetkazib berish bepul.</span>
        <button className="btn" onClick={() => checkout(items, total + ship)}>Buyurtma berish</button>
      </div>
    </div>
  )
}

function Orders({ orders, go }) {
  if (!orders.length) {
    return (
      <div>
        <h2>Buyurtmalarim</h2>
        <p className="mute">Hozircha buyurtmalar yoʻq.</p>
        <button className="btn" onClick={() => go('catalog')}>Katalogga oʻtish</button>
      </div>
    )
  }
  return (
    <div>
      <h2>Buyurtmalarim</h2>
      <div className="row"></div>
      {orders.map(o => (
        <div className="sum" key={o.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <b>№ {o.id}</b>
            <span className="tag">{o.status}</span>
          </div>
          <span className="mute">{o.date}</span>
          {o.items.map(i => (
            <div key={i.t} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{i.t} × {i.q}</span>
              <span>{fmt(i.p * i.q)}</span>
            </div>
          ))}
          <div style={{ fontWeight: 700 }}>Jami: {fmt(o.total)}</div>
          <span className="mute">Manzil: {o.addr || 'koʻrsatilmagan'}</span>
        </div>
      ))}
    </div>
  )
}

function Profile({ prof, setProf, orders, toast, theme, setTheme }) {
  const [f, setF] = useState(prof)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const spent = orders.reduce((s, o) => s + o.total, 0)
  return (
    <div>
      <h2>Profil</h2>
      <div className="row">
        <span className="tag">Buyurtmalar: {orders.length}</span>
        <span className="tag">Xaridlar: {fmt(spent)}</span>
      </div>
      <div className="f">
        <label>Ism<input value={f.name} onChange={set('name')} /></label>
        <label>Email<input type="email" value={f.email} onChange={set('email')} /></label>
        <label>Telefon<input value={f.phone} onChange={set('phone')} placeholder="+998 90 123 45 67" /></label>
        <label>Yetkazib berish manzili
          <textarea rows="3" value={f.addr} onChange={set('addr')} placeholder="Shahar, koʻcha, uy" />
        </label>
        <div className="row" style={{ margin: 0 }}>
          <button className="btn" onClick={() => { setProf(f); toast('Profil saqlandi ✓') }}>Saqlash</button>
          <button className="btn alt" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀ Yorugʻ' : '☾ Tungi'} rejim
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [cart, setCart] = useState(() => load('cart', []))
  const [orders, setOrders] = useState(() => load('orders', []))
  const [prof, setProf] = useState(() => load('prof', { name: '', email: '', phone: '', addr: '' }))
  const [theme, setTheme] = useState(() => load('theme', null))
  const [cat, setCat] = useState('Hammasi')
  const [msg, setMsg] = useState('')
  const [sel, setSel] = useState(null)

  useEffect(() => save('cart', cart), [cart])
  useEffect(() => save('orders', orders), [orders])
  useEffect(() => save('prof', prof), [prof])
  useEffect(() => {
    if (theme) { document.documentElement.dataset.theme = theme; save('theme', theme) }
  }, [theme])

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 1800) }
  const go = p => { setPage(p); window.scrollTo(0, 0) }
  const add = b => {
    setCart(c => (c.find(i => i.id === b.id) ? c.map(i => (i.id === b.id ? { ...i, q: i.q + 1 } : i)) : [...c, { id: b.id, q: 1 }]))
    toast(`“${b.t}” savatga qoʻshildi`)
  }
  const checkout = (items, total) => {
    setOrders(o => [{
      id: 1000 + o.length + 1,
      date: new Date().toLocaleDateString('uz-UZ'),
      status: 'Yetkazilmoqda',
      total,
      addr: prof.addr,
      items: items.map(i => ({ t: i.b.t, p: i.b.p, q: i.q })),
    }, ...o])
    setCart([])
    toast('Buyurtma qabul qilindi!')
    go('orders')
  }

  const count = cart.reduce((s, i) => s + i.q, 0)
  const tabs = [['home', 'Bosh sahifa'], ['catalog', 'Katalog'], ['cart', 'Savat'], ['orders', 'Buyurtmalar'], ['profile', 'Profil']]
  const curTheme = theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  return (
    <div>
      <header>
        <div className="bar">
          <div className="logo" onClick={() => go('home')}>📚 Kitobxon</div>
          <nav>
            {tabs.map(([k, l]) => (
              <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>
                {l}{k === 'cart' && count ? <span className="badge">{count}</span> : null}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main>
        {page === 'home' && <Home go={go} add={add} open={setSel} setCat={setCat} />}
        {page === 'catalog' && <Catalog add={add} open={setSel} cat={cat} setCat={setCat} />}
        {page === 'cart' && <Cart cart={cart} setCart={setCart} checkout={checkout} go={go} />}
        {page === 'orders' && <Orders orders={orders} go={go} />}
        {page === 'profile' && <Profile prof={prof} setProf={setProf} orders={orders} toast={toast} theme={curTheme} setTheme={setTheme} />}
      </main>

      {sel && (
        <div className="modal" onClick={() => setSel(null)}>
          <div onClick={e => e.stopPropagation()}>
            <div style={{ width: 180 }}><Cover b={sel} /></div>
            <div style={{ flex: 1, minWidth: 200, fontFamily: 'system-ui,sans-serif' }}>
              <h2>{sel.t}</h2>
              <p className="mute">{sel.a} · {sel.c} · ★ {sel.r}</p>
              <p>{sel.d}</p>
              <div className="price" style={{ fontSize: 20 }}>{fmt(sel.p)}</div>
              <div className="row">
                <button className="btn" onClick={() => { add(sel); setSel(null) }}>Savatga qoʻshish</button>
                <button className="btn alt" onClick={() => setSel(null)}>Yopish</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {msg && <div className="toast">{msg}</div>}
    </div>
  )
}