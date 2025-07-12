import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ParticipationStats {
    all: number[];
    owner: number[];
}

interface RepositoryInfo {
    name: string;
    updated_at: string;
}

interface Props {
    username: string;
}

const MAX_REPOS_TO_FETCH = 5;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const CommitChart: React.FC<Props> = React.memo(({ username }) => {
    const [dailyCommitsData, setDailyCommitsData] = useState<{ [day: number]: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        console.log("Vite Environment Variables:", import.meta.env);
        const fetchCommitActivity = async () => {
            setLoading(true);
            setError(null);
            setDailyCommitsData(null);

            try {
                const reposResponse = await axios.get<RepositoryInfo[]>(
                    `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${MAX_REPOS_TO_FETCH}`,
                    {
                        headers: {
                            Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
                        },
                    }
                );
                console.log("Repos Response:", reposResponse); // Debugging
                const reposToProcess = reposResponse.data;
                const aggregatedDailyCommits: { [day: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

                await Promise.all(
                    reposToProcess.map(async (repo) => {
                        try {
                            const participationResponse = await axios.get<ParticipationStats>(
                                `https://api.github.com/repos/${username}/${repo.name}/stats/participation`,
                                {
                                    headers: {
                                        Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
                                    },
                                }
                            );

                            const weeklyData = participationResponse.data?.all?.slice(-7);
                            if (weeklyData) {
                                weeklyData.forEach((count, index) => {
                                    aggregatedDailyCommits[index] = (aggregatedDailyCommits[index] || 0) + count;
                                });
                            }
                        } catch (repoCommitError: any) {
                            console.error(`Error fetching commit activity for ${repo.name}:`, repoCommitError);
                            console.error("Repo Commit Error Details:", repoCommitError.response);
                            if (axios.isAxiosError(repoCommitError) && repoCommitError.response?.status === 429) {
                                setError('GitHub API rate limit exceeded. Please try again later.');
                                setLoading(false);
                                return;
                            }
                        }
                    })
                );

                setDailyCommitsData(aggregatedDailyCommits);
            } catch (error: any) {
                console.error("Error fetching repos:", error);
                console.error("Repos Error Details:", error.response);
                if (axios.isAxiosError(error) && error.response?.status === 429) {
                    setError('GitHub API rate limit exceeded. Please try again later.');
                } else if (error.response && error.response.status === 404) {
                    setError('User not found.');
                } else {
                    setError('Failed to fetch commit activity.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchCommitActivity();
        }
    }, [username]);

    const chartData = useMemo(() => {
        if (!dailyCommitsData) {
            return null;
        }

        return {
            labels: daysOfWeek,
            datasets: [
                {
                    label: 'Commits',
                    data: Object.values(dailyCommitsData),
                    backgroundColor: 'rgba(79, 70, 229, 0.7)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
                    hoverBorderColor: 'rgba(79, 70, 229, 1)',
                },
            ],
        };
    }, [dailyCommitsData, daysOfWeek]);

    return (
        <div className='container mx-auto p-4'>
            <Card className="shadow-md rounded-lg w-full">
                <CardHeader className="p-4">
                    <CardTitle className="text-md font-semibold tracking-tight">
                        Daily Commit Activity (Last Week)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {error && <p className="text-red-500 italic">{error}</p>}
                    {loading && <p className="text-gray-500 animate-pulse">Loading commit activity...</p>}
                    {chartData && (
                        <div className="relative h-80"> {/* Increased height */}
                            <Chart
                                type="bar"
                                data={chartData}
                                options={{
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: 'Commits',
                                                color: '#6b7280',
                                                font: {
                                                    size: 12,
                                                },
                                            },
                                            ticks: {
                                                color: '#4b5563',
                                                font: {
                                                    size: 10,
                                                },
                                            },
                                            grid: {
                                                color: '#e5e7eb',
                                            },
                                        },
                                        x: {
                                            ticks: {
                                                color: '#4b5563',
                                                font: {
                                                    size: 10,
                                                },
                                            },
                                            grid: {
                                                display: false,
                                            },
                                        },
                                    },
                                    plugins: {
                                        tooltip: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                            bodyColor: '#f3f4f6',
                                            titleColor: '#f3f4f6',
                                            borderColor: '#4b5563',
                                            borderWidth: 1,
                                            cornerRadius: 3,
                                            callbacks: {
                                                label: (context) => ` Commits: ${context.parsed.y}`,
                                            },
                                            padding: 8,
                                        },
                                        legend: {
                                            display: false,
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>

                    )}
                    {chartData === null && !loading && !error && (
                        <p className="text-sm text-gray-500 italic">No commit activity data available.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
});

export default CommitChart;