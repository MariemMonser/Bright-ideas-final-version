import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/accueil.css';
import bgImage from '../assets/bright-ideas-bg.jpg';

const Statistics = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/signin');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role === 'admin') {
      navigate('/admin');
      return;
    }

    setUser(userData);
    fetchUserStats();
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Fetch user's ideas
      const ideasResponse = await fetch('http://localhost:5000/api/ideas/my-ideas', {
        method: 'GET',
        credentials: 'include',
      });

      const ideasData = await ideasResponse.json();
      
      if (!ideasResponse.ok || !ideasData.success) {
        throw new Error(ideasData.message || 'Error fetching ideas');
      }

      const userIdeas = ideasData.ideas || [];
      
      // Calculate statistics
      const totalIdeas = userIdeas.length;
      const totalLikes = userIdeas.reduce((sum, idea) => sum + (idea.likes?.length || 0), 0);
      const totalComments = userIdeas.reduce((sum, idea) => sum + (idea.comments?.length || 0), 0);
      
      // Ideas this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const ideasThisMonth = userIdeas.filter(idea => new Date(idea.createdAt) >= startOfMonth).length;

      // Most liked idea
      const mostLikedIdea = userIdeas.reduce((max, idea) => 
        (idea.likes?.length || 0) > (max.likes?.length || 0) ? idea : max, 
        userIdeas[0] || null
      );

      setStats({
        totalIdeas,
        totalLikes,
        totalComments,
        ideasThisMonth,
        mostLikedIdea,
        averageLikes: totalIdeas > 0 ? (totalLikes / totalIdeas).toFixed(1) : 0
      });
    } catch (err) {
      setError(err.message || 'Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060a', color: '#fff' }}><p>Chargement...</p></div>;
  }

  const profilePhotoSrc = user.profilePhoto || null;
  const userInitial = (user.name || user.alias || 'U').charAt(0).toUpperCase();

  return (
    <div className="app-root">
      <div className="bg-hero" aria-hidden="true" style={{ backgroundImage: `url(${bgImage})` }} />

      {/* SIDEBAR GAUCHE */}
      <aside className="sidebar" aria-label="Navigation">
        <div className="sidebar-top">
          <div className="sidebar-brand">💡 Bright Ideas</div>
          
          <div
            className="sidebar-profile-section"
            role="button" tabIndex={0}
          >
            {profilePhotoSrc ? 
              <img src={profilePhotoSrc} alt="profile" className="sidebar-avatar" /> : 
              <div className="sidebar-avatar-initial">{userInitial}</div>
            }
            <div className="sidebar-username">{user.alias || user.name}</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main menu">
          <Link to="/accueil" className="nav-item">Home</Link>
          <Link to="/my-ideas" className="nav-item">My Ideas</Link>
          <Link to="/statistics" className="nav-item active">Statistics</Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* CONTENEUR PRINCIPAL */}
      <div className="main-content-wrapper">
        <section className="hero-section glass-hero hero-improved" role="banner">
          <div className="hero-left hero-left-improved">
            <h1 className="hero-title hero-title-improved">Statistics</h1>
            <div className="hero-accent" aria-hidden="true" />
            <p className="hero-subtitle hero-subtitle-improved">Your activity and engagement metrics.</p>
          </div>
        </section>

        <main className="main-content">
          {error && (
            <div className="panel card-panel" style={{ 
              background: 'rgba(239, 68, 68, 0.15)', 
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fff'
            }}>
              <p style={{ color: '#ef4444' }}>⚠️ {error}</p>
            </div>
          )}

          {loading ? (
            <div className="panel card-panel" style={{ 
              background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
              border: '1px solid rgba(124,73,245,0.25)',
              color: '#fff'
            }}>
              <p>Loading statistics...</p>
            </div>
          ) : stats ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="panel card-panel" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                border: '1px solid rgba(124,73,245,0.25)',
                color: '#fff'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💡</div>
                <h3 style={{ margin: '10px 0', color: '#fff' }}>Total Ideas</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-violet)', margin: '10px 0' }}>
                  {stats.totalIdeas}
                </p>
              </div>

              <div className="panel card-panel" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                border: '1px solid rgba(124,73,245,0.25)',
                color: '#fff'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❤️</div>
                <h3 style={{ margin: '10px 0', color: '#fff' }}>Total Likes</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-violet)', margin: '10px 0' }}>
                  {stats.totalLikes}
                </p>
              </div>

              <div className="panel card-panel" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                border: '1px solid rgba(124,73,245,0.25)',
                color: '#fff'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💬</div>
                <h3 style={{ margin: '10px 0', color: '#fff' }}>Total Comments</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-violet)', margin: '10px 0' }}>
                  {stats.totalComments}
                </p>
              </div>

              <div className="panel card-panel" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                border: '1px solid rgba(124,73,245,0.25)',
                color: '#fff'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
                <h3 style={{ margin: '10px 0', color: '#fff' }}>This Month</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-violet)', margin: '10px 0' }}>
                  {stats.ideasThisMonth}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>ideas published</p>
              </div>
            </div>
          ) : null}

          {stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="panel card-panel" style={{ 
                background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                border: '1px solid rgba(124,73,245,0.25)',
                color: '#fff'
              }}>
                <h2 style={{ color: '#fff', marginBottom: '15px' }}>Average Likes per Idea</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                  {stats.averageLikes} likes
                </p>
              </div>

              {stats.mostLikedIdea && (
                <div className="panel card-panel" style={{ 
                  background: 'linear-gradient(135deg, rgba(18,16,28,0.95), rgba(24,20,35,0.98))',
                  border: '1px solid rgba(124,73,245,0.25)',
                  color: '#fff'
                }}>
                  <h2 style={{ color: '#fff', marginBottom: '15px' }}>Most Liked Idea</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px', lineHeight: '1.6' }}>
                    {stats.mostLikedIdea.text.length > 200 
                      ? stats.mostLikedIdea.text.substring(0, 200) + '...' 
                      : stats.mostLikedIdea.text}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{ color: 'var(--accent-violet)', fontWeight: 'bold' }}>
                      ❤️ {stats.mostLikedIdea.likes?.length || 0} likes
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                      💬 {stats.mostLikedIdea.comments?.length || 0} comments
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Statistics;

