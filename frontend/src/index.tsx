import React from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './util/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Feed from './pages/feed/Feed';
import { GlobalContextProvider } from './components/GlobalContext';
import NavBar from './components/NavBar';
import UploadProfileImage from './pages/uploadProfileImage/UploadProfileImage';
import ReactDOM from 'react-dom';
import Post from './pages/feed/post/Post';

const queryClient = new QueryClient();
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalContextProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signIn' element={<SignIn />} />
              <Route path='/signUp' element={<SignUp />} />
              <Route path='/feed' element={<Feed />} />
              <Route path='/uploadProfileImage' element={<UploadProfileImage />} />
              <Route path='/feed/:id' element={<Post />} />
            </Routes>
          </BrowserRouter>
        </GlobalContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
