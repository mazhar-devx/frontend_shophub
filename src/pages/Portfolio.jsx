import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Portfolio() {
  useEffect(() => {
    // Redirect to the actual portfolio HTML file
    // This works better than iframe for standalone HTML pages
    window.location.href = '/mazhar.devx/index.html';
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

      {/* Loading state while redirecting */}
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg font-bold">Loading Portfolio...</p>
        </div>
      </div>
    </>
  );
}
