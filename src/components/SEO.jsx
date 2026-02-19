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
  children 
}) {
  const siteTitle = "ShopHub - Premium E-Commerce";
  const defaultDescription = "ShopHub is your premium destination for the latest electronics, fashion, and home essentials. Fast delivery and secure payments.";
  const siteUrl = "https://www.shophub.pro"; // Replace with actual domain if different
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

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

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
  children: PropTypes.node
};
