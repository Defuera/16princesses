import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PrincessList from './components/PrincessList';
import PrincessGraph from './components/PrincessGraph';
import PrincessMessage from './components/PrincessMessage';
import { getAllPrincesses, getPrincessById } from './data/princessData';
import './styles/index.css';
import './styles/components.css';

const ResultPage: React.FC = () => {
  const { princessId } = useParams<{ princessId: string }>();
  const allPrincesses = getAllPrincesses();
  const selectedPrincess = princessId ? getPrincessById(princessId) : undefined;

  if (!selectedPrincess) {
    return (
      <div className="error-container">
        <h2>Princess not found!</h2>
        <p>The princess you're looking for doesn't exist.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="back-button"
        >
          Back to Princess Selection
        </button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-content">
        <div className="graph-section">
          <PrincessGraph 
            princesses={allPrincesses}
            selectedPrincess={selectedPrincess}
          />
        </div>
        <div className="message-section">
          <PrincessMessage princess={selectedPrincess} />
        </div>
      </div>
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="error-container">
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate('/')}
        className="back-button"
      >
        Back to Princess Selection
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PrincessList />} />
          <Route path="/result/:princessId" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
