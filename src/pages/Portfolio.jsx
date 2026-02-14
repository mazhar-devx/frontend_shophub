import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Portfolio() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>mazhar.devx | Mazhar Aslam - Full-Stack Developer Portfolio</title>
        <meta name="description" content="mazhar.devx - Mazhar Aslam, Full-Stack MERN Developer specializing in scalable web applications, REST APIs, and modern UI/UX design. Expert in MongoDB, Express, React, Node.js, and cloud deployments." />
        <meta name="keywords" content="mazhar.devx, mazhar, Mazhar Aslam, Full-Stack Developer, MERN Stack Developer, React Developer, Node.js Developer, MongoDB Expert, Web Developer Portfolio, Mazhar Developer" />
        <meta name="author" content="Mazhar Aslam" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shophub.pro/mazhar.devx" />
        <meta property="og:title" content="mazhar.devx | Mazhar Aslam - Full-Stack Developer" />
        <meta property="og:description" content="Full-Stack MERN Developer crafting scalable web solutions with modern technologies." />
        <meta property="og:image" content="https://shophub.pro/mazhar.devx/profile.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://shophub.pro/mazhar.devx" />
        <meta property="twitter:title" content="mazhar.devx | Mazhar Aslam - Full-Stack Developer" />
        <meta property="twitter:description" content="Full-Stack MERN Developer crafting scalable web solutions with modern technologies." />
        <meta property="twitter:image" content="https://shophub.pro/mazhar.devx/profile.jpg" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://shophub.pro/mazhar.devx" />
      </Helmet>

      {/* Full-screen iframe embedding the portfolio */}
      <div className="fixed inset-0 w-full h-full bg-black">
        <iframe 
          src="/src/mazhar.devx/index.html"
          title="mazhar.devx Portfolio"
          className="w-full h-full border-0"
          loading="eager"
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          }}
        />
      </div>
    </>
  );
}
