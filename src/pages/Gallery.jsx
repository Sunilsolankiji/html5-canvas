import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/shapes.css';

const STORAGE_KEY = 'canvas-playground-gallery';

// Sample gallery items for demo
const DEMO_ITEMS = [
  {
    id: 'demo-1',
    name: 'Rainbow Heart',
    type: 'playground',
    preset: 'heart',
    colors: { stroke: '#ff6b6b', fill: '#ff4757', background: '#0a0a0a' },
    thumbnail: null,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'demo-2',
    name: 'Neon Butterfly',
    type: 'playground',
    preset: 'butterfly',
    colors: { stroke: '#00ffff', fill: '#ff00ff', background: '#1a1a2e' },
    thumbnail: null,
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'demo-3',
    name: 'Golden Spiral',
    type: 'playground',
    preset: 'fibonacci',
    colors: { stroke: '#ffd700', fill: '#ff8c00', background: '#0a0a0a' },
    thumbnail: null,
    createdAt: Date.now() - 259200000,
  },
];

function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems([...parsed, ...DEMO_ITEMS]);
      } else {
        setItems(DEMO_ITEMS);
      }
    } catch (e) {
      console.error('Error loading gallery:', e);
      setItems(DEMO_ITEMS);
    }
  }, []);

  // Save items to localStorage
  const saveItems = useCallback((newItems) => {
    const userItems = newItems.filter(item => !item.id.startsWith('demo-'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userItems));
    setItems(newItems);
  }, []);

  const handleDelete = useCallback((id) => {
    const newItems = items.filter(item => item.id !== id);
    saveItems(newItems);
    setShowDeleteConfirm(null);
  }, [items, saveItems]);

  const handleExport = useCallback((item) => {
    const dataStr = JSON.stringify(item, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const newItem = {
          ...imported,
          id: `import-${Date.now()}`,
          createdAt: Date.now(),
        };
        saveItems([newItem, ...items]);
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  }, [items, saveItems]);

  const handleDuplicate = useCallback((item) => {
    const newItem = {
      ...item,
      id: `copy-${Date.now()}`,
      name: `${item.name} (Copy)`,
      createdAt: Date.now(),
    };
    saveItems([newItem, ...items]);
  }, [items, saveItems]);

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'playground': return '🎮';
      case 'fractal': return '🔷';
      case 'visualizer': return '🎵';
      default: return '🖼️';
    }
  };

  return (
    <div className="shape-page">
      <h2>🖼️ Gallery</h2>
      <p>Browse, save, and share your creations</p>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '15px',
      }}>
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: '200px',
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <option value="all">All Types</option>
          <option value="playground">🎮 Playground</option>
          <option value="fractal">🔷 Fractals</option>
          <option value="visualizer">🎵 Visualizer</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
        </select>

        <label className="btn btn-primary" style={{ cursor: 'pointer', margin: 0 }}>
          📥 Import
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎨</div>
          <h3 style={{ marginBottom: '10px' }}>No creations yet!</h3>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Create something beautiful in the Playground and save it here.
          </p>
          <Link to="/playground" className="btn btn-primary">
            🎮 Go to Playground
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => setSelectedItem(item)}
            >
              {/* Thumbnail */}
              <div style={{
                height: '150px',
                background: item.colors?.background || '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                position: 'relative',
              }}>
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ opacity: 0.5 }}>{getTypeIcon(item.type)}</span>
                )}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                }}>
                  {getTypeIcon(item.type)} {item.preset || item.type}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{item.name}</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
                  {formatDate(item.createdAt)}
                </p>

                {/* Color preview */}
                {item.colors && (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    {Object.values(item.colors).map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: color,
                          border: '2px solid rgba(255,255,255,0.2)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.8rem', flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(item);
                    }}
                  >
                    📤
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.8rem', flex: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(item);
                    }}
                  >
                    📋
                  </button>
                  {!item.id.startsWith('demo-') && (
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.8rem', flex: 1, color: '#ff6b6b' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(item.id);
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: '#1a1a2e',
              padding: '30px',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>{selectedItem.name}</h3>
            <p style={{ color: '#888' }}>
              Created: {formatDate(selectedItem.createdAt)}
            </p>

            {selectedItem.preset && (
              <p><strong>Preset:</strong> {selectedItem.preset}</p>
            )}

            {selectedItem.colors && (
              <div style={{ marginTop: '20px' }}>
                <strong>Colors:</strong>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {Object.entries(selectedItem.colors).map(([key, color]) => (
                    <div key={key} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: color,
                          border: '2px solid rgba(255,255,255,0.2)',
                          marginBottom: '5px',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <Link
                to={`/playground?${new URLSearchParams({
                  ...(selectedItem.preset && { preset: selectedItem.preset }),
                  ...(selectedItem.xFunction && { x: selectedItem.xFunction }),
                  ...(selectedItem.yFunction && { y: selectedItem.yFunction }),
                  ...(selectedItem.scale && { s: selectedItem.scale }),
                  ...(selectedItem.tEnd && { t: selectedItem.tEnd }),
                  ...(selectedItem.colors?.stroke && { sc: selectedItem.colors.stroke }),
                  ...(selectedItem.colors?.fill && { fc: selectedItem.colors.fill }),
                  ...(selectedItem.colors?.background && { bg: selectedItem.colors.background }),
                }).toString()}`}
                className="btn btn-primary"
                style={{ flex: 1, textAlign: 'center' }}
              >
                🎮 Open in Playground
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedItem(null)}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            style={{
              background: '#1a1a2e',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🗑️</div>
            <h3>Delete this creation?</h3>
            <p style={{ color: '#888' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#ff6b6b' }}
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;

