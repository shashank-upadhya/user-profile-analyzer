import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

interface Repository {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    created_at: string;
}

const UserProfile = () => {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [repoLoading, setRepoLoading] = useState(false);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        setUser(null);
        setRepos([]);

        try {
            const userResponse = await fetch(`https://api.github.com/users/${username}`);
            
            if (!userResponse.ok) {
                if (userResponse.status === 404) {
                    setError('User not found.');
                } else if (userResponse.status === 403) {
                    setError('GitHub API rate limit exceeded. Please try again later.');
                } else {
                    setError('Failed to fetch user data.');
                }
                return;
            }

            const userData = await userResponse.json();
            setUser(userData);

            // Fetch repositories
            setRepoLoading(true);
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
            
            if (reposResponse.ok) {
                const reposData = await reposResponse.json();
                setRepos(reposData);
            } else {
                console.warn('Could not fetch repositories');
            }
        } catch (error: any) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
            setRepoLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent | React.KeyboardEvent) => {
        event.preventDefault();
        if (username.trim()) {
            fetchUserData();
        }
    };

    // Language statistics
    const languageStats = useMemo(() => {
        const langCount: { [key: string]: number } = {};
        repos.forEach(repo => {
            if (repo.language) {
                langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
        });
        
        return Object.entries(langCount)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [repos]);

    // Repository stats
    const repoStats = useMemo(() => {
        if (repos.length === 0) return null;
        
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const mostStarredRepo = repos.reduce((max, repo) => 
            repo.stargazers_count > max.stargazers_count ? repo : max, repos[0]);
        
        return {
            totalStars,
            totalForks,
            mostStarredRepo,
            avgStarsPerRepo: Math.round(totalStars / repos.length * 10) / 10
        };
    }, [repos]);

    // Account age and activity
    const accountInfo = useMemo(() => {
        if (!user) return null;
        
        const createdDate = new Date(user.created_at);
        const updatedDate = new Date(user.updated_at);
        const now = new Date();
        
        const accountAge = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysSinceUpdate = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
            accountAge,
            daysSinceUpdate,
            joinedYear: createdDate.getFullYear()
        };
    }, [user]);

    return (
        <div className="container mx-auto mt-0 pt-4 pr-4 pl-4 max-w-4xl">
            <h1 className='text-3xl p-3 m-2 text-center text-blue-950 font-bold'>
                GitHub User Profile Analyzer
            </h1>
            
            <div className="mb-6 flex space-x-2 max-w-md mx-auto">
                <Input
                    type="text"
                    placeholder="Enter GitHub username (e.g., octocat)"
                    value={username}
                    onChange={handleInputChange}
                    className="flex-1"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit(e);
                        }
                    }}
                />
                <Button 
                    className='bg-blue-600 hover:bg-blue-700 text-white px-6' 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Analyze'}
                </Button>
            </div>

            {error && (
                <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            {user && (
                <div className="space-y-6">
                    {/* User Profile Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <img
                                src={user.avatar_url}
                                alt={user.login}
                                className="rounded-full w-32 h-32 mx-auto border-4 border-blue-200 mb-4"
                            />
                            <CardTitle className="text-2xl font-bold">
                                {user.name || user.login}
                            </CardTitle>
                            <CardDescription>
                                <a
                                    href={user.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-lg"
                                >
                                    @{user.login}
                                </a>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.bio && (
                                <p className="text-gray-700 text-center italic">"{user.bio}"</p>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {user.public_repos}
                                    </div>
                                    <div className="text-sm text-gray-600">Repositories</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {user.followers}
                                    </div>
                                    <div className="text-sm text-gray-600">Followers</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {user.following}
                                    </div>
                                    <div className="text-sm text-gray-600">Following</div>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {accountInfo?.joinedYear}
                                    </div>
                                    <div className="text-sm text-gray-600">Joined</div>
                                </div>
                            </div>

                            {accountInfo && (
                                <div className="text-center text-sm text-gray-500">
                                    Account is {accountInfo.accountAge} days old • 
                                    Last activity {accountInfo.daysSinceUpdate} days ago
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Repository Statistics */}
                    {repoStats && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Repository Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            ⭐ {repoStats.totalStars}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Stars</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            🍴 {repoStats.totalForks}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Forks</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            📊 {repoStats.avgStarsPerRepo}
                                        </div>
                                        <div className="text-sm text-gray-600">Avg Stars/Repo</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            🏆 {repoStats.mostStarredRepo.stargazers_count}
                                        </div>
                                        <div className="text-sm text-gray-600">Most Starred</div>
                                    </div>
                                </div>
                                
                                <div className="text-center text-sm text-gray-600">
                                    Most starred repository: 
                                    <a 
                                        href={repoStats.mostStarredRepo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline ml-1"
                                    >
                                        {repoStats.mostStarredRepo.name}
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Language Statistics */}
                    {languageStats.length > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Top Programming Languages</CardTitle>
                                <CardDescription>
                                    Based on repository primary languages
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={languageStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="language" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Repositories */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Recent Repositories</CardTitle>
                            <CardDescription>
                                {repoLoading ? 'Loading repositories...' : `Showing ${repos.length} most recent repositories`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {repos.length > 0 ? (
                                <div className="space-y-4">
                                    {repos.map((repo) => (
                                        <div key={repo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">
                                                        <a
                                                            href={repo.html_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {repo.name}
                                                        </a>
                                                    </h3>
                                                    {repo.description && (
                                                        <p className="text-gray-600 mt-1">
                                                            {repo.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        {repo.language && (
                                                            <span className="flex items-center">
                                                                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                        <span>⭐ {repo.stargazers_count}</span>
                                                        <span>🍴 {repo.forks_count}</span>
                                                        <span>
                                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    {repoLoading ? 'Loading repositories...' : 'No public repositories found.'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UserProfile;