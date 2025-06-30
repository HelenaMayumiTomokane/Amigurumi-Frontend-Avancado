import { useState, useEffect } from 'react';

export default function useUserInfo() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  return { userInfo, setUserInfo };
}