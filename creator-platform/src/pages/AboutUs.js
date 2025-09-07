import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Users,
      title: 'Creator-First',
      description: 'Everything we build puts creators at the center. Your success is our mission.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We constantly push boundaries to bring you cutting-edge tools and features.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a supportive ecosystem where creators help each other thrive.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making professional creator tools available to everyone, everywhere.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Co-Founder & CEO',
      image: '👩‍💼',
      bio: 'Former YouTuber with 2M+ subscribers. Passionate about empowering creators.'
    },
    {
      name: 'Alex Chen',
      role: 'Co-Founder & CTO',
      image: '👨‍💻',
      bio: 'Ex-Google engineer with 10+ years building scalable platforms.'
    },
    {
      name: 'Maya Patel',
      role: 'Head of Product',
      image: '👩‍🎨',
      bio: 'Design-thinking expert who understands what creators really need.'
    },
    {
      name: 'Jordan Kim',
      role: 'Head of Growth',
      image: '👨‍📈',
      bio: 'Marketing strategist who helped scale multiple creator platforms.'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'The Beginning',
      description: 'Founded with a vision to empower content creators worldwide.'
    },
    {
      year: '2022',
      title: 'First 1,000 Creators',
      description: 'Reached our first milestone with creators from 15 countries.'
    },
    {
      year: '2023',
      title: '$1M Creator Revenue',
      description: 'Our creators collectively earned their first million dollars.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Now serving 10,000+ creators across 50+ countries.'
    }
  ];

  const features = [
    'Beautiful, customizable portfolios',
    'Powerful link management',
    'Integrated e-commerce',
    'Advanced analytics',
    'Mobile-first design',
    'SEO optimization',
    '24/7 customer support',
    'Creator community'
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Empowering Creators to Build Their Digital Empire
            </h1>
            <p className="hero-subtitle">
              We believe every creator deserves the tools and support to turn their passion 
              into a thriving business. Pivota is more than a platform—it's your 
              launchpad to success.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Creators</div>
              </div>
              <div className="stat">
                <div className="stat-number">$2M+</div>
                <div className="stat-label">Creator Earnings</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission py-16">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="mission-description">
                To democratize the creator economy by providing powerful, accessible tools 
                that help content creators build sustainable businesses, connect with their 
                audiences, and monetize their passion.
              </p>
              <p className="mission-description">
                We started Pivota because we saw talented creators struggling with 
                fragmented tools, complex setups, and platforms that didn't put creators first. 
                We knew there had to be a better way.
              </p>
              <Link to="/register" className="btn btn-primary">
                Join Our Mission <ArrowRight size={20} />
              </Link>
            </div>
            <div className="mission-visual">
              <div className="mission-icon">
                <Target size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <value.icon size={32} />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              Passionate individuals dedicated to creator success
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <span className="avatar-emoji">{member.image}</span>
                </div>
                <div className="team-info">
                  <h4 className="team-name">{member.name}</h4>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">
              From startup to creator platform leader
            </p>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h4 className="timeline-title">{milestone.title}</h4>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <h2 className="section-title">Why Creators Choose Pivota</h2>
              <p className="features-description">
                We've built everything you need to succeed as a creator, 
                all in one powerful platform.
              </p>
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <CheckCircle size={20} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="features-visual">
              <div className="features-stats">
                <div className="stats-card">
                  <div className="stats-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stats-info">
                    <div className="stats-number">300%</div>
                    <div className="stats-label">Average Revenue Increase</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">
                    <Star size={24} />
                  </div>
                  <div className="stats-info">
                    <div className="stats-number">4.9/5</div>
                    <div className="stats-label">Creator Satisfaction</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">
                    <Award size={24} />
                  </div>
                  <div className="stats-info">
                    <div className="stats-number">99.9%</div>
                    <div className="stats-label">Platform Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta py-16">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Creator Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of creators who are already building their digital empire with Pivota
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
        }

        .hero {
          background: var(--primary-gradient);
          color: var(--white);
          padding: 80px 0;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 48px;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.8;
        }

        .mission {
          background: var(--white);
        }

        .mission-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--dark-charcoal);
          margin-bottom: 24px;
        }

        .mission-description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--dark-charcoal);
          opacity: 0.7;
          margin-bottom: 24px;
        }

        .mission-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .mission-icon {
          width: 120px;
          height: 120px;
          background: var(--primary-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .values {
          background: var(--light-gray);
        }

        .section-header {
          max-width: 600px;
          margin: 0 auto;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--dark-charcoal);
          opacity: 0.7;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .value-card {
          background: var(--white);
          padding: 40px 32px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 6px -1px var(--shadow-light);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px var(--shadow-medium);
        }

        .value-icon {
          width: 80px;
          height: 80px;
          background: var(--coral-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: var(--white);
        }

        .value-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 16px;
        }

        .value-description {
          color: var(--dark-charcoal);
          opacity: 0.7;
          line-height: 1.6;
        }

        .team {
          background: var(--white);
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .team-card {
          background: var(--light-gray);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-4px);
        }

        .team-avatar {
          margin-bottom: 20px;
        }

        .avatar-emoji {
          font-size: 4rem;
        }

        .team-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .team-role {
          color: var(--electric-blue);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .team-bio {
          color: var(--dark-charcoal);
          opacity: 0.7;
          line-height: 1.6;
        }

        .journey {
          background: var(--light-gray);
        }

        .timeline {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-primary);
          transform: translateX(-50%);
        }

        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 48px;
          position: relative;
        }

        .timeline-item:nth-child(odd) {
          flex-direction: row-reverse;
        }

        .timeline-marker {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .timeline-dot {
          width: 16px;
          height: 16px;
          background: var(--electric-blue);
          border-radius: 50%;
          border: 4px solid var(--white);
          box-shadow: 0 0 0 4px var(--border-primary);
        }

        .timeline-content {
          width: 45%;
          padding: 24px;
          background: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px var(--shadow-light);
        }

        .timeline-year {
          color: var(--electric-blue);
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: 8px;
        }

        .timeline-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--dark-charcoal);
          margin-bottom: 8px;
        }

        .timeline-description {
          color: var(--dark-charcoal);
          opacity: 0.7;
          line-height: 1.6;
        }

        .features {
          background: var(--white);
        }

        .features-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .features-description {
          font-size: 1.125rem;
          color: var(--dark-charcoal);
          opacity: 0.7;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .features-list {
          display: grid;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--dark-charcoal);
        }

        .feature-item svg {
          color: var(--soft-teal);
          flex-shrink: 0;
        }

        .features-stats {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-card {
          background: var(--light-gray);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid var(--border-primary);
        }

        .stats-icon {
          width: 48px;
          height: 48px;
          background: var(--teal-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .stats-number {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--dark-charcoal);
        }

        .stats-label {
          color: var(--dark-charcoal);
          opacity: 0.7;
          font-size: 0.875rem;
        }

        .cta {
          background: var(--teal-gradient);
          color: var(--white);
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-subtitle {
          font-size: 1.25rem;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .cta-buttons .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          padding: 16px 32px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 32px;
          }

          .mission-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .features-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .timeline::before {
            left: 20px;
          }

          .timeline-item {
            flex-direction: row !important;
            padding-left: 60px;
          }

          .timeline-marker {
            left: 20px;
            transform: none;
          }

          .timeline-content {
            width: 100%;
          }

          .cta-title {
            font-size: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
