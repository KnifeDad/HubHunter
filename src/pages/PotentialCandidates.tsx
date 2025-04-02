import { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const PotentialCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    loadSavedCandidates();
  }, []);

  const loadSavedCandidates = () => {
    const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(candidates);
  };

  const handleRemoveCandidate = (candidateId: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== candidateId
    );
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    setSavedCandidates(updatedCandidates);
  };

  if (savedCandidates.length === 0) {
    return (
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Potential Candidates
        </h1>
        <div className="text-center text-gray-400 card p-8 max-w-2xl mx-auto">
          <p className="text-lg">No candidates saved yet.</p>
          <p className="text-sm mt-2">Start searching to add potential candidates to your list!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Potential Candidates
      </h1>
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-x-auto">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Email</th>
                <th>Company</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    <img
                      src={candidate.avatar_url}
                      alt={`${candidate.login}'s avatar`}
                      className="table-avatar"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                      }}
                    />
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{candidate.name || candidate.login}</p>
                      <a 
                        href={candidate.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        @{candidate.login}
                      </a>
                    </div>
                  </td>
                  <td>{candidate.location || '—'}</td>
                  <td>{candidate.email || '—'}</td>
                  <td>{candidate.company || '—'}</td>
                  <td>
                    <p className="table-bio" title={candidate.bio || ''}>
                      {candidate.bio || '—'}
                    </p>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveCandidate(candidate.id)}
                      className="circular-button circular-button-reject"
                      title="Remove Candidate"
                    >
                      −
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PotentialCandidates; 