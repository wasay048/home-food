import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function WeChatCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleWeChatCallback } = useAuth();

  useEffect(() => {
    const code = params.get('code');
    if (code) {
      handleWeChatCallback(code).then(() => navigate('/', { replace: true }));
    }
  }, [params, handleWeChatCallback, navigate]);

  return <div className="d-flex vh-100 align-items-center justify-content-center">Authorizing...</div>;
}
