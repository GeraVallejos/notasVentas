import { useEffect } from 'react';
import { api } from '../../utils/api';

const CSRFLoader = () => {
  useEffect(() => {
    api.get('/csrf/')
  }, []);

  return null; // no renderiza nada
};

export default CSRFLoader;
