import './AboutModal.css';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <div className="about-modal" onClick={(e) => e.stopPropagation()}>
        <button className="about-close" onClick={onClose}>×</button>

        <div className="about-header">
          <div className="about-logo">🚀 MISSILE COMMAND</div>
          <div className="about-subtitle">Ballistic Simulation</div>
        </div>

        <div className="about-content">
          <div className="about-profile">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQF_jSGRjEu1kg/profile-displayphoto-scale_400_400/B56Zz7JNkkI0Ag-/0/1773740023537?e=1776297600&v=beta&t=y-oRAA9hc0gm_mifTv840o6rt1rtK_ZMbxs98WMgikg"
              alt="Fauzi Fadhlurrohman"
              className="about-avatar"
            />
            <h2 className="about-name">Fauzi Fadhlurrohman</h2>
            <p className="about-title">Lead Software Engineer</p>
          </div>

          <div className="about-description">
            <p>
              A sophisticated ballistic missile simulation application featuring
              real-time trajectory calculations, interactive map visualization
              with satellite imagery, and stunning explosion effects.
            </p>
          </div>

          <div className="about-features">
            <h3>Features</h3>
            <ul>
              <li>🌍 Interactive world map with 195 capital cities</li>
              <li>🚀 6 realistic missile types (ICBM, SLBM, IRBM, SRBM, Cruise, Hypersonic)</li>
              <li>📊 Real-time flight calculations based on physics</li>
              <li>💥 Particle-based explosion animations</li>
              <li>📏 Damage radius visualization</li>
            </ul>
          </div>

          <div className="about-tech">
            <h3>Built With</h3>
            <div className="tech-stack">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">Leaflet</span>
              <span className="tech-badge">GSAP</span>
              <span className="tech-badge">OpenStreetMap</span>
            </div>
          </div>

          <a
            href="https://www.linkedin.com/in/fauzi-fadhlurrohman/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-linkedin"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Connect on LinkedIn
          </a>

          <div className="about-copyright">
            © 2024 Fauzi Fadhlurrohman. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
