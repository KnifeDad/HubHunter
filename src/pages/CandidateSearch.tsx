import { useEffect, useState } from 'react';
import { searchGithub } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

/**
 * CandidateSearch Component
 * Displays and manages the candidate search interface, allowing users to
 * browse through potential candidates and save promising ones.
 */
const CandidateSearch = () => {
  // State management for current candidate, loading state, and error handling
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches and displays the next candidate from GitHub
   * Updates loading and error states accordingly
   */
  const loadNextCandidate = async () => {
    try {
      setLoading(true);
      const users = await searchGithub();
      if (users && users.length > 0) {
        setCurrentCandidate(users[0]);
        setError(null);
      } else {
        setError('No more candidates available');
        setCurrentCandidate(null);
      }
    } catch (err) {
      setError('Error loading candidate');
      setCurrentCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Saves the current candidate to localStorage if not already saved
   * Then loads the next candidate
   */
  const handleAcceptCandidate = () => {
    if (currentCandidate) {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      // Check if candidate already exists
      if (!savedCandidates.some((c: Candidate) => c.id === currentCandidate.id)) {
        localStorage.setItem(
          'savedCandidates',
          JSON.stringify([...savedCandidates, currentCandidate])
        );
      }
      loadNextCandidate();
    }
  };

  // Load initial candidate when component mounts
  useEffect(() => {
    loadNextCandidate();
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center p-8 candidate-card-container">
          <p className="text-red-400 font-medium text-lg">{error}</p>
          <button
            onClick={loadNextCandidate}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main candidate display UI
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-80px)] px-4">
      <h1 className="text-3xl font-bold my-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Search Candidates
      </h1>
      {currentCandidate && (
        <div className="candidate-card-container">
          <div className="candidate-card-content">
            <div className="flex items-center gap-3 mb-4">
              <div className="candidate-avatar-container">
                <img
                  src={currentCandidate.avatar_url}
                  alt={`${currentCandidate.login}'s avatar`}
                  className="candidate-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold truncate mb-0.5">
                  {currentCandidate.name || currentCandidate.login}
                </h2>
                <a 
                  href={currentCandidate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  @{currentCandidate.login}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              {currentCandidate.bio && (
                <div className="stat-card">
                  <p className="text-gray-400 text-xs mb-1">Bio</p>
                  <p className="text-sm leading-relaxed line-clamp-2">{currentCandidate.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="stat-card">
                  <p className="text-gray-400 text-xs mb-1">Location</p>
                  <p className="text-sm truncate">{currentCandidate.location || '—'}</p>
                </div>
                <div className="stat-card">
                  <p className="text-gray-400 text-xs mb-1">Company</p>
                  <p className="text-sm truncate">{currentCandidate.company || '—'}</p>
                </div>
              </div>
              <div className="stat-card">
                <p className="text-gray-400 text-xs mb-1">GitHub Stats</p>
                <p className="text-sm">{currentCandidate.public_repos} repos · {currentCandidate.followers} followers</p>
              </div>
            </div>
          </div>

          <div className="candidate-card-footer">
            <button
              onClick={loadNextCandidate}
              className="circular-button circular-button-reject"
              title="Skip Candidate"
            >
              −
            </button>
            <button
              onClick={handleAcceptCandidate}
              className="circular-button circular-button-accept"
              title="Save Candidate"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
