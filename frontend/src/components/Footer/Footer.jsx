// src/components/Footer.jsx
import React from 'react';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { GiCarKey } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import logo from '../../assets/logocar.png';
import { footerStyles as styles } from '../../assets/dummyStyles';

const Footer = () => {
  return (
    <footer className={styles.container}>
      {/* Decorative top elements */}
      <div className={styles.topElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.roadLine} />
      </div>
      
      <div className={styles.innerContainer}>
        <div className={styles.grid}>
          {/* Brand section */}
          <div className={styles.brandSection}>
            <Link to="/" className="flex items-center">
              <div className={styles.logoContainer}>
                <img
                  src={logo}
                  alt="Karzone logo"
                  className="h-[1em] w-auto block"
                  style={{ display: 'block', objectFit: 'contain' }}
                />
                <span className={styles.logoText}>KARZONE</span>
              </div>
            </Link>
            <p className={styles.description}>
              Premium car rental service with the latest models and exceptional customer service. Drive your dream car today!
            </p>
            <div className={styles.socialIcons}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={styles.socialIcon}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>
              Quick Links
              <span className={styles.underline} />
            </h3>
            <ul className={styles.linkList}>
              {['Home','Cars','Contact Us'].map((link, i) => (
                <li key={i}>
                  <a 
                    href={link === 'Home' ? '/' : link === 'Contact Us' ? '/contact' : '/cars'} 
                    className={styles.linkItem}
                  >
                    <span className={styles.bullet} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className={styles.sectionTitle}>
              Contact Us
              <span className={styles.underline} />
            </h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>123 Drive Avenue, Auto City, CA 90210</span>
              </li>
              <li className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+91 8299431275</span>
              </li>
              <li className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>info@hexagonsservices.com</span>
              </li>
            </ul>
            <div className={styles.hoursContainer}>
              <h4 className={styles.hoursTitle}>Business Hours</h4>
              <div className={styles.hoursText}>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 6:00 PM</p>
                <p>Sunday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className={styles.sectionTitle}>
              Newsletter
              <span className={styles.underline} />
            </h3>
            <p className={styles.newsletterText}>
              Subscribe for special offers and updates
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className={styles.input}
              />
              <button
                type="submit"
                className={styles.subscribeButton}
              >
                <GiCarKey className="mr-2 text-lg sm:text-xl" />
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} KARZONE. All rights reserved.</p>
          <p className="mt-3 md:mt-0">
            Designed by <a 
              href="https://hexagondigitalservices.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.designerLink}
            >
              Hexagon Digital Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;