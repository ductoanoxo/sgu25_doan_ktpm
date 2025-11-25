// CI/CD Status Service - Fetch GitHub Actions workflow status
const https = require('https');
const { metrics } = require('../metrics');

class CICDStatusService {
    constructor() {
        this.owner = process.env.GITHUB_OWNER || 'ductoanoxo';
        this.repo = process.env.GITHUB_REPO || 'sgu25_doan_ktpm';
        this.token = process.env.GITHUB_TOKEN || ''; // Optional: set GITHUB_TOKEN for higher rate limits
        this.apiBase = 'api.github.com';
        this.updateInterval = parseInt(process.env.CICD_METRICS_INTERVAL) || 60000; // Default: 60 seconds
        this.enabled = process.env.CICD_METRICS_ENABLED !== 'false'; // Default: enabled
        this.timer = null;
    }

    /**
     * Make HTTPS request to GitHub API
     */
    makeRequest(path) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.apiBase,
                path: path,
                method: 'GET',
                headers: {
                    'User-Agent': 'sgu25-doan-ktpm-metrics',
                    'Accept': 'application/vnd.github.v3+json'
                }
            };

            // Add token if available
            if (this.token) {
                options.headers['Authorization'] = `token ${this.token}`;
            }

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(new Error(`Failed to parse JSON: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    /**
     * Fetch latest workflow runs
     */
    async fetchWorkflowRuns() {
        try {
            const path = `/repos/${this.owner}/${this.repo}/actions/runs?per_page=10`;
            const data = await this.makeRequest(path);
            return data.workflow_runs || [];
        } catch (error) {
            console.error('❌ Error fetching workflow runs:', error.message);
            return [];
        }
    }

    /**
     * Fetch specific workflow run details
     */
    async fetchWorkflowRunDetails(runId) {
        try {
            const path = `/repos/${this.owner}/${this.repo}/actions/runs/${runId}`;
            return await this.makeRequest(path);
        } catch (error) {
            console.error(`❌ Error fetching run ${runId}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch jobs for a workflow run
     */
    async fetchWorkflowJobs(runId) {
        try {
            const path = `/repos/${this.owner}/${this.repo}/actions/runs/${runId}/jobs`;
            const data = await this.makeRequest(path);
            return data.jobs || [];
        } catch (error) {
            console.error(`❌ Error fetching jobs for run ${runId}:`, error.message);
            return [];
        }
    }

    /**
     * Update metrics with CI/CD status
     */
    async updateMetrics() {
        if (!this.enabled) {
            console.log('ℹ️  CI/CD metrics disabled');
            return;
        }

        try {
            console.log('📊 Updating CI/CD metrics from GitHub Actions...');

            const runs = await this.fetchWorkflowRuns();

            if (runs.length === 0) {
                console.log('⚠️  No workflow runs found');
                return;
            }

            // Process latest run
            const latestRun = runs[0];
            const branch = latestRun.head_branch || 'unknown';
            const workflowName = latestRun.name || 'CI/CD Pipeline';
            const status = latestRun.status; // queued, in_progress, completed
            const conclusion = latestRun.conclusion; // success, failure, cancelled, skipped, null

            // Update build status
            let statusValue = -1; // in_progress
            if (status === 'completed') {
                statusValue = conclusion === 'success' ? 1 : 0;
            }

            metrics.cicdBuildStatus.labels(workflowName, branch, 'overall').set(statusValue);

            // Update last build timestamp
            const buildTime = new Date(latestRun.created_at).getTime() / 1000;
            metrics.cicdLastBuildTime.labels(workflowName, branch).set(buildTime);

            // Update workflow info
            metrics.githubWorkflowInfo.labels(
                workflowName,
                latestRun.id.toString(),
                latestRun.run_number.toString(),
                latestRun.event || 'unknown',
                (latestRun.actor && latestRun.actor.login) ? latestRun.actor.login : 'unknown'
            ).set(1);


            // Count builds by status
            if (status === 'completed' && conclusion) {
                metrics.cicdBuildsTotal.labels(workflowName, branch, conclusion).inc();
            }

            // Get job details for more granular metrics
            const jobs = await this.fetchWorkflowJobs(latestRun.id);

            for (const job of jobs) {
                const jobName = job.name;
                const jobStatus = job.status;
                const jobConclusion = job.conclusion;

                // Job status
                let jobStatusValue = -1;
                if (jobStatus === 'completed') {
                    jobStatusValue = jobConclusion === 'success' ? 1 : 0;
                }
                metrics.cicdBuildStatus.labels(workflowName, branch, jobName).set(jobStatusValue);

                // Job duration
                if (job.started_at && job.completed_at) {
                    const startTime = new Date(job.started_at);
                    const endTime = new Date(job.completed_at);
                    const duration = (endTime - startTime) / 1000; // seconds
                    metrics.cicdBuildDuration.labels(workflowName, branch, jobName).observe(duration);
                }

                // Test results (if job name contains 'test')
                if (jobName.toLowerCase().includes('test')) {
                    const testStatus = jobConclusion === 'success' ? 'passed' : 'failed';
                    metrics.cicdTestResults.labels(workflowName, jobName, testStatus).set(1);
                }

                // Deployment status (if job name contains 'deploy')
                if (jobName.toLowerCase().includes('deploy')) {
                    const deployStatus = jobConclusion === 'success' ? 1 : 0;
                    const env = jobName.toLowerCase().includes('production') ? 'production' : 'staging';
                    metrics.cicdDeploymentStatus.labels(env, jobName).set(deployStatus);
                }
            }

            console.log(`✅ CI/CD metrics updated - Latest: ${workflowName} #${latestRun.run_number} (${conclusion || status})`);

        } catch (error) {
            console.error('❌ Error updating CI/CD metrics:', error.message);
        }
    }

    /**
     * Start periodic updates
     */
    start() {
        if (!this.enabled) {
            console.log('ℹ️  CI/CD metrics collection is disabled');
            return;
        }

        console.log(`📊 Starting CI/CD metrics collection (interval: ${this.updateInterval}ms)`);
        console.log(`   Repository: ${this.owner}/${this.repo}`);
        console.log(`   Token: ${this.token ? '✅ Configured' : '⚠️  Not configured (rate limits apply)'}`);

        // Initial update
        this.updateMetrics();

        // Schedule periodic updates
        this.timer = setInterval(() => {
            this.updateMetrics();
        }, this.updateInterval);
    }

    /**
     * Stop periodic updates
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log('📊 CI/CD metrics collection stopped');
        }
    }

    /**
     * Get current status as JSON
     */
    async getStatus() {
        try {
            const runs = await this.fetchWorkflowRuns();

            if (runs.length === 0) {
                return { status: 'no_data', message: 'No workflow runs found' };
            }

            const latestRun = runs[0];

            return {
                status: 'ok',
                latest_run: {
                    id: latestRun.id,
                    name: latestRun.name,
                    run_number: latestRun.run_number,
                    event: latestRun.event,
                    status: latestRun.status,
                    conclusion: latestRun.conclusion,
                    branch: latestRun.head_branch,
                    created_at: latestRun.created_at,
                    updated_at: latestRun.updated_at,
                    actor: latestRun.actor ? .login || 'unknown',
                    html_url: latestRun.html_url
                },

                recent_runs: runs.slice(0, 5).map(run => ({
                    id: run.id,
                    run_number: run.run_number,
                    status: run.status,
                    conclusion: run.conclusion,
                    branch: run.head_branch,
                    created_at: run.created_at
                }))
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            };
        }
    }
}

// Singleton instance
const cicdStatusService = new CICDStatusService();

module.exports = cicdStatusService;