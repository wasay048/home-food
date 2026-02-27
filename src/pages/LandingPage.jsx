import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./LandingPage.css";

const TESTIMONIALS = [
  { name: "Sarah M.", text: "The best homemade food I've ever ordered! Feels like mom's cooking.", rating: 5 },
  { name: "James L.", text: "Fresh, authentic, and delivered right to my door. Absolutely love it!", rating: 5 },
  { name: "Emily R.", text: "Finally, real home-cooked meals without the hassle. A game changer!", rating: 5 },
];

const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "50+", label: "Home Chefs" },
  { value: "1000+", label: "Meals Served" },
  { value: "4.9", label: "Avg Rating ★" },
];

export default function LandingPage() {
  const [heroText, setHeroText] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);
  console.log("Deployed version 0.0.1");
  const fullText = "Homemade meals from talented local chefs, delivered fresh to your door.";

  const { isAuthenticated } = useSelector((state) => state.auth);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setHeroText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="lp">
      {/* ====== HERO SECTION ====== */}
      <section className="lp-hero">
        <div className="lp-hero__bg">
          <div className="lp-hero__orb lp-hero__orb--1" />
          <div className="lp-hero__orb lp-hero__orb--2" />
          <div className="lp-hero__orb lp-hero__orb--3" />
          <div className="lp-hero__grid" />
        </div>

        <div className="lp-hero__content">
          <div className="lp-hero__badge">🌿 Farm-to-Table • Made with Love</div>

          <h1 className="lp-hero__title">
            Discover <span className="lp-hero__accent">Authentic</span>
            <br />Home-Cooked Meals
          </h1>

          <p className="lp-hero__subtitle">
            {heroText}
            <span className="lp-hero__cursor">|</span>
          </p>



          {/* Hero Food Visual */}
          <div className="lp-hero__visual">
            <div className="lp-hero__plate">
              <span className="lp-hero__food-emoji">🍜</span>
            </div>
            <div className="lp-hero__float lp-hero__float--1">🥗</div>
            <div className="lp-hero__float lp-hero__float--2">🍲</div>
            <div className="lp-hero__float lp-hero__float--3">🥘</div>
            <div className="lp-hero__float lp-hero__float--4">🍱</div>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="lp-stats">
        {STATS.map((stat, i) => (
          <div key={i} className="lp-stats__item">
            <div className="lp-stats__value">{stat.value}</div>
            <div className="lp-stats__label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how-it-works" className="lp-section animate-on-scroll">
        <div className="lp-section__inner">
          <h2 className={`lp-section__title ${isVisible["how-it-works"] ? "lp-fade-up" : ""}`}>
            How It <span className="lp-hero__accent">Works</span>
          </h2>
          <p className="lp-section__desc">Three simple steps to a delicious meal</p>

          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step__num">1</div>
              <div className="lp-step__icon">📱</div>
              <h3>Browse & Choose</h3>
              <p>Explore menus from local home chefs in your area</p>
            </div>
            <div className="lp-step__connector" />
            <div className="lp-step">
              <div className="lp-step__num">2</div>
              <div className="lp-step__icon">👨‍🍳</div>
              <h3>Chef Prepares</h3>
              <p>Your meal is freshly prepared with love and care</p>
            </div>
            <div className="lp-step__connector" />
            <div className="lp-step">
              <div className="lp-step__num">3</div>
              <div className="lp-step__icon">🎉</div>
              <h3>Pick Up & Enjoy</h3>
              <p>Grab your order or get it delivered to your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="lp-section lp-section--dark animate-on-scroll">
        <div className="lp-section__inner">
          <h2 className={`lp-section__title ${isVisible["features"] ? "lp-fade-up" : ""}`}>
            Why Choose <span className="lp-hero__accent">HomeFresh</span>?
          </h2>

          <div className="lp-features">
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">🏠</div>
              <h3>Home-Cooked Quality</h3>
              <p>Every meal is made in real home kitchens by passionate local chefs who cook with love</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">🌍</div>
              <h3>Diverse Cuisines</h3>
              <p>From Asian bowls to Mediterranean plates — discover authentic dishes from cultures around the world</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">🚀</div>
              <h3>Fresh & Fast</h3>
              <p>Pre-order or grab-and-go. Your food is always prepared fresh, never sitting around</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">💰</div>
              <h3>Affordable Prices</h3>
              <p>Restaurant-quality meals at home-kitchen prices. No middlemen, just great food</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">📱</div>
              <h3>Easy Ordering</h3>
              <p>Browse, pick your date & time, pay — all from your phone in under a minute</p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature__glow" />
              <div className="lp-feature__icon">❤️</div>
              <h3>Support Local</h3>
              <p>Every order supports a home chef in your community. Eat well, do good</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="lp-section animate-on-scroll" id="testimonials">
        <div className="lp-section__inner">
          <h2 className={`lp-section__title ${isVisible["testimonials"] ? "lp-fade-up" : ""}`}>
            What People <span className="lp-hero__accent">Say</span>
          </h2>

          <div className="lp-testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`lp-testimonial ${i === activeTestimonial ? "lp-testimonial--active" : ""}`}
              >
                <div className="lp-testimonial__stars">
                  {"★".repeat(t.rating)}
                </div>
                <p className="lp-testimonial__text">&ldquo;{t.text}&rdquo;</p>
                <div className="lp-testimonial__author">— {t.name}</div>
              </div>
            ))}
            <div className="lp-testimonials__dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`lp-dot ${i === activeTestimonial ? "lp-dot--active" : ""}`}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ====== FOOTER ====== */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <span className="lp-footer__logo">🏠</span>
            <span>Home<strong>Fresh</strong></span>
          </div>
          <p className="lp-footer__copy">© 2026 HomeFresh. Crafted with ❤️ for food lovers.</p>
        </div>
      </footer>

    </div>
  );
}
