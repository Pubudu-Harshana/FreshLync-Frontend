import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Shield, Truck, ChevronLeft, ChevronRight, Plus, Minus, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../services/api';

const PRODUCTS = [
  { id: '1', name: 'Atlantic Salmon', price: '£24.99/kg', priceNum: 24.99, img: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&q=80&w=800'], desc: 'Premium grade, sustainably farm-raised in the North Atlantic. Rich in Omega-3 fatty acids and ideal for restaurants, catering, and wholesale buyers.', stock: 'In Stock', stockQty: 850, category: 'Fish', supplier: 'North Atlantic Co.', rating: 4.8, reviews: 124, sku: 'SALM-091', unit: 'per kg', minOrder: 5 },
  { id: '2', name: 'Organic Broccoli', price: '£4.50/lb', priceNum: 4.50, img: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&q=80&w=800'], desc: 'Certified organic, pesticide-free heads harvested from local sustainable farms.', stock: 'In Stock', stockQty: 320, category: 'Vegetables', supplier: 'GreenEarth Organics', rating: 4.6, reviews: 89, sku: 'BROC-022', unit: 'per lb', minOrder: 10 },
  { id: '3', name: 'Angus Beef', price: '£32.00/kg', priceNum: 32.00, img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800'], desc: 'Prime pasture-raised Angus beef. Hand-cut and aged for 21 days for maximum flavour.', stock: 'In Stock', stockQty: 200, category: 'Meat', supplier: 'Highland Meats Ltd', rating: 4.9, reviews: 201, sku: 'BEEF-103', unit: 'per kg', minOrder: 5 },
  { id: '4', name: 'Heirloom Tomatoes', price: '£6.75/lb', priceNum: 6.75, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800'], desc: 'Mixed variety heirloom tomatoes, non-GMO and vine-ripened for peak sweetness.', stock: 'In Stock', stockQty: 180, category: 'Vegetables', supplier: 'FarmFresh Co.', rating: 4.5, reviews: 63, sku: 'TOMA-044', unit: 'per lb', minOrder: 5 },
  { id: '5', name: 'Chilean Seabass', price: '£42.00/kg', priceNum: 42.00, img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'], desc: 'Wild-caught, MSC certified. Known for its buttery texture and delicate flavour.', stock: 'Low Stock', stockQty: 42, category: 'Fish', supplier: 'Pacific Catch Ltd', rating: 4.9, reviews: 147, sku: 'CBAS-071', unit: 'per kg', minOrder: 3 },
  { id: '6', name: 'Rainbow Carrots', price: '£3.25/ea', priceNum: 3.25, img: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&q=80&w=800'], desc: 'Artisan bundle of purple, orange, and white carrots. Sweet and crunchy profile.', stock: 'In Stock', stockQty: 600, category: 'Vegetables', supplier: 'GreenEarth Organics', rating: 4.4, reviews: 38, sku: 'CARR-012', unit: 'each', minOrder: 12 },
];

export { PRODUCTS };

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={16} fill={i <= Math.round(rating) ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />
      ))}
      <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '0.25rem' }}>{rating}</span>
    </div>
  );
}

