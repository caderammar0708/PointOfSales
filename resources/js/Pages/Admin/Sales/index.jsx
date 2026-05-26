import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, products, comboOffers, couponOffers }) {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const searchInput = useRef(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {
        if (searchInput.current) searchInput.current.focus();
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        // Use discounted price if available
        const itemPrice = product.discounted_price || product.price;
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setCart([...cart, { 
                ...product, 
                qty: 1,
                unit_price: product.price, // Original price
                price: itemPrice // Discounted price for calculation
            }]);
        }
        setSearch('');
    };
    const addComboToCart = (combo) => {
        combo.products.forEach(product => {
            // Find if this product is already in the list to get its discounted price logic
            const fullProduct = products.find(p => p.id === product.id);
            if (fullProduct) {
                addToCart(fullProduct);
            }
        });
    };

    const applyCoupon = () => {
        if (!couponCode) return;
        const coupon = couponOffers.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (coupon) {
            if (cartTotal < coupon.min_bill_amount) {
                alert(`Min bill amount for this coupon is $${coupon.min_bill_amount}`);
                return;
            }
            setAppliedCoupon(coupon);
        } else {
            alert("Invalid Coupon Code");
            setAppliedCoupon(null);
        }
    };

    const updateQty = (id, amount) => {
        setCart(cart.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + amount) } : item
        ).filter(item => item.qty > 0));
    };

    const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const originalTotal = cart.reduce((sum, item) => sum + ((item.unit_price || item.price) * item.qty), 0);
    const itemSavings = originalTotal - cartTotal;
    
    const couponSavings = appliedCoupon ? (cartTotal * (appliedCoupon.discount_value / 100)) : 0;
    const finalTotal = cartTotal - couponSavings;
    const totalSavings = itemSavings + couponSavings;

    const handleCheckout = () => {
        if (cart.length === 0) return alert("Cart is empty!");

        router.post(route('sales.store'), {
            items: cart,
            total: finalTotal,
            payment_method: paymentMethod,
            discount: totalSavings,
            tax: 0,
            coupon_id: appliedCoupon?.id
        }, {
            onSuccess: () => {
                setCart([]);
                setAppliedCoupon(null);
                setCouponCode('');
            }
        });
    };

    // --- Render ---
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales Terminal</h2>}
        >
            <Head title="Sales" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Main POS Container */}
                    <div className="flex flex-col md:flex-row gap-6 h-[75vh]">

                        {/* LEFT: Product Selection Area */}
                        <div className="w-full md:w-3/5 flex flex-col">
                            <div className="bg-white p-4 shadow rounded-t-lg border-b">
                                <input
                                    ref={searchInput}
                                    type="text"
                                    value={search}
                                    placeholder="Search Product Name or Code..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="bg-white flex-1 p-4 overflow-y-auto rounded-b-lg shadow">
                                {/* Combo Offers Section */}
                                {comboOffers && comboOffers.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center">
                                            <span className="bg-indigo-600 w-2 h-4 rounded mr-2"></span>
                                            Active Combo Offers
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {comboOffers.map(combo => (
                                                <button
                                                    key={combo.id}
                                                    onClick={() => addComboToCart(combo)}
                                                    className="p-4 border-2 border-indigo-100 bg-indigo-50/30 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition text-left flex flex-col justify-between group"
                                                >
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <div className="font-black text-gray-900 uppercase tracking-tight leading-tight">{combo.name}</div>
                                                            <div className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded">COMBO</div>
                                                        </div>
                                                        <div className="mt-2 space-y-1">
                                                            {combo.products.map(p => (
                                                                <div key={p.id} className="text-[11px] text-gray-500 flex items-center">
                                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                                                                    {p.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-between items-center">
                                                        <div className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                            Add All to Cart →
                                                        </div>
                                                        {combo.discount_value > 0 && (
                                                            <div className="text-xs font-black text-red-600">-{combo.discount_value}% OFF</div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-b border-gray-100 my-6"></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products
                                    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.product_code?.includes(search))
                                    .map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-4 border rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition text-left flex flex-col justify-between h-36 relative"
                                    >
                                        {/* Offer Badge */}
                                        {product.has_offer && (
                                            <div className={`absolute -top-2 -right-2 ${product.offer_type === '1to1' ? 'bg-orange-500' : 'bg-red-500'} text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg ring-2 ring-white uppercase tracking-tighter`}>
                                                {product.offer_type === '1to1' 
                                                    ? `${product.buy_qty}+${product.get_qty} FREE` 
                                                    : `-${product.discount}%`
                                                }
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-black text-gray-900 truncate uppercase tracking-tight text-sm">{product.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono font-bold">CODE: {product.product_code || 'N/A'}</div>
                                            {product.has_offer && (
                                                <div className={`text-[10px] ${product.offer_type === '1to1' ? 'text-orange-600' : 'text-red-500'} font-black mt-1.5 truncate bg-${product.offer_type === '1to1' ? 'orange' : 'red'}-50 px-1.5 py-0.5 rounded inline-block uppercase`}>
                                                    {product.offer_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            {product.has_offer && product.discount > 0 ? (
                                                <div>
                                                    <div className="text-gray-400 line-through text-[10px] font-bold leading-none mb-1">${product.price}</div>
                                                    <div className="text-red-600 font-black text-lg leading-none">${product.discounted_price.toFixed(2)}</div>
                                                </div>
                                            ) : (
                                                <div className="text-indigo-600 font-black text-lg leading-none">${product.price}</div>
                                            )}
                                        </div>
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Cart / Checkout Area */}
                        <div className="w-full md:w-2/5 bg-white shadow rounded-lg flex flex-col">
                            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                                <h3 className="font-bold text-gray-700 uppercase tracking-wider">Current Bill</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {cart.length === 0 ? (
                                    <div className="text-center text-gray-400 mt-10">Cart is empty</div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {item.has_offer && (item.offer_type === 'discount' && item.discount > 0) ? (
                                                        <span>
                                                            <span className="line-through text-gray-400">${item.unit_price}</span>
                                                            <span className="text-red-600 font-bold ml-1">${item.price}</span>
                                                            <span className="bg-red-100 text-red-600 text-[9px] px-1 rounded ml-1">-{item.discount}%</span>
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            ${item.price}
                                                            {item.offer_type === '1to1' && (
                                                                <span className="bg-orange-100 text-orange-600 text-[9px] px-1 rounded ml-1 font-bold">{item.buy_qty}+{item.get_qty} FREE</span>
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="text-gray-400"> x {item.qty} {item.unit}</span>
                                                </div>
                                                {item.has_offer && (
                                                    <div className="text-[10px] text-green-600 mt-0.5">
                                                        You save: ${((item.unit_price - item.price) * item.qty).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">-</button>
                                                <span className="font-mono font-bold text-sm">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">+</button>
                                                <button onClick={() => removeItem(item.id)} className="ml-2 text-red-400 hover:text-red-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-6 bg-gray-50 rounded-b-lg border-t">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Payment</label>
                                    <div className="flex gap-2">
                                        {['cash', 'card'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`flex-1 py-2 rounded border text-xs font-bold uppercase transition ${
                                                    paymentMethod === method
                                                    ? 'bg-gray-800 text-white border-gray-800'
                                                    : 'bg-white text-gray-600 border-gray-300'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Coupon Section */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Coupon Code</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={couponCode} 
                                            onChange={e => setCouponCode(e.target.value)}
                                            placeholder="Enter code..."
                                            className="flex-1 rounded border-gray-300 text-sm py-2 px-3 focus:ring-indigo-500 uppercase font-mono"
                                        />
                                        <button 
                                            onClick={applyCoupon}
                                            className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-gray-700 transition"
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="mt-2 flex items-center justify-between bg-green-50 text-green-700 px-3 py-1.5 rounded border border-green-100">
                                            <span className="text-[10px] font-bold uppercase tracking-tight">Code: {appliedCoupon.code} (-{appliedCoupon.discount_value}%)</span>
                                            <button onClick={() => setAppliedCoupon(null)} className="text-green-800 hover:text-red-600 text-sm">×</button>
                                        </div>
                                    )}
                                </div>

                                {/* Show savings if there are any */}
                                {totalSavings > 0 && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-600 text-sm font-bold uppercase tracking-tight">Total Savings</span>
                                        <span className="text-lg font-black text-green-600">-${totalSavings.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Final Bill</span>
                                    <span className="text-3xl font-black text-gray-900">${finalTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                                >
                                    PAY & COMPLETE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
