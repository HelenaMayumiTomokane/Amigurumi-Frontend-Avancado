import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function useAmigurumiId() {
  const [amigurumiId, setAmigurumiId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromURL = params.get('amigurumi_id');
    if (idFromURL) {
      setAmigurumiId(parseInt(idFromURL));
    }
  }, [location.search]);

  return amigurumiId;
}
