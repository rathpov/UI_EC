import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './Home.css';
// import Home from './Home.jsx';
import Product from './component/Product.jsx';
import UI from './component/ui.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Home />
    <Product /> */}
    <UI />
  </StrictMode>,
);