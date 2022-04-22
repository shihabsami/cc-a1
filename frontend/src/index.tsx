import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './util/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalContextProvider from './components/GlobalContext';
import Home from './pages/home/Home';
import NavBar from './components/NavBar';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import UploadUserImage from './pages/upload-user-image/UploadProfileImage';
import Feed from './pages/feed/Feed';
import Post from './pages/feed/{id}/Post';

const rootElement = document.getElementById('root') as Element;
const root = createRoot(rootElement);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalContextProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/feed' element={<Feed />} />
              <Route path='/upload-user-image' element={<UploadUserImage />} />
              <Route path='/feed/:id' element={<Post />} />
            </Routes>
          </BrowserRouter>
        </GlobalContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
