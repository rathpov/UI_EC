import React, { useState, useMemo } from 'react';
import {
  ShoppingCart, Plus, Minus, Trash2, ArrowRight, ArrowLeft,
  CheckCircle2, Store, CreditCard, Truck, AlertCircle,
  Calendar, User, MapPin, Phone, Mail, RotateCcw
} from 'lucide-react';
import laptopImg from '../assets/laptop.jpg';
import mouseImg from '../assets/mouse.jpg';
import keyboardImg from '../assets/keyboard.jpg';
import monitorImg from '../assets/monitor.jpg';

const PRODUCTS = [
  {
    id: 1,
    name: 'Laptop',
    category: 'Computers',
    price: 650,
    image: laptopImg,
    description: 'High-performance laptop for work, coding, and study.',
    specs: '15.6" FHD • 16GB RAM • 512GB SSD'
  },
  {
    id: 2,
    name: 'Mouse',
    category: 'Accessories',
    price: 15,
    image: mouseImg,
    description: 'Ergonomic wireless optical mouse with silent clicks.',
    specs: '2.4GHz Wireless • 1600 DPI • Ergonomic'
  },
  {
    id: 3,
    name: 'Keyboard',
    category: 'Accessories',
    price: 25,
    image: keyboardImg,
    description: 'Tactile backlit mechanical keyboard for fast typing.',
    specs: 'Mechanical Switches • LED Backlit • USB-C'
  },
  {
    id: 4,
    name: 'Monitor',
    category: 'Displays',
    price: 120,
    image: monitorImg,
    description: '24-inch Full HD IPS monitor with ultra-thin bezels.',
    specs: '24" IPS • 1080p • 75Hz • HDMI/VGA'
  }
];

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', duration: '2 - 3 Business Days', cost: 0 },
  { id: 'express', name: 'Express Delivery', duration: 'Same Day / Next Day', cost: 10 },
  { id: 'pickup', name: 'Store Pickup', duration: 'Ready in 2 Hours', cost: 0 }
];

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  shippingMethod: 'standard'
};

