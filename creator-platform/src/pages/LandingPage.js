import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Link2, 
  ShoppingBag, 
  BarChart3, 
  Star, 
  ArrowRight,
  Check,
  Globe,
  Smartphone,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Portfolio Showcase',
      description: 'Create stunning portfolios that highlight your best work and attract brands.'
    },
    {
      icon: Link2,
      title: 'Link Management',
      description: 'Organize all your social links in one beautiful, customizable hub.'
    },
    {
      icon: ShoppingBag,
      title: 'Sell Products',
      description: 'Set up your online store and sell digital products directly to your audience.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your performance with detailed insights and analytics.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with audiences worldwide and expand your influence.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Your content looks perfect on every device, everywhere.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Lifestyle Influencer',
      content: 'CreatorHub transformed how I connect with my audience. Sales increased by 300%!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Tech Reviewer',
      content: 'The best platform for creators. Everything I need in one place.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Fashion Creator',
      content: 'My followers love the seamless shopping experience. Highly recommend!',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      features: ['Basic Portfolio', '5 Links', 'Basic Analytics', 'Community Support'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Creator',
      price: '$9/month',
      features: ['Advanced Portfolio', 'Unlimited Links', 'Detailed Analytics', 'Product Sales', 'Priority Support'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Pro',
      price: '$29/month',
      features: ['Everything in Creator', 'Custom Domain', 'Advanced Integrations', 'White-label Options', 'Dedicated Support'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Empower Your Creative Journey
              </h1>
              <p className="hero-subtitle">
                The all-in-one platform where creators showcase portfolios, manage links, 
                sell products, and grow their influence. Join thousands of successful creators.
              </p>
              <div className="hero-cta">
                <Link to="/register" className="btn btn-primary hero-btn">
                  Start Creating <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="btn btn-secondary hero-btn">
                  Learn More
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Active Creators</span>
                </div>
                <div className="stat">
                  <span className="stat-number">$2M+</span>
                  <span className="stat-label">Revenue Generated</span>
                </div>
                <div className="stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-mockup">
                <div className="mockup-card">
                  <div className="mockup-header">
                    <div className="mockup-avatar"></div>
                    <div className="mockup-info">
                      <div className="mockup-name"></div>
                      <div className="mockup-bio"></div>
                    </div>
                  </div>
                  <div className="mockup-links">
                    <div className="mockup-link"></div>
                    <div className="mockup-link"></div>
                    <div className="mockup-link"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed specifically for content creators and influencers
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Loved by Creators Worldwide</h2>
            <p className="text-xl text-gray-600">
              See what our community of creators has to say
            </p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing py-16">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">
              Start free and scale as you grow
            </p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="plan-feature">
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} plan-cta`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta py-16">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Creative Business?</h2>
            <p className="cta-subtitle">
              Join thousands of creators who are already growing their audience and revenue
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary cta-btn">
                Get Started Free <Zap size={20} />
              </Link>
              <Link to="/about" className="btn btn-ghost cta-btn">
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          overflow: hidden;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 600px;
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
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          margin-bottom: 60px;
        }

        .hero-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          padding: 16px 32px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-mockup {
          width: 300px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .mockup-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          height: 100%;
          color: #333;
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .mockup-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .mockup-name {
          width: 100px;
          height: 16px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .mockup-bio {
          width: 80px;
          height: 12px;
          background: #f3f4f6;
          border-radius: 4px;
        }

        .mockup-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mockup-link {
          height: 48px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .features {
          background: white;
        }

        .feature-card {
          text-align: center;
          padding: 40px 24px;
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.6;
        }

        .testimonials {
          background: #f8fafc;
        }

        .testimonial-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .testimonial-rating {
          display: flex;
          gap: 4px;
          color: #fbbf24;
          margin-bottom: 16px;
        }

        .testimonial-content {
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 24px;
          color: #374151;
        }

        .author-name {
          font-weight: 600;
          color: #1f2937;
        }

        .author-role {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .pricing {
          background: white;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .pricing-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 40px 32px;
          position: relative;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .pricing-card.popular {
          border-color: #667eea;
          transform: scale(1.05);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #667eea;
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .plan-price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 32px;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
        }

        .plan-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          color: #374151;
        }

        .plan-feature svg {
          color: #10b981;
          flex-shrink: 0;
        }

        .plan-cta {
          width: 100%;
        }

        .cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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

        .cta-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          padding: 16px 32px;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-cta {
            flex-direction: column;
            align-items: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .cta-title {
            font-size: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .pricing-card.popular {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
