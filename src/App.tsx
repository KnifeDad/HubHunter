import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

/**
 * App Component
 * Main application wrapper that provides the navigation and layout structure.
 * Uses React Router's Outlet for rendering child routes.
 */
function App() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