export default function App() {
  const [tab, setTab] = useState('shop');
  const [cart, setCart] = useState([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[1], quantity: 1 }
  ]);
  const [addedId, setAddedId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [orderSeq, setOrderSeq] = useState(1);
  const [order, setOrder] = useState(null);

  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [cart]);
  const shipping = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === form.shippingMethod) || SHIPPING_METHODS[0],
    [form.shippingMethod]
  );
  const grandTotal = subtotal + shipping.cost;

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      return found
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId((curr) => (curr === product.id ? null : curr)), 1000);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Invalid email address';
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!form.address.trim()) nextErrors.address = 'Address is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!cart.length || !validateForm()) return;

    setOrder({
      orderId: `ORD-${String(orderSeq).padStart(4, '0')}`,
      customerName: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      shippingMethod: shipping.name,
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cart],
      totalAmount: grandTotal,
      status: 'Pending'
    });
    setOrderSeq((n) => n + 1);
    setCart([]);
    setTab('confirmation');
  };

  const resetOrder = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setTab('shop');
  };

  const navTabs = [
    { id: 'shop', label: 'Products', icon: Store },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: totalItems },
    { id: 'checkout', label: 'Checkout', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle2, disabled: !order }
  ];

  const formFields = [
    { name: 'firstName', label: 'First Name', placeholder: 'Sokha', icon: User },
    { name: 'lastName', label: 'Last Name', placeholder: 'Chan', icon: User },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'sokha.chan@example.com', icon: Mail },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '012 345 678', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div onClick={() => setTab('shop')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-base text-slate-900 leading-tight">TechStore</h1>
              <p className="text-xs text-slate-400">E-Commerce Store</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5">
            {navTabs.map(({ id, label, icon: Icon, badge, disabled }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  disabled={disabled}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white'
                      : disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-xs font-semibold rounded-md ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {tab === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Product Catalog</h2>
                <p className="text-slate-500 text-sm mt-1">Select products and add them to your shopping cart.</p>
              </div>
              <button
                onClick={() => setTab('cart')}
                className="inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart · {totalItems} items</span>
                <span className="text-slate-500">|</span>
                <span className="font-semibold">${subtotal}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRODUCTS.map((product) => {
                const inCart = cart.find((i) => i.product.id === product.id);
                const justAdded = addedId === product.id;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition flex flex-col overflow-hidden"
                  >
                    <div className="h-44 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 text-xs font-medium text-slate-700 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-slate-200/60">
                        {product.category}
                      </span>
                      {inCart && (
                        <span className="absolute top-3 right-3 text-xs font-medium bg-slate-900 text-white px-2 py-0.5 rounded-md">
                          {inCart.quantity} in cart
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-1.5">
                          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                          <span className="text-lg font-bold text-slate-900">${product.price}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3 leading-relaxed">{product.description}</p>
                        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 mb-4">
                          {product.specs}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition ${
                          justAdded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'cart' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setTab('shop')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3.5 py-2 rounded-lg transition self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
                <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mb-5">Browse the catalog to add products to your order.</p>
                <button
                  onClick={() => setTab('shop')}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  <Store className="w-4 h-4" /> Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200/60 shrink-0"
                        />
                        <div>
                          <h3 className="font-semibold text-base text-slate-900">{product.name}</h3>
                          <p className="text-sm text-slate-500">${product.price} each</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                          <button
                            onClick={() => updateQty(product.id, -1)}
                            className="w-7 h-7 rounded-md bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/60"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-sm font-semibold">{quantity}</span>
                          <button
                            onClick={() => updateQty(product.id, 1)}
                            className="w-7 h-7 rounded-md bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/60"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right min-w-[70px]">
                          <div className="text-xs text-slate-400">Total</div>
                          <div className="font-semibold text-base text-slate-900">${product.price * quantity}</div>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200/80 h-fit space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Cart Summary</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Estimated Shipping</span>
                      <span className="text-slate-700 font-medium">
                        {shipping.cost === 0 ? 'Free' : `$${shipping.cost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3.5 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-900">Grand Total</span>
                    <span className="text-xl font-bold text-slate-900">${grandTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setTab('checkout')}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <span>Proceed to Checkout</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'checkout' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Checkout</h2>
              </div>
              <button
                onClick={() => setTab('cart')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/70 px-3.5 py-2 rounded-lg transition self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center">
                <p className="text-sm text-slate-500 mb-4">Your cart is empty. Add products before checking out.</p>
                <button onClick={() => setTab('shop')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Go to Products
                </button>
              </div>
            ) : (
              <form onSubmit={placeOrder} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200/80 space-y-5">
                  <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" /> Customer Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formFields.map(({ name, label, type = 'text', placeholder, icon: Icon }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {label} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                          <input
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleFieldChange}
                            placeholder={placeholder}
                            className={`w-full pl-10 pr-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition ${
                              errors[name]
                                ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-100'
                                : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
                            }`}
                          />
                        </div>
                        {errors[name] && (
                          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors[name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <textarea
                        name="address"
                        rows="2"
                        value={form.address}
                        onChange={handleFieldChange}
                        placeholder="Street 271, Toul Kork, Phnom Penh"
                        className={`w-full pl-10 pr-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition ${
                          errors.address
                            ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-100'
                            : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-500" /> Shipping Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {SHIPPING_METHODS.map((m) => {
                        const selected = form.shippingMethod === m.id;
                        return (
                          <label
                            key={m.id}
                            className={`cursor-pointer rounded-lg border p-3.5 transition flex flex-col justify-between ${
                              selected ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={m.id}
                                checked={selected}
                                onChange={handleFieldChange}
                                className="mt-0.5 accent-slate-900"
                              />
                              <span className="font-semibold text-xs text-slate-700">
                                {m.cost === 0 ? 'Free' : `$${m.cost}`}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="font-medium text-sm text-slate-900">{m.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{m.duration}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200/80 h-fit space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                        <div>
                          <span className="font-medium text-slate-800">{product.name}</span>
                          <span className="text-slate-400 ml-1.5">× {quantity}</span>
                        </div>
                        <span className="font-medium text-slate-900">${(product.price * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping</span>
                      <span className="font-medium text-slate-900">${shipping.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                      <span className="text-sm font-semibold text-slate-900">Grand Total</span>
                      <span className="text-xl font-bold text-slate-900">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> <span>Place Order</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {tab === 'confirmation' && order && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-emerald-50/80 border border-emerald-200/80 text-slate-900 p-7 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Your order has been recorded and is currently awaiting processing.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-lg border border-slate-100">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Order ID</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{order.orderId}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Order Status</div>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {order.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Customer Name</div>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{order.customerName}</div>
                    <div className="text-xs text-slate-500">
                      {order.phone} · {order.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Order Date</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {order.orderDate}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{order.address}</div>
                  </div>
                </div>

                <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Product</th>
                        <th className="py-2.5 px-4 font-semibold text-center">Unit Price</th>
                        <th className="py-2.5 px-4 font-semibold text-center">QTY</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map(({ product, quantity }) => (
                        <tr key={product.id}>
                          <td className="py-3 px-4 font-medium text-slate-900">{product.name}</td>
                          <td className="py-3 px-4 text-center text-slate-500">${product.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center font-medium text-slate-800">{quantity}</td>
                          <td className="py-3 px-4 text-right font-semibold text-slate-900">
                            ${(product.price * quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    Shipping: <span className="font-medium text-slate-700">{order.shippingMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500 mr-2.5">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex justify-end">
                <button
                  onClick={resetOrder}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}