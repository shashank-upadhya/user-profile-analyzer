import React, { useState, useCallback } from 'react';
import UserProfile from './components/UserProfile';
import CommitChart from './components/CommitChart';

const App: React.FC = () => {
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  const handleUsernameSubmit = useCallback((username: string) => {
    setGithubUsername(username);
  }, []);

  return (
    <div>
      <UserProfile onUsernameSubmit={handleUsernameSubmit} />
      {githubUsername && <CommitChart username={githubUsername} />}
    </div>
  );
};

export default App;