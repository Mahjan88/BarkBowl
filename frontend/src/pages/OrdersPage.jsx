import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Package, Truck, CheckCircle, Clock, X } from 'lucide-react'

const STATUS_CONFIG = {
  confirmed:        { label: 'Confirmed',       color: 'bg-amber-100 text-amber-700',  icon: Clock       },
  preparing:        { label: 'Preparing',        color: 'bg-orange-100 text-orange-700', icon: Package    },
  packed:           { label: 'Packed',           color: 'bg-blue-100 text-blue-700',    icon: Package     },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-700', icon: Truck      },
  delivered:        { label: 'Delivered',        color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  cancelled:        { label: 'Cancelled',        color: 'bg-stone-100 text-stone-500',  icon: X           },
}

const TRACKING_STEPS = ['confirmed', 'preparing', 'packed', 'out_for_delivery', 'delivered']

function TrackingBar({ status }) {
  const currentIdx = TRACKING_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-0">
      {TRACKING_STEPS.map((step, i) => {
        const done = i <= currentIdx && status !== 'cancelled'
        const { label } = STATUS_CONFIG[step]
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full border-2 transition-all
                              ${done ? 'bg-teal-500 border-teal-500' : 'bg-white border-stone-200'}`} />
              <span className="text-[9px] text-stone-400 mt-0.5 text-center w-12 leading-tight">{label}</span>
            </div>
            {i < TRACKING_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 mb-3 rounded ${i < currentIdx && status !== 'cancelled' ? 'bg-teal-400' : 'bg-stone-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/orders')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pb-24">
      <span className="text-3xl animate-bounce">🐾</span>
    </div>
  )

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-24">
        <span className="text-5xl mb-3">📦</span>
        <h2 className="text-xl font-bold text-stone-700">No orders yet</h2>
        <p className="text-stone-400 text-sm mt-1">Your order history will appear here.</p>
      </div>
    )
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-stone-800">Orders</h1>
        <p className="text-stone-500 text-sm">{orders.length} order{orders.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 space-y-3">
        {orders.map(order => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed
          const StatusIcon = cfg.icon
          const isExpanded = expanded === order.id

          return (
            <div key={order.id} className="card overflow-visible">
              <button
                className="w-full p-4 text-left"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-stone-800">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>
                      {order.subscription_type && (
                        <span className="text-xs bg-teal-100 text-teal-700 font-medium px-1.5 py-0.5 rounded-full">
                          {order.subscription_type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {order.dogs && ` · For ${order.dogs.name}`}
                    </p>
                    <p className="text-sm font-semibold text-stone-700 mt-1">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <span className={`badge ${cfg.color} flex items-center gap-1 shrink-0`}>
                    <StatusIcon size={11} />
                    {cfg.label}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
                  {/* Tracking */}
                  {order.status !== 'cancelled' && (
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Tracking</p>
                      <TrackingBar status={order.status} />
                    </div>
                  )}

                  {/* Items */}
                  {order.order_items?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Items</p>
                      <div className="space-y-1">
                        {order.order_items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm text-stone-600">
                            <span>{item.item_name} × {item.quantity}</span>
                            <span>${parseFloat(item.unit_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery address */}
                  {order.delivery_address && (
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Delivery To</p>
                      <p className="text-sm text-stone-600">{order.delivery_address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
