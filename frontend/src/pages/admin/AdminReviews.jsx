import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api';
import { MessageSquare, Star, Check, X, Trash2 } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getReviews({ status: 'All' });
      if (res.data?.success) setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await reviewService.updateReviewStatus(id, { status: newStatus });
      if (res.data?.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to update review status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    setActionLoadingId(id);
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.friendlyMessage || 'Failed to delete review.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Review Moderation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Moderate guest comments, verify ratings, and maintain authentic community feedback.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Guest Author</th>
                <th>Suite</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Status</th>
                <th>Posted Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <tr key={rev._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rev.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.user?.email}</div>
                    </td>
                    <td>
                      <div>{rev.room?.name || 'Suite'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{rev.room?.roomNumber}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      <p style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        color: 'var(--text-primary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        "{rev.comment}"
                      </p>
                    </td>
                    <td>
                      <span className={`badge ${
                        rev.status === 'approved' ? 'badge-success' :
                        rev.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {rev.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(rev._id, 'approved')}
                            disabled={actionLoadingId === rev._id}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#10B981', padding: '6px 8px' }}
                            title="Approve Review"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(rev._id, 'rejected')}
                            disabled={actionLoadingId === rev._id}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#FB7185', padding: '6px 8px' }}
                            title="Reject Review"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev._id)}
                          disabled={actionLoadingId === rev._id}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 8px' }}
                          title="Delete Permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No reviews in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
