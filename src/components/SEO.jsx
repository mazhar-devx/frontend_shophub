import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export default function SEO({ 
  title, 
  description, 
  type = 'website', 
  image, 
  url, 
  keywords,
  price,
  currency = 'PKR',
  availability,
  schema,
  video,
  children 
}) {
  const siteTitle = "ShopHub.pro - Pakistan's Luxury Shopping & Social Hub";
  const defaultDescription = "ShopHub.pro is your premium destination for high-end fashion, electronics, and immersive social shopping. Experience the future of e-commerce in Pakistan.";
  const siteUrl = "https://www.shophub.pro";
  const defaultImage = `${siteUrl}/logo.png`;

  const metaTitle = title ? `${title} | ShopHub.pro` : siteTitle;
  const metaDescription = (description || defaultDescription).substring(0, 160);
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const metaUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

  // Standard Structured Data for all pages
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShopHub.pro",
    "url": siteUrl,
    "logo": defaultImage,
    "sameAs": [
      "https://facebook.com/shophub.pro",
      "https://instagram.com/shophub.pro",
      "https://twitter.com/shophub_pro"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-300-1234567",
      "contactType": "customer service",
      "areaServed": "PK",
      "availableLanguage": "English"
    }
  };

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={metaUrl} />
      
      {/* Advanced Indexing */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#030014" />

      {/* Facebook Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="ShopHub.pro" />
      <meta property="og:locale" content="en_US" />
      
      {price && <meta property="product:price:amount" content={price} />}
      {price && <meta property="product:price:currency" content={currency} />}
      {availability && <meta property="product:availability" content={availability} />}

      {/* Video Open Graph */}
      {video && (
        <>
          <meta property="og:video" content={video} />
          <meta property="og:video:secure_url" content={video} />
          <meta property="og:video:type" content="video/mp4" />
          <meta property="og:video:width" content="1080" />
          <meta property="og:video:height" content="1920" />
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={video ? "player" : "summary_large_image"} />
      <meta name="twitter:site" content="@shophub_pro" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {video && <meta name="twitter:player" content={metaUrl} />}
      {video && <meta name="twitter:player:width" content="1080" />}
      {video && <meta name="twitter:player:height" content="1920" />}
      
      {price && <meta name="twitter:label1" content="Price" />}
      {price && <meta name="twitter:data1" content={`${price} ${currency}`} />}

      {/* Structured Data Scripts */}
      <script type="application/ld+json">{JSON.stringify(baseSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(searchSchema)}</script>
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}

      {children}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  keywords: PropTypes.string,
  price: PropTypes.string,
  currency: PropTypes.string,
  availability: PropTypes.string,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  video: PropTypes.string,
  children: PropTypes.node
};
