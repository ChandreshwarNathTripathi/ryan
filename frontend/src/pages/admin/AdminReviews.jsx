import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api';
import { MessageSquare, Star, Check, X, Trash2, Building2 } from '../../components/Icons';

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
    if (!window.confirm('Delete this resident review permanently?')) return;
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Resident Feedback Moderation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Moderate student living reviews, verify hall ratings, and audit campus satisfaction.
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
                <th>Resident Author</th>
                <th>Hostel Dorm</th>
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
                      <div style={{ fontWeight: 600 }}>{rev.user?.name || 'Student'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.user?.email}</div>
                    </td>
                    <td>
                      <div>{rev.room?.name || 'Dorm'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rev.room?.block} • #{rev.room?.roomNumber}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        maxWidth: '280px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                      }}>
                        "{rev.comment}"
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        rev.status === 'approved' ? 'badge-success' :
                        rev.status === 'rejected' ? 'badge-danger' : 'badge-warning'
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
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(rev._id, 'approved')}
                            disabled={actionLoadingId === rev._id}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#10B981', padding: '6px 10px' }}
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
                            style={{ color: '#FB7185', padding: '6px 10px' }}
                            title="Reject Review"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev._id)}
                          disabled={actionLoadingId === rev._id}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 10px' }}
                          title="Delete Review"
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
                    No resident reviews found.
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
