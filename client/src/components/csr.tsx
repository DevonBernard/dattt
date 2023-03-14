import { useState, useEffect } from 'react';

// This component forces children to be rendered client-side.
// This resolves DOM conflicts with hydration and SSR
export const CSRComponent = ({ children } : { children: any}) => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded) {
    return null;
  }

  return children;
};
