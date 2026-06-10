import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function CanonicalSEO() {
  const location = useLocation();
  const currentUrl = `https://www.shophub.pro${location.pathname === '/' ? '' : location.pathname}`;

  return (
    <Helmet>
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
}
