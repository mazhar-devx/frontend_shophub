import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * Standardized Canonical & Technical Crawl Directives
 * Normalizes URL structure to avoid competing variants:
 * - Drops trailing slashes (e.g. /products/ -> /products)
 * - Keeps root as https://www.shophub.pro
 * - Prevents indexation of internal search results and high-cardinality sorting/filtering params
 */
export default function CanonicalSEO() {
  const location = useLocation();
  const rawPath = location.pathname.toLowerCase();
  const cleanPath = rawPath === '/' ? '' : rawPath.replace(/\/+$/, '');
  const canonicalUrl = `https://www.shophub.pro${cleanPath}`;

  // Analyze query parameters
  const searchParams = new URLSearchParams(location.search);
  const isSearchPage = cleanPath === '/search' || searchParams.has('search') || searchParams.has('q');
  
  // Non-indexable filter / sort parameter combinations
  const hasFilterOrSortParams = searchParams.has('sort') || 
                                searchParams.has('sortBy') || 
                                searchParams.has('page') || 
                                searchParams.has('minPrice') || 
                                searchParams.has('maxPrice') ||
                                searchParams.has('v'); // video queries inside watch-me

  const shouldNoindex = isSearchPage || hasFilterOrSortParams;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      {shouldNoindex && (
        <meta name="robots" content="noindex, follow" />
      )}
    </Helmet>
  );
}
