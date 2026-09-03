import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, Check, Eye, EyeOff, ImagePlus, LoaderCircle, LogIn, LogOut, PackagePlus, Pencil, Save, ShieldCheck, Trash2, X } from 'lucide-react'
import { formatPrice, type CatalogProduct } from './lib/catalog-data'
import { isSupabaseConfigured, supabase } from './lib/supabase'

type ProductForm = {
  id?: string
  code?: string
  name: string
  description: string
  category: string
  price: string
  status: string
  stock: string
  image_url: string
  active: boolean
  featured: boolean
}

const EMPTY_FORM: ProductForm = { name: '', description: '', category: 'Personalizados', price: '', status: 'Disponível sob encomenda', stock: '', image_url: '', active: true, featured: false }

function AdminLogo() {
  return <a className="admin-brand" href="./index.html"><img src="/logo-oficial.png" alt="RRL Impressões 3D" /><span><b>PAINEL RRL</b><small>GESTÃO DO CATÁLOGO</small></span></a>
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadProducts = async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) setMessage(`Não foi possível carregar os produtos: ${error.message}`)
    else setProducts((data ?? []) as CatalogProduct[])
  }

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    const verifyAdmin = async (nextSession: Session | null) => {
      if (!nextSession) { setSession(null); setCheckingSession(false); return }
      const { data: isAdmin, error } = await client.rpc('is_catalog_admin')
      if (error || !isAdmin) {
        await client.auth.signOut()
        setSession(null)
        setMessage('Esta conta não possui permissão para administrar o catálogo.')
      } else {
        setSession(nextSession)
        await loadProducts()
      }
      setCheckingSession(false)
    }
    void client.auth.getSession().then(({ data }) => void verifyAdmin(data.session))
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      window.setTimeout(() => void verifyAdmin(nextSession), 0)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage('E-mail ou senha incorretos.')
    setBusy(false)
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setImageFile(null)
    setShowForm(false)
  }

  const editProduct = (product: CatalogProduct) => {
    setForm({ id: product.id, code: product.code, name: product.name, description: product.description, category: product.category, price: product.price?.toString().replace('.', ',') ?? '', status: product.status, stock: product.stock?.toString() ?? '', image_url: product.image_url, active: product.active, featured: product.featured })
    setImageFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    if (!form.image_url && !imageFile) { setMessage('Adicione uma fotografia do produto.'); return }
    if (imageFile && imageFile.size > 5 * 1024 * 1024) { setMessage('A fotografia deve ter no máximo 5 MB.'); return }
    if (form.price.trim() && !Number.isFinite(Number(form.price.replace(',', '.')))) { setMessage('Informe um preço válido ou deixe o campo vazio.'); return }
    setBusy(true); setMessage('')
    let imageUrl = form.image_url

    if (imageFile) {
      const extension = imageFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
      const filePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile, { cacheControl: '3600', upsert: false })
      if (uploadError) { setMessage(`Erro ao enviar a imagem: ${uploadError.message}`); setBusy(false); return }
      imageUrl = supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl
    }

    const parsedPrice = form.price.trim() ? Number(form.price.replace(',', '.')) : null
    const parsedStock = form.stock.trim() ? Number(form.stock) : null
    const payload = { name: form.name.trim(), description: form.description.trim(), category: form.category.trim(), price: parsedPrice, status: form.status, stock: parsedStock, image_url: imageUrl, active: form.active, featured: form.featured }
    const result = form.id
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert(payload)

    if (result.error) setMessage(`Não foi possível salvar: ${result.error.message}`)
    else { setMessage(form.id ? 'Produto atualizado com sucesso.' : 'Produto publicado com sucesso.'); resetForm(); await loadProducts() }
    setBusy(false)
  }

  const toggleVisibility = async (product: CatalogProduct) => {
    if (!supabase) return
    const { error } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    if (error) setMessage(`Não foi possível alterar a visibilidade: ${error.message}`)
    else await loadProducts()
  }

  const deleteProduct = async (product: CatalogProduct) => {
    if (!supabase || !window.confirm(`Excluir definitivamente ${product.code} — ${product.name}?`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) setMessage(`Não foi possível excluir: ${error.message}`)
    else { setMessage('Produto excluído.'); await loadProducts() }
  }

  if (!isSupabaseConfigured) return <main className="admin-setup"><div><AdminLogo /><ShieldCheck /><span>CONFIGURAÇÃO NECESSÁRIA</span><h1>Conecte o painel<br />ao Supabase.</h1><p>Copie <code>.env.example</code> para <code>.env.local</code> e preencha a URL e a chave pública do projeto.</p><a href="./catalogo.html"><ArrowLeft /> Voltar ao catálogo</a></div></main>

  if (checkingSession) return <main className="admin-loading"><LoaderCircle /><span>Preparando o painel</span></main>

  if (!session) return <main className="admin-login"><div className="admin-login-art"><AdminLogo /><div><span>CATÁLOGO SOB CONTROLE</span><h1>Novas peças.<br /><em>Sem mexer no código.</em></h1><p>Cadastre produtos, atualize preços e publique fotografias em poucos passos.</p></div></div><form onSubmit={login}><div><ShieldCheck /><span>ACESSO RESTRITO</span><h2>Entrar no painel</h2><p>Use a conta administrativa da RRL.</p></div><label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></label><label>Senha<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{message && <p className="admin-message error">{message}</p>}<button disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <LogIn />} Entrar</button><a href="./catalogo.html"><ArrowLeft /> Voltar ao catálogo</a></form></main>

  return <div className="admin-page">
    <header className="admin-header"><AdminLogo /><div><span>{session.user.email}</span><a href="./catalogo.html" target="_blank">Ver catálogo</a><button onClick={() => void supabase?.auth.signOut()}><LogOut /> Sair</button></div></header>
    <main className="admin-main">
      <section className="admin-title"><div><span>GESTÃO DO CATÁLOGO</span><h1>Produtos</h1><p>{products.length} {products.length === 1 ? 'item cadastrado' : 'itens cadastrados'}</p></div><button className="admin-add" onClick={() => { resetForm(); setShowForm(true) }}><PackagePlus /> Novo produto</button></section>
      {message && <div className="admin-message"><Check /> {message}<button onClick={() => setMessage('')} aria-label="Fechar aviso"><X /></button></div>}

      {showForm && <section className="admin-editor">
        <div className="admin-editor-head"><div><span>{form.id ? `EDITANDO ${form.code}` : 'NOVO ITEM'}</span><h2>{form.id ? 'Atualizar produto' : 'Adicionar ao catálogo'}</h2></div><button onClick={resetForm} aria-label="Fechar formulário"><X /></button></div>
        <form onSubmit={saveProduct}>
          <label className="field-wide">Nome da peça<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} maxLength={120} required /></label>
          <label>Categoria<input value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} list="catalog-categories" required /><datalist id="catalog-categories"><option>Personalizados</option><option>Articulados</option><option>Decoração</option><option>Funcionais</option><option>Outros</option></datalist></label>
          <label>Preço em reais<input value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} inputMode="decimal" placeholder="Deixe vazio para Sob consulta" /></label>
          <label>Estoque<input type="number" min="0" value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} placeholder="Vazio para sob encomenda" /></label>
          <label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option>Disponível</option><option>Disponível sob encomenda</option><option>Produção personalizada</option><option>Últimas unidades</option></select></label>
          <label className="field-wide">Descrição<textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={4} required /></label>
          <label className="admin-upload field-wide"><ImagePlus /><span><b>{imageFile ? imageFile.name : form.image_url ? 'Trocar fotografia' : 'Adicionar fotografia'}</b><small>JPG, PNG, WebP ou AVIF — máximo de 5 MB</small></span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => setImageFile(event.target.files?.[0] ?? null)} /></label>
          <label className="admin-check"><input type="checkbox" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} /><span>Visível no catálogo</span></label>
          <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={event => setForm({ ...form, featured: event.target.checked })} /><span>Produto em destaque</span></label>
          <div className="admin-form-actions field-wide"><button type="button" onClick={resetForm}>Cancelar</button><button className="save" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <Save />} {form.id ? 'Salvar alterações' : 'Publicar produto'}</button></div>
        </form>
      </section>}

      <section className="admin-products">
        {products.map(product => <article key={product.id} className={!product.active ? 'inactive' : ''}><img src={product.image_url} alt="" /><div className="admin-product-info"><span>{product.code} · {product.category}</span><h3>{product.name}</h3><p>{formatPrice(product.price)}{product.stock !== null ? ` · Estoque: ${product.stock}` : ' · Sob encomenda'}</p></div><div className="admin-product-status"><i className={product.active ? '' : 'off'} />{product.active ? 'Publicado' : 'Oculto'}</div><div className="admin-product-actions"><button onClick={() => editProduct(product)} title="Editar"><Pencil /></button><button onClick={() => void toggleVisibility(product)} title={product.active ? 'Ocultar' : 'Publicar'}>{product.active ? <EyeOff /> : <Eye />}</button><button className="danger" onClick={() => void deleteProduct(product)} title="Excluir"><Trash2 /></button></div></article>)}
        {products.length === 0 && <div className="admin-empty"><PackagePlus /><h3>O catálogo ainda está vazio.</h3><p>Cadastre a primeira peça para começar.</p></div>}
      </section>
    </main>
  </div>
}
