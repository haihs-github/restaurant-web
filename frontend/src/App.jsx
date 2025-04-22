import { RouterProvider } from 'react-router-dom';
import router from './routes';

import Header from './components/Header';

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
