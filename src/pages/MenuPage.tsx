import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use placeholder images from Unsplash instead of missing local images
const menuData = [
  {
    category: 'Drinks',
    items: [
      { id: 1, name: 'Coffee', price: 3.5, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop&crop=center' },
      { id: 2, name: 'Tea', price: 2.5, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop&crop=center' },
      { id: 3, name: 'Latte', price: 4.5, image: 'https://images.unsplash.com/photo-1561043433-9265f73e685f?w=100&h=100&fit=crop&crop=center' },
      { id: 4, name: 'Cappuccino', price: 4.0, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center' },
    ],
  },
  {
    category: 'Snacks',
    items: [
      { id: 5, name: 'Muffin', price: 2.0, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center' },
      { id: 6, name: 'Cookie', price: 1.5, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&h=100&fit=crop&crop=center' },
      { id: 7, name: 'Croissant', price: 3.0, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop&crop=center' },
      { id: 8, name: 'Bagel', price: 2.5, image: 'https://images.unsplash.com/photo-1603046891744-76e6300df9e9?w=100&h=100&fit=crop&crop=center' },
    ],
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    
    // Close payment modal
    setShowPaymentModal(false);
    
    // Show success notification
    setShowNotification(true);
    
    // Clear cart and navigate to orders after a short delay
    setTimeout(() => {
      setCart([]);
      setShowNotification(false);
      navigate('/orders');
    }, 1500);
  };

  return (
    <>
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: '#22c55e',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✅</span>
          <span>Order placed successfully!</span>
        </div>
      )}
      
      <div className="menu-layout" style={{ 
        display: 'flex', 
        gap: '2rem', 
        padding: '1rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        {/* Menu Section */}
        <div className="menu-section" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                marginRight: '1rem',
                color: 'var(--accent)'
              }}
            >
              ←
            </button>
            <h2 style={{ color: 'var(--accent)', margin: 0 }}>Menu</h2>
          </div>
          
          {menuData.map((cat) => (
            <div key={cat.category} style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '1rem 0 0.5rem 0' }}>{cat.category}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cat.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 4px #0001', padding: '0.5rem 1rem' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: 56, height: 56, borderRadius: '0.5rem', marginRight: '1rem', objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://via.placeholder.com/56x56?text=${encodeURIComponent(item.name.charAt(0))}`;
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ color: '#888', fontSize: '1rem' }}>${item.price.toFixed(2)}</div>
                    </div>
                    <button 
                      style={{ maxWidth: 120 }}
                      onClick={() => addToCart(item)}
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        <div className="cart-sidebar" style={{ 
          width: 350, 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '1rem', 
          height: 'fit-content', 
          position: 'sticky',
          top: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent)' }}>Your Order</h3>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
              No items in cart
            </div>
          ) : (
            <>
              <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>${item.price.toFixed(2)} × {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ 
                          background: '#ff4757', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 24, 
                          height: 24, 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        style={{ 
                          background: 'var(--accent)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 24, 
                          height: 24, 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem' }}>
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                style={{ width: '100%', background: '#22c55e' }}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Payment Details</h3>
            <p>Total Amount: ${getTotalPrice().toFixed(2)}</p>
            <p>Payment Method: (Mock Payment)</p>
            <button 
              onClick={processPayment}
              style={{ width: '100%', background: 'var(--accent)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
            >
              Process Payment
            </button>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{ width: '100%', background: '#ff4757', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuPage; 