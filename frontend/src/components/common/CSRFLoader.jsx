import { useEffect } from 'react';
import { api } from '../../utils/api';

const CSRFLoader = () => {
  useEffect(() => {
    api.get('/csrf/')
      .then(() => console.log('✅ CSRF token obtenido'))
      .catch(() => console.warn('❌ No se pudo obtener CSRF'));
  }, []);

  return null; // no renderiza nada
};

export default CSRFLoader;
