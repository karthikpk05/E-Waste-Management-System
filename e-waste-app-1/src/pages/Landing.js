import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const EWasteLandingPage = () => {
  const navigate = useNavigate();
  const [visibleSection, setVisibleSection] = useState('');

  // Real e-waste data for visualizations
  const globalEWasteData = [
    { year: 2019, amount: 53.6 },
    { year: 2020, amount: 54.1 },
    { year: 2021, amount: 57.4 },
    { year: 2022, amount: 59.4 },
    { year: 2023, amount: 62.0 },
    { year: 2024, amount: 65.3 }
  ];

  const eWasteByCategory = [
    { category: 'Small IT', amount: 17.4, color: '#3b82f6' },
    { category: 'Large Appliances', amount: 16.8, color: '#10b981' },
    { category: 'Screens', amount: 6.8, color: '#f59e0b' },
    { category: 'Temperature Exchange', amount: 10.8, color: '#ef4444' },
    { category: 'Small Appliances', amount: 4.6, color: '#8b5cf6' },
    { category: 'Lamps', amount: 0.9, color: '#06b6d4' }
  ];

  const recyclingRates = [
    { country: 'Norway', rate: 85.3 },
    { country: 'Iceland', rate: 81.2 },
    { country: 'Switzerland', rate: 75.8 },
    { country: 'Denmark', rate: 73.4 },
    { country: 'Netherlands', rate: 70.9 },
    { country: 'Global Average', rate: 20.0 }
  ];

  const impactData = [
    { metric: 'Gold Recovery', value: '320kg', description: 'Recoverable gold from 1M phones' },
    { metric: 'CO2 Reduction', value: '1.2M tons', description: 'Saved annually through proper recycling' },
    { metric: 'Rare Elements', value: '17 types', description: 'Critical materials recovered from e-waste' },
    { metric: 'Energy Savings', value: '15-20x', description: 'Less energy vs. mining new materials' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'stats', 'impact', 'recycling'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setVisibleSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="nav-icon">♻️</span>
            <span className="nav-title">EcoManage</span>
          </div>
          <div className="nav-links">
            <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('stats')} className="nav-link">Statistics</button>
            <button onClick={() => scrollToSection('impact')} className="nav-link">Impact</button>
            <button onClick={() => scrollToSection('recycling')} className="nav-link">Solutions</button>
            <button onClick={() => navigate('/login')} className="nav-cta">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-bg">
          <div className="floating-icon icon-1">📱</div>
          <div className="floating-icon icon-2">💻</div>
          <div className="floating-icon icon-3">🖥️</div>
          <div className="floating-icon icon-4">⚡</div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your 
              <span className="hero-highlight"> E-Waste </span>
              Into Environmental Action
            </h1>
            <p className="hero-subtitle">
              Join the global movement to responsibly manage electronic waste. 
              Every device recycled makes a difference for our planet's future.
            </p>
            <div className="hero-stats-mini">
              <div className="mini-stat">
                <div className="mini-stat-number">62M</div>
                <div className="mini-stat-text">tons of e-waste generated globally in 2023</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-number">20%</div>
                <div className="mini-stat-text">properly recycled worldwide</div>
              </div>
            </div>
            <div className="hero-actions">
              <button onClick={() => navigate('/login')} className="btn-primary-large">
                Start Recycling Now
                <span className="btn-icon">→</span>
              </button>
              <button onClick={() => scrollToSection('stats')} className="btn-secondary-large">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-icon">♻️</div>
                <div className="card-title">E-Waste Growth</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={globalEWasteData}>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="stats-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">The E-Waste Crisis in Numbers</h2>
            <p className="section-subtitle">
              Understanding the scale helps us appreciate the urgency of action
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card-large">
              <h3>Global E-Waste Generation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={globalEWasteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Million Tons', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}M tons`, 'E-Waste Generated']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="stat-card-large">
              <h3>E-Waste by Category (2023)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eWasteByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="amount"
                    label={({ category, amount }) => `${category}: ${amount}M`}
                  >
                    {eWasteByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}M tons`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="key-facts">
            <div className="fact-item">
              <div className="fact-icon">🌍</div>
              <div className="fact-content">
                <div className="fact-number">5 billion</div>
                <div className="fact-text">people own mobile phones worldwide</div>
              </div>
            </div>
            <div className="fact-item">
              <div className="fact-icon">⚡</div>
              <div className="fact-content">
                <div className="fact-number">$62B</div>
                <div className="fact-text">worth of recoverable materials in annual e-waste</div>
              </div>
            </div>
            <div className="fact-item">
              <div className="fact-icon">🏭</div>
              <div className="fact-content">
                <div className="fact-number">80%</div>
                <div className="fact-text">of e-waste ends up in landfills or informal recycling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section id="impact" className="impact-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Environmental Impact & Recovery Potential</h2>
            <p className="section-subtitle">
              Proper e-waste management unlocks tremendous environmental and economic benefits
            </p>
          </div>
          
          <div className="impact-grid">
            {impactData.map((item, index) => (
              <div key={index} className="impact-card">
                <div className="impact-value">{item.value}</div>
                <div className="impact-metric">{item.metric}</div>
                <div className="impact-description">{item.description}</div>
              </div>
            ))}
          </div>

          <div className="toxic-warning">
            <div className="warning-content">
              <div className="warning-icon">⚠️</div>
              <div className="warning-text">
                <h3>Toxic Materials in Electronics</h3>
                <p>Devices contain lead, mercury, cadmium, and other hazardous substances that can contaminate soil and groundwater when improperly disposed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Solutions */}
      <section id="recycling" className="recycling-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Global Recycling Performance</h2>
            <p className="section-subtitle">
              Leading countries show what's possible with proper e-waste management
            </p>
          </div>
          
          <div className="recycling-content">
            <div className="recycling-chart">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={recyclingRates} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} label={{ value: 'Recycling Rate (%)', position: 'insideBottom', offset: -10 }} />
                  <YAxis dataKey="country" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Recycling Rate']} />
                  <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="solution-steps">
              <h3>How You Can Make a Difference</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Assess Your Devices</h4>
                    <p>Identify old electronics that need proper disposal</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Schedule Pickup</h4>
                    <p>Use our platform to arrange convenient collection</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Certified Recycling</h4>
                    <p>We ensure proper processing and material recovery</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Track Impact</h4>
                    <p>See the environmental benefit of your contribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-text">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of environmentally conscious individuals and organizations managing their e-waste responsibly.</p>
          </div>
          <div className="cta-actions">
            <button onClick={() => navigate('/login')} className="btn-primary-xl">
              Get Started Today
              <span className="btn-icon">🚀</span>
            </button>
            <p className="cta-note">Free to join • Instant setup • Certified partners</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-icon">♻️</span>
            <span className="footer-title">EcoManage</span>
          </div>
          <div className="footer-links">
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => scrollToSection('hero')}>About</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 EcoManage. Making e-waste management accessible for everyone.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
        }

        .nav {
          position: fixed;
          top: 0;
          width: 100%;
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 24px;
          color: #1f2937;
        }

        .nav-icon {
          font-size: 28px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          background: none;
          border: none;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
          font-size: 16px;
        }

        .nav-link:hover {
          color: #1f2937;
        }

        .nav-cta {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-top: 70px;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .floating-icon {
          position: absolute;
          font-size: 48px;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .icon-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .icon-2 { top: 60%; left: 15%; animation-delay: 1.5s; }
        .icon-3 { top: 30%; right: 20%; animation-delay: 3s; }
        .icon-4 { top: 70%; right: 10%; animation-delay: 4.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 64px;
          font-weight: 800;
          line-height: 1.1;
          color: white;
          margin-bottom: 24px;
        }

        .hero-highlight {
          background: linear-gradient(45deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-stats-mini {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
        }

        .mini-stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #10b981;
        }

        .mini-stat-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .hero-actions {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .btn-primary-large {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 20px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .btn-primary-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.5);
        }

        .btn-secondary-large {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 18px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .btn-secondary-large:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          max-width: 400px;
          width: 100%;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .card-icon {
          font-size: 32px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .stats-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 20px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 64px;
        }

        .stat-card-large {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .stat-card-large h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          text-align: center;
        }

        .key-facts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .fact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .fact-icon {
          font-size: 40px;
        }

        .fact-number {
          font-size: 32px;
          font-weight: 800;
          color: #3b82f6;
        }

        .fact-text {
          color: #6b7280;
          font-size: 16px;
        }

        .impact-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
        }

        .impact-section .section-title {
          color: white;
        }

        .impact-section .section-subtitle {
          color: #d1d5db;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-bottom: 64px;
        }

        .impact-card {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .impact-value {
          font-size: 48px;
          font-weight: 800;
          color: #10b981;
          margin-bottom: 8px;
        }

        .impact-metric {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .impact-description {
          font-size: 14px;
          color: #d1d5db;
        }

        .toxic-warning {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 32px;
        }

        .warning-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .warning-icon {
          font-size: 48px;
          flex-shrink: 0;
        }

        .warning-text h3 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #fca5a5;
        }

        .warning-text p {
          color: #d1d5db;
          font-size: 16px;
        }

        .recycling-section {
          padding: 100px 0;
          background: white;
        }

        .recycling-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        .recycling-chart {
          background: #f8fafc;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #e5e7eb;
        }

        .solution-steps h3 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 32px;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step {
          display: flex;
          align-items: start;
          gap: 16px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .step-content p {
          color: #6b7280;
          font-size: 14px;
        }

        .cta-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          padding: 0 24px;
        }

        .cta-text h2 {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }

        .cta-text p {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
        }

        .btn-primary-xl {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 24px 48px;
          font-size: 20px;
          font-weight: 700;
          border-radius: 35px;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
          margin-bottom: 16px;
        }

        .btn-primary-xl:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 45px rgba(16, 185, 129, 0.5);
        }

        .cta-note {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .footer {
          background: #111827;
          color: white;
          padding: 48px 0 24px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 20px;
        }

        .footer-icon {
          font-size: 24px;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #d1d5db;
          cursor: pointer;
          transition: color 0.2s;
          font-size: 16px;
        }

        .footer-links button:hover {
          color: white;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
          border-top: 1px solid #374151;
          padding-top: 24px;
          color: #9ca3af;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 48px;
            text-align: center;
          }

          .hero-title {
            font-size: 48px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .recycling-content {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .impact-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .key-facts {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 18px;
          }

          .section-title {
            font-size: 36px;
          }

          .hero-actions {
            flex-direction: column;
            gap: 16px;
          }

          .hero-stats-mini {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .impact-grid {
            grid-template-columns: 1fr;
          }

          .warning-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .footer-content {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }

          .cta-text h2 {
            font-size: 36px;
          }

          .btn-primary-large,
          .btn-secondary-large {
            width: 100%;
            justify-content: center;
          }

          .card {
            padding: 24px;
          }

          .hero-card {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 28px;
          }

          .section-title {
            font-size: 28px;
          }

          .btn-primary-large,
          .btn-secondary-large {
            padding: 16px 24px;
            font-size: 16px;
          }

          .btn-primary-xl {
            padding: 20px 32px;
            font-size: 18px;
          }

          .impact-value {
            font-size: 36px;
          }

          .fact-number {
            font-size: 24px;
          }
        }

        .btn-icon {
          transition: transform 0.2s;
        }

        .btn-primary-large:hover .btn-icon {
          transform: translateX(4px);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default EWasteLandingPage;