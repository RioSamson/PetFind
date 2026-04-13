import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import ReportSubmissionPage from './pages/ReportSubmissionPage';
import DetailsPage from './pages/DetailsPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/report" element={<ReportSubmissionPage/>} />
      <Route path="/report/:id" element={<DetailsPage/>} />
    </Routes>
  );
}

export default App
