import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'
import { useToast }   from '../context/ToastContext'
import Stepper from '../components/Stepper'
import ConfirmModal from '../components/ConfirmModal'
import axios from 'axios'

const METODOS_PAGO = [
  {
    id: 'efectivo',
    icon: '💵',
    label: 'Efectivo',
    desc: 'Paga al recoger',
  },
  {
    id: 'tarjeta',
    icon: '💳',
    label: 'Tarjeta',
    desc: 'Débito o crédito',
  },
]

export default function Confirmacion() {
  const { items, total, horario, vaciar } = useCarrito()
  const { registrarPedido, monedas }      = usePuntos()
  const [enviando,       setEnviando]     = useState(false)
  const [exito,          setExito]        = useState(false)
  const [pedidoId,       setPedidoId]     = useState(null)
  const [confirmarModal, setConfirmarModal] = useState(false)
  const [metodoPago,     setMetodoPago]   = useState('')
  const toast    = useToast()
  const navigate = useNavigate()

  async function enviarPedido() {
    setConfirmarModal(false)
    if (!horario || items.length === 0) return
    setEnviando(true)
    try {
      const productos = items.map(i => ({
        id: i.producto.id, nombre: i.producto.nombre,
        precio: i.producto.precio, cantidad: i.cantidad, nota: i.nota,
      }))
      const { data } = await axios.post(
        'https://cafeucolback-production.up.railway.app/api/pedidos',
        { productos, horario, metodoPago }
      )
      setPedidoId(data.id)
      const categories = [...new Set(items.map(i => i.producto.categoria || 'general'))]
      registrarPedido({ horario, categorias: categories })
      vaciar()
      setExito(true)
    } catch (e) {
      toast.push('error', 'Error al enviar el pedido', 'Hubo un problema al procesar tu pedido. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  // ── Pantalla de éxito ──
  if (exito) return (
    <div className="page-content" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
      <div style={{ fontSize: 80, animation: 'pop .4s ease' }}>✅</div>
      <h2 style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 28, marginTop: 20 }}>¡Pedido enviado!</h2>
      <p style={{ color: 'var(--gris-texto)', marginTop: 10, fontSize: 15, lineHeight: 1.7 }}>
        Tu pedido <strong>#{pedidoId}</strong> está siendo preparado.<br />
        Pasa a recogerlo a las <strong>{horario}</strong> en la cafetería.
      </p>
      <div style={{
        background: 'var(--amber-light)', borderRadius: 16,
        padding: '18px 28px', marginTop: 28,
        display: 'inline-flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 32 }}>🪙</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>+30 CaféCoins ganados</div>
          <div style={{ fontSize: 13, color: '#92400E', marginTop: 2 }}>Total acumulado: {monedas} monedas</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <button className="btn btn-primary" onClick={() => navigate('/historial')}>Ver mis pedidos</button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Volver al Menú</button>
      </div>
    </div>
  )

  return (
    <div>
      <Stepper actual={3} />

      {/* Modal confirmación final antes de enviar */}
      {confirmarModal && (
        <ConfirmModal
          titulo="¿Confirmar pedido?"
          mensaje={`Enviarás un pedido por $${total} para recoger a las ${horario}. Método de pago: ${metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}.`}
          labelConfirmar="Sí, enviar pedido"
          labelCancelar="Revisar de nuevo"
          onConfirmar={enviarPedido}
          onCancelar={() => setConfirmarModal(false)}
        />
      )}

      <div 
        className="page-content" 
        style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }} 
        data-grid="confirmar"
      >
        {/* ── Columna Izquierda: Detalles del pedido ── */}
        <div>
          {/* Resumen productos */}
          <div className="section-title">🧾 Resumen completo del pedido</div>
          <div className="card">
            {items.map(({ producto, cantidad, nota }, i) => (
              <div key={producto.id} style={{
                padding: '14px 18px',
                borderBottom: i < items.length - 1 ? '1px solid var(--gris-borde)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{cantidad}× {producto.nombre}</div>
                  {nota && (
                    <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 4,
                      background: 'var(--gris-bg)', padding: '4px 8px', borderRadius: 6, display: 'inline-block' }}>
                      📝 {nota}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--verde-mid)', flexShrink: 0 }}>
                  ${producto.precio * cantidad}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/carrito')}>
            ← Modificar pedido
          </button>

          {/* Selección de Método de pago */}
          <div className="section-title" style={{ marginTop: 28 }}>💳 Método de pago</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {METODOS_PAGO.map(m => (
              <button
                key={m.id}
                onClick={() => setMetodoPago(m.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '20px 14px',
                  borderRadius: 12,
                  border: metodoPago === m.id
                    ? '2px solid var(--verde-mid)'
                    : '2px solid var(--gris-borde)',
                  background: metodoPago === m.id ? 'var(--amber-light)' : 'var(--gris-bg)',
                  cursor: 'pointer',
                  transition: 'all .18s ease',
                  fontFamily: 'inherit',
                  position: 'relative',
                }}
              >
                {metodoPago === m.id && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'var(--verde-mid)', color: '#fff',
                    borderRadius: '50%', width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900,
                  }}>✓</span>
                )}
                <span style={{ fontSize: 32 }}>{m.icon}</span>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main, #1a1a1a)' }}>{m.label}</span>
                <span style={{ fontSize: 12, color: 'var(--gris-texto)' }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Columna Derecha: Panel lateral de acciones ── */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Horario */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gris-texto)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
              Horario de recolección
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 28, fontWeight: 800, color: 'var(--verde-mid)' }}>
                ⏰ {horario}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/horario')} title="Cambiar horario">
                Cambiar
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gris-texto)', marginBottom: 6 }}>
              <span>Subtotal</span><span>${total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gris-texto)', paddingBottom: 12, borderBottom: '1px solid var(--gris-borde)', marginBottom: 12 }}>
              <span>Servicio</span><span>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: 26, color: 'var(--verde-mid)' }}>${total}</span>
            </div>
          </div>

          {/* Resumen del método seleccionado en el panel lateral */}
          {metodoPago && (
            <div style={{
              background: 'var(--gris-bg)', border: '1.5px solid var(--gris-borde)',
              borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>
                {METODOS_PAGO.find(m => m.id === metodoPago)?.icon}
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gris-texto)' }}>
                Pagarás con <strong style={{ color: 'var(--text-main, #1a1a1a)' }}>
                  {METODOS_PAGO.find(m => m.id === metodoPago)?.label}
                </strong>
              </div>
            </div>
          )}

          {/* CaféCoins */}
          <div style={{ background: 'var(--amber-light)', border: '2px solid #FDE68A', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🪙</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
              Ganarás +30 CaféCoins al confirmar
            </div>
          </div>

          {/* Botón Principal */}
          <button
            className="btn btn-primary btn-full"
            onClick={() => setConfirmarModal(true)}
            disabled={enviando || !metodoPago}
            aria-busy={enviando}
            title={!metodoPago ? 'Selecciona un método de pago' : ''}
          >
            {enviando ? '⏳ Enviando pedido...' : '✓ Confirmar Pedido'}
          </button>

          {!metodoPago && (
            <p style={{ fontSize: 12, color: 'var(--gris-texto)', textAlign: 'center', margin: 0 }}>
              Selecciona un método de pago para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}