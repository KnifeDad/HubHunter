import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './env.test';

import App from './App.tsx';
import CandidateSearch from './pages/CandidateSearch.tsx';
import PotentialCandidates from './pages/PotentialCandidates.tsx';
import ErrorPage from './pages/ErrorPage.tsx';

/**
 * Application Router Configuration
 * Defines the main routes and their corresponding components:
 * - /: Candidate search page (home)
 * - /saved: Saved candidates page
 * - Error page for 404 and other errors
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CandidateSearch />,
      },
      {
        path: '/saved',
        element: <PotentialCandidates />,
      },
    ],
  },
]);

// Initialize the React application
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
