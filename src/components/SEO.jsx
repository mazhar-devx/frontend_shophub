import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export default function SEO({ 
  title, 
  description, 
  name, 
  type, 
  image, 
  url, 
  keywords,
  price,
  currency,
  availability,
  children 
}) {
  const siteTitle = "ShopHub - Premium E-Commerce & Social Video";
  const defaultDescription = "ShopHub is your premium destination for the latest electronics, fashion, and immersive social video shopping experience. Fast delivery and secure payments.";
  const siteUrl = "https://www.shophub.pro";
  const defaultImage = `${siteUrl}/logo.png`;

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const metaUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={metaUrl} />

      {/* Facebook Open Graph */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="ShopHub" />
      
      {price && <meta property="product:price:amount" content={price} />}
      {currency && <meta property="product:price:currency" content={currency} />}
      {availability && <meta property="product:availability" content={availability} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={type === 'product' ? 'product' : 'summary_large_image'} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {price && <meta name="twitter:label1" content="Price" />}
      {price && <meta name="twitter:data1" content={`${price} ${currency || 'PKR'}`} />}
      {availability && <meta name="twitter:label2" content="Availability" />}
      {availability && <meta name="twitter:data2" content={availability === 'https://schema.org/InStock' ? 'In Stock' : 'Out of Stock'} />}

      {/* Custom Child Tags (like JSON-LD) */}
      {children}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  keywords: PropTypes.string,
  price: PropTypes.string,
  currency: PropTypes.string,
  availability: PropTypes.string,
  children: PropTypes.node
};
