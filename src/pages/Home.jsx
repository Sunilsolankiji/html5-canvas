import { Link } from 'react-router-dom';
import { SHAPE_CARDS } from '../constants';
import '../styles/home.css';

function Home() {
  return (
    <div className="home-page">
      <h2>HTML5 Canvas Playground</h2>
      <p className="subtitle">Explore beautiful animated shapes and patterns</p>
      <div className="shape-grid">
        {SHAPE_CARDS.map((shape) => (
          <Link
            key={shape.path}
            to={shape.path}
            className={`shape-card ${shape.featured ? 'featured' : ''}`}
          >
            <div className="icon">{shape.icon}</div>
            <h3>{shape.name}</h3>
            <p>{shape.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
