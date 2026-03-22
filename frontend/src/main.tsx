import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux'
import { store } from '@/redux/store';
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'

// ✅ Self-hosted fonts via @fontsource (không cần internet, load chắc chắn)
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
