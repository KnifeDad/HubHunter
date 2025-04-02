import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const loadSavedCandidates = () => {
      const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      setSavedCandidates(candidates);
    };

    loadSavedCandidates();
  }, []);

  const handleReject = (candidateId: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== candidateId
    );
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    setSavedCandidates(updatedCandidates);
  };

  if (savedCandidates.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Potential Candidates</h1>
        <p className="text-center text-gray-600">No candidates have been accepted yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Potential Candidates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={candidate.avatar_url}
                alt={`${candidate.login}'s avatar`}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold">{candidate.name || candidate.login}</h2>
                <p className="text-gray-600">@{candidate.login}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p><strong>Location:</strong> {candidate.location || 'Not specified'}</p>
              <p><strong>Email:</strong> {candidate.email || 'Not specified'}</p>
              <p><strong>Company:</strong> {candidate.company || 'Not specified'}</p>
              <p>
                <a 
                  href={candidate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View GitHub Profile
                </a>
              </p>
            </div>

            <button
              onClick={() => handleReject(candidate.id)}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove (-)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCandidates;