// ── Interactive Star Selector for the review form ─────────────────────────────
function StarSelector({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.3rem' }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={28}
          fill={(hover || value) >= i ? '#FBBF24' : 'none'}
          style={{ color: '#FBBF24', cursor: 'pointer', transition: 'transform 0.15s ease', transform: hover >= i ? 'scale(1.15)' : 'scale(1)' }}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
      {value > 0 && (
        <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#64748B', alignSelf: 'center' }}>
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

// ── Star Distribution Bar ─────────────────────────────────────────────────────
function StarDistributionBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', width: 14, textAlign: 'right' }}>{star}</span>
      <Star size={12} fill="#FBBF24" style={{ color: '#FBBF24', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.72rem', color: '#94A3B8', width: 28, textAlign: 'right' }}>{count}</span>
    </div>
  );
}

// ── Single Review Card ────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const avatarUrl = review.profileImage
    ? (review.profileImage.startsWith('http') ? review.profileImage : getImageUrl(review.profileImage))
    : null;
  const date = new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{
      padding: '1.25rem 1.5rem',
      background: 'white',
      borderRadius: 14,
      border: '1px solid #F1F5F9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s ease',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #047857, #065F46)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={20} color="white" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{review.userName}</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{date}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.15rem' }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={13} fill={i <= review.rating ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />
          ))}
        </div>
      </div>

      {/* Title & Body */}
      {review.title && (
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>{review.title}</h4>
      )}
      <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>{review.review}</p>

      {/* Verified badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem' }}>
        <Shield size={12} style={{ color: '#047857' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#047857' }}>Verified Purchase</span>
      </div>
    </div>
  );
}


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // ── Review state ────────────────────────────────────────────────────────────
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0, distribution: { 5:0,4:0,3:0,2:0,1:0 } });
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPages, setReviewPages] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // For the review form
  const [eligibleOrderId, setEligibleOrderId] = useState(null); // order that contains this product
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitError, setSubmitError] = useState('');

  const isRealProduct = id && id.match(/^[0-9a-fA-F]{24}$/);

  // ── Load product ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      if (isRealProduct) {
        try {
          const data = await productService.getProduct(id);
          if (data) {
            const mapped = {
              id: data._id,
              name: data.name,
              price: `£${Number(data.sellingPrice || data.displayPrice || data.price || 0).toFixed(2)}/${data.unit || 'kg'}`,
              priceNum: data.sellingPrice || data.displayPrice || data.price || 0,
              img: getImageUrl(data.image),
              imagePath: data.image || '',
              images: data.image ? [getImageUrl(data.image)] : [],
              desc: data.description || 'No description available.',
              stock: data.stock === 0 ? 'Out of Stock' : (data.stock < 50 ? 'Low Stock' : 'In Stock'),
              stockQty: data.stock || 0,
              category: data.category,
              supplier: user?.role === 'buyer' ? 'FreshLync' : (data.supplierName || (data.supplier && (data.supplier.company || data.supplier.name)) || 'Supplier'),
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              sku: data.sku || '—',
              unit: data.unit || 'kg',
              minOrder: data.minOrder || 1
            };
            setProduct(mapped);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Failed to load dynamic product:", err);
        }
      }
      
      const mock = PRODUCTS.find(p => p.id === id);
      if (mock && user?.role === 'buyer') {
        setProduct({ ...mock, supplier: 'FreshLync' });
      } else {
        setProduct(mock || null);
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  // ── Load reviews + stats for real products ──────────────────────────────────
  useEffect(() => {
    if (!isRealProduct) return;

    const loadReviewData = async () => {
      try {
        const [statsData, reviewsData] = await Promise.all([
          reviewService.getProductReviewStats(id),
          reviewService.getProductReviews(id, 1, 5),
        ]);
        setReviewStats(statsData);
        setReviews(reviewsData.reviews || []);
        setReviewPages(reviewsData.pages || 1);
        setReviewPage(1);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    loadReviewData();
  }, [id]);

  // ── Check if buyer is eligible to review this product ───────────────────────
  useEffect(() => {
    if (!isRealProduct || !isAuthenticated || user?.role !== 'buyer') return;

    const checkEligibility = async () => {
      try {
        const orders = await orderService.getBuyerOrders({ status: 'Delivered', limit: 100 });
        const orderList = Array.isArray(orders) ? orders : [];
        // Find a delivered order that contains this product
        for (const order of orderList) {
          const hasProduct = (order.items || []).some(
            item => item.product && (item.product === id || item.product._id === id || item.product.toString() === id)
          );
          if (hasProduct) {
            setEligibleOrderId(order._id);
            break;
          }
        }

        // Check if already reviewed
        const existingReviews = await reviewService.getProductReviews(id, 1, 100);
        const myReview = (existingReviews.reviews || []).find(
          r => r.userId === user?._id || r.userId === user?.id
        );
        if (myReview) setAlreadyReviewed(true);
      } catch (err) {
        console.error('Failed to check review eligibility:', err);
      }
    };

    checkEligibility();
  }, [id, isAuthenticated, user]);

  // ── Load more reviews ───────────────────────────────────────────────────────
  const loadMoreReviews = async () => {
    if (reviewPage >= reviewPages) return;
    setReviewsLoading(true);
    try {
      const nextPage = reviewPage + 1;
      const data = await reviewService.getProductReviews(id, nextPage, 5);
      setReviews(prev => [...prev, ...(data.reviews || [])]);
      setReviewPage(nextPage);
      setReviewPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to load more reviews:', err);
    }
    setReviewsLoading(false);
  };

  // ── Submit review ───────────────────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (formRating === 0) { setSubmitError('Please select a star rating.'); return; }
    if (!formTitle.trim()) { setSubmitError('Please enter a review title.'); return; }
    if (!formBody.trim()) { setSubmitError('Please write your review.'); return; }

    setSubmitting(true);
    setSubmitError('');
    setSubmitMsg('');

    try {
      await reviewService.createReview({
        rating: formRating,
        title: formTitle.trim(),
        review: formBody.trim(),
        orderId: eligibleOrderId,
        productId: id,
        companyName: user?.company || '',
        profileImage: user?.avatar || '',
      });
      setSubmitMsg('Review submitted! It will appear after admin approval.');
      setAlreadyReviewed(true);
      setFormRating(0);
      setFormTitle('');
      setFormBody('');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    }
    setSubmitting(false);
  };

  // ── Render guards ───────────────────────────────────────────────────────────
  if (loading) {
    return <LoadingSpinner fullPage message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceNum,
      unit: product.unit,
      image: product.imagePath || product.img,
      supplierName: product.supplier
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inCart = cart.find(i => i.name === product.name);

  return (
    <div style={{ padding: '2rem 3rem', maxWidth: 1100, margin: '0 auto' }}>
      <SEO title={product.name} />

      <button onClick={() => navigate('/marketplace')} style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)',
        marginBottom: '2rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
      }}>
        <ArrowLeft size={18} /> Back to Marketplace
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Image Gallery */}
        <div>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 380, background: '#f1f5f9' }}>
            {product.images && product.images.length > 0 && product.images[imgIdx] ? (
              <img src={product.images[imgIdx]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)' }}>
                <span style={{ fontSize: '6rem' }}>{product.category === 'Fish' ? '🐟' : product.category === 'Meat' ? '🥩' : '🥬'}</span>
              </div>
            )}
            {product.images && product.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} className="img-nav-btn" style={{ left: 12 }}><ChevronLeft size={20} /></button>
                <button onClick={() => setImgIdx(i => Math.min(product.images.length - 1, i + 1))} className="img-nav-btn" style={{ right: 12 }}><ChevronRight size={20} /></button>
              </>
            )}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
              <span style={{ background: product.stock === 'In Stock' ? '#16A34A' : '#F59E0B', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                {product.stock}
              </span>
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setImgIdx(i)} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === imgIdx ? 'var(--color-primary)' : 'transparent'}` }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{product.category}</p>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <StarRating rating={reviewStats.average || product.rating} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{reviewStats.total || product.reviews} reviews</span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>{product.price}</div>

          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'SKU', value: product.sku },
              { label: 'Supplier', value: product.supplier },
              { label: 'Min. Order', value: `${product.minOrder} ${product.unit}` },
              { label: 'Available', value: `${product.stockQty} units` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--color-background)', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 0.9rem', background: 'var(--color-background)', border: 'none', cursor: 'pointer' }}><Minus size={16} /></button>
              <span style={{ padding: '0.5rem 1.25rem', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ padding: '0.5rem 0.9rem', background: 'var(--color-background)', border: 'none', cursor: 'pointer' }}><Plus size={16} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', background: added ? '#16A34A' : undefined }}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="btn-secondary" onClick={() => navigate('/marketplace/cart')} style={{ padding: '0.75rem 1.25rem' }}>
              View Cart {inCart ? `(${inCart.quantity})` : ''}
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icon: Shield, label: 'Quality Certified' },
              { icon: Truck, label: 'Fast Dispatch' },
              { icon: Package, label: 'Bulk Available' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <Icon size={14} style={{ color: 'var(--color-primary)' }} /> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── PRODUCT REVIEWS SECTION ──────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {isRealProduct && (
        <section id="product-reviews" style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid #E2E8F0' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
            <MessageSquare size={22} style={{ color: '#047857' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Customer Reviews</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* ── Rating Summary Card ─────────────────────────────────────────── */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
              borderRadius: 16,
              padding: '1.75rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              position: 'sticky',
              top: '2rem',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : '—'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.5rem 0' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={18} fill={i <= Math.round(reviewStats.average) ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                  Based on {reviewStats.total} {reviewStats.total === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Star distribution bars */}
              <div>
                {[5,4,3,2,1].map(star => (
                  <StarDistributionBar
                    key={star}
                    star={star}
                    count={reviewStats.distribution[star] || 0}
                    total={reviewStats.total}
                  />
                ))}
              </div>
            </div>

            {/* ── Reviews List + Form ─────────────────────────────────────────── */}
            <div>
              {/* Review List */}
              {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {reviews.map(r => (
                    <ReviewCard key={r._id} review={r} />
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  background: '#F8FAFC',
                  borderRadius: 14,
                  marginBottom: '1.5rem',
                  border: '1px dashed #E2E8F0',
                }}>
                  <MessageSquare size={36} style={{ color: '#CBD5E1', marginBottom: '0.75rem' }} />
                  <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 500 }}>No reviews yet for this product.</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Be the first to share your experience!</p>
                </div>
              )}

              {/* Load More */}
              {reviewPage < reviewPages && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <button
                    onClick={loadMoreReviews}
                    disabled={reviewsLoading}
                    style={{
                      padding: '0.65rem 2rem',
                      borderRadius: 10,
                      border: '1px solid #E2E8F0',
                      background: 'white',
                      color: '#047857',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {reviewsLoading ? 'Loading…' : 'Load More Reviews'}
                  </button>
                </div>
              )}

              {/* ── Write a Review ─────────────────────────────────────────────── */}
              {isAuthenticated && user?.role === 'buyer' && (
                <div style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: '1.75rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ThumbsUp size={18} style={{ color: '#047857' }} /> Write a Review
                  </h3>

                  {alreadyReviewed ? (
                    <div style={{
                      padding: '1rem 1.25rem',
                      background: '#F0FDF4',
                      borderRadius: 10,
                      border: '1px solid #BBF7D0',
                      color: '#166534',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      marginTop: '0.75rem',
                    }}>
                      ✓ {submitMsg || 'You have already reviewed this product. Thank you!'}
                    </div>
                  ) : !eligibleOrderId ? (
                    <div style={{
                      padding: '1rem 1.25rem',
                      background: '#FFF7ED',
                      borderRadius: 10,
                      border: '1px solid #FED7AA',
                      color: '#9A3412',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      marginTop: '0.75rem',
                    }}>
                      🛒 Purchase and receive this product to leave a review.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} style={{ marginTop: '1rem' }}>
                      {/* Star Selector */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Your Rating *</label>
                        <StarSelector value={formRating} onChange={setFormRating} />
                      </div>

                      {/* Title */}
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Review Title *</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={e => setFormTitle(e.target.value)}
                          maxLength={60}
                          placeholder="Summarize your experience"
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            borderRadius: 10,
                            border: '1px solid #E2E8F0',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                          }}
                          onFocus={e => e.target.style.borderColor = '#047857'}
                          onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.25rem' }}>{formTitle.length}/60</div>
                      </div>

                      {/* Body */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Your Review *</label>
                        <textarea
                          value={formBody}
                          onChange={e => setFormBody(e.target.value)}
                          maxLength={500}
                          rows={4}
                          placeholder="What did you like or dislike about this product?"
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem',
                            borderRadius: 10,
                            border: '1px solid #E2E8F0',
                            fontSize: '0.9rem',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                          }}
                          onFocus={e => e.target.style.borderColor = '#047857'}
                          onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                        />
                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.25rem' }}>{formBody.length}/500</div>
                      </div>

                      {/* Error / Success */}
                      {submitError && (
                        <div style={{
                          padding: '0.7rem 1rem',
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 8,
                          color: '#DC2626',
                          fontSize: '0.85rem',
                          marginBottom: '1rem',
                        }}>{submitError}</div>
                      )}

                      {submitMsg && (
                        <div style={{
                          padding: '0.7rem 1rem',
                          background: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          borderRadius: 8,
                          color: '#166534',
                          fontSize: '0.85rem',
                          marginBottom: '1rem',
                        }}>{submitMsg}</div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          padding: '0.75rem 2rem',
                          borderRadius: 10,
                          background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #047857, #065F46)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          border: 'none',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'opacity 0.2s',
                        }}
                      >
                        {submitting ? 'Submitting…' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
