import { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

/**
 * PotentialCandidates Component
 * Displays a table of saved candidates with their details and allows
 * users to remove candidates from the saved list.
 * Includes sorting and filtering capabilities.
 */
const PotentialCandidates = () => {
  // State management for saved candidates
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  // State for sorting
  const [sortField, setSortField] = useState<keyof Candidate>('login');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // State for filtering
  const [filterText, setFilterText] = useState('');
  const [filterField, setFilterField] = useState<keyof Candidate>('login');

  // Load saved candidates from localStorage when component mounts
  useEffect(() => {
    loadSavedCandidates();
  }, []);

  /**
   * Loads saved candidates from localStorage and updates state
   */
  const loadSavedCandidates = () => {
    const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(candidates);
  };

  /**
   * Removes a candidate from the saved list
   * @param candidateId - ID of the candidate to remove
   */
  const handleRemoveCandidate = (candidateId: number) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.id !== candidateId
    );
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    setSavedCandidates(updatedCandidates);
  };

  /**
   * Handles sorting of candidates
   * @param field - Field to sort by
   */
  const handleSort = (field: keyof Candidate) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Filters and sorts candidates based on current filter and sort settings
   */
  const getFilteredAndSortedCandidates = () => {
    let filtered = [...savedCandidates];

    // Apply filtering
    if (filterText) {
      filtered = filtered.filter(candidate => {
        const value = candidate[filterField];
        if (value === null) return false;
        return value.toString().toLowerCase().includes(filterText.toLowerCase());
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Empty state UI
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

  const filteredCandidates = getFilteredAndSortedCandidates();

  // Main candidates table UI
  return (
    <div className="app-container">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Potential Candidates
      </h1>
      
      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Filter candidates..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/20 focus:border-cyan-500 focus:outline-none"
          />
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value as keyof Candidate)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-cyan-500/20 focus:border-cyan-500 focus:outline-none"
          >
            <option value="login">Username</option>
            <option value="name">Name</option>
            <option value="location">Location</option>
            <option value="company">Company</option>
            <option value="bio">Bio</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-x-auto">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Image</th>
                <th onClick={() => handleSort('login')} className="cursor-pointer hover:text-cyan-400">
                  Name {sortField === 'login' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('location')} className="cursor-pointer hover:text-cyan-400">
                  Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} className="cursor-pointer hover:text-cyan-400">
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('company')} className="cursor-pointer hover:text-cyan-400">
                  Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('bio')} className="cursor-pointer hover:text-cyan-400">
                  Bio {sortField === 'bio' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
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
                  <td className="max-w-xs truncate">{candidate.bio || '—'}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveCandidate(candidate.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
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