<?php

namespace App\Orchid\Screens;

use App\Models\Block;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\Label;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;

class StatisticsScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Application Statistics';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Overview of application usage and performance.';

    /**
     * Stores the queried data.
     *
     * @var array
     */
    protected $data;

    /**
     * Query data.
     *
     * @return array
     */
    public function query(): iterable
    {
        // Define time periods for statistics
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        // --- Blocks Statistics (using the 'File' model as 'Block') ---
        // Count blocks created today
        $blocksCreatedToday = Block::whereDate('created_at', $today)->count();
        // Count blocks created this week
        $blocksCreatedThisWeek = Block::whereBetween('created_at', [$thisWeek, Carbon::now()])->count();
        // Count blocks created this month
        $blocksCreatedThisMonth = Block::whereBetween('created_at', [$thisMonth, Carbon::now()])->count();
        // Total number of blocks
        $totalBlocks = Block::count();

        // --- Projects Statistics ---
        // Count projects created today
        $projectsCreatedToday = Project::whereDate('created_at', $today)->count();
        // Count projects created this week
        $projectsCreatedThisWeek = Project::whereBetween('created_at', [$thisWeek, Carbon::now()])->count();
        // Count projects created this month
        $projectsCreatedThisMonth = Project::whereBetween('created_at', [$thisMonth, Carbon::now()])->count();
        // Total number of projects
        $totalProjects = Project::count();

        // Convert Carbon instances to Unix timestamps for 'last_activity' comparison
        $todayTimestamp = $today->timestamp;
        $thisMonthTimestamp = $thisMonth->timestamp;

        // New Sessions (based on last_activity)
        $newSessionsToday = DB::table('sessions')
            ->where('last_activity', '>=', $todayTimestamp)
            ->count();
        $newSessionsThisMonth = DB::table('sessions')
            ->where('last_activity', '>=', $thisMonthTimestamp)
            ->count();

        // Logins (authenticated sessions)
        $loginsToday = DB::table('sessions')
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', $todayTimestamp)
            ->count();
        $loginsThisMonth = DB::table('sessions')
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', $thisMonthTimestamp)
            ->count();

        $privateStoragePath = Storage::path('');

        // Calculate actual directory sizes
        $storageUsedPrivateBytes = $this->getDirectorySize($privateStoragePath);

        // Format bytes to human-readable format
        $storageUsedPrivate = $this->formatBytes($storageUsedPrivateBytes);

        // --- Historical data for Charts (Last 7 Days) ---
        $blocksCreatedDaily = [];
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::today()->subDays($i);
            $blocksCreatedDaily[$date->format('M d')] = Block::whereDate('created_at', $date)->count();
        }

        $projectsCreatedDaily = [];
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::today()->subDays($i);
            $projectsCreatedDaily[$date->format('M d')] = Project::whereDate('created_at', $date)->count();
        }

        $hasBlocksChartData = array_sum($blocksCreatedDaily) > 0;
        $hasProjectsChartData = array_sum($projectsCreatedDaily) > 0;

        // Prepare data in the format expected by Orchid's Chart layout
        $blockChartData = [
            'labels' => array_keys($blocksCreatedDaily),
            'name' => 'Blocks Created Last 7 Days',
            'values' => array_values($blocksCreatedDaily),
        ];

        $projectChartData = [
            'labels' => array_keys($projectsCreatedDaily),
            'name' => 'Projects Created Last 7 Days',
            'values' => array_values($projectsCreatedDaily),
        ];

        // Store the data in a protected property
        $this->data = [
            'metrics' => [
                'blocks_created_today' => $blocksCreatedToday,
                'blocks_created_week' => $blocksCreatedThisWeek,
                'blocks_created_month' => $blocksCreatedThisMonth,
                'total_blocks' => $totalBlocks,

                'projects_created_today' => $projectsCreatedToday,
                'projects_created_week' => $projectsCreatedThisWeek,
                'projects_created_month' => $projectsCreatedThisMonth,
                'total_projects' => $totalProjects,

                'new_sessions_today' => $newSessionsToday,
                'new_sessions_month' => $newSessionsThisMonth,
                'logins_today' => $loginsToday,
                'logins_month' => $loginsThisMonth,
                'storage_used_private' => $storageUsedPrivate,
            ],
            'charts' => [
                // Pass chart data under distinct keys
                'blocksChart' => [$blockChartData],
                'projectsChart' => [$projectChartData],
            ],
            // Flags to indicate if chart data is present
            'hasBlocksChartData' => $hasBlocksChartData,
            'hasProjectsChartData' => $hasProjectsChartData,
        ];

        // dd($this->data);
        return $this->data;
    }

    /**
     * Define the command bar for the screen.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            Link::make('Refresh')
                ->icon('refresh')
                ->route('platform.statistics'), // Route to refresh the current screen
        ];
    }

    /**
     * Define the screen's layout.
     *
     * @return \Orchid\Screen\Layout[]
     */
    public function layout(): iterable
    {
        $data = $this->data;

        $layouts = [];

        // --- Blocks Statistics Metrics ---
        $layouts[] = Layout::metrics([
            'Blocks Created (Today)' => 'metrics.blocks_created_today',
            'Blocks Created (This Week)' => 'metrics.blocks_created_week',
            'Blocks Created (This Month)' => 'metrics.blocks_created_month',
        ])->title('Blocks Created');

        $layouts[] = Layout::metrics([
            'Total Blocks' => 'metrics.total_blocks',
        ]);

        // --- Projects Statistics Metrics ---
        $layouts[] = Layout::metrics([
            'Projects Created (Today)' => 'metrics.projects_created_today',
            'Projects Created (This Week)' => 'metrics.projects_created_week',
            'Projects Created (This Month)' => 'metrics.projects_created_month',
        ])->title('Projects Created');

        $layouts[] = Layout::metrics([
            'Total Projects' => 'metrics.total_projects',
        ]);

        // --- User Sessions and Logins Metrics ---
        $layouts[] = Layout::metrics([
            'New Sessions (Today)' => 'metrics.new_sessions_today',
            'New Sessions (This Month)' => 'metrics.new_sessions_month',
            'Logins (Today)' => 'metrics.logins_today',
            'Logins (This Month)' => 'metrics.logins_month',
        ])->title('User Activity');

        // --- Storage Used Metrics ---
        $layouts[] = Layout::metrics([
            'Storage Used (Private)' => 'metrics.storage_used_private',
        ])->title('Storage Usage');

        // --- Conditional Charts ---
        $chartLayouts = [];

        // Check if there's data for the Blocks Created chart
        if ($data['hasBlocksChartData']) {
            // Reference the new distinct key for blocks chart data
            $chartLayouts[] = Layout::chart('charts.blocksChart', 'Blocks Created Last 7 Days');
            // dd($chartLayouts);
        } else {
            // If no data, display a message using a Label field within a row layout
            $chartLayouts[] = Layout::rows([
                Label::make('no_blocks_data')
                    ->title('Blocks Created Last 7 Days')
                    ->value('No data available for Blocks Created chart.'),
            ]);
        }

        // Check if there's data for the Projects Created chart
        if ($data['hasProjectsChartData']) {
            // Reference the new distinct key for projects chart data
            $chartLayouts[] = Layout::chart('charts.projectsChart', 'Projects Created Last 7 Days');
        } else {
            // If no data, display a message using a Label field within a row layout
            $chartLayouts[] = Layout::rows([
                Label::make('no_projects_data')
                    ->title('Projects Created Last 7 Days')
                    ->value('No data available for Projects Created chart.'),
            ]);
        }
        // dd($chartLayouts);
        // Combine the conditional chart layouts into a columns layout
        $layouts[] = Layout::columns($chartLayouts);

        return $layouts;
    }

    /**
     * Recursively calculates the size of a directory.
     *
     * @param  string  $directoryPath  The full path to the directory.
     * @return int The size of the directory in bytes.
     */
    private function getDirectorySize(string $directoryPath): int
    {
        $size = 0;
        if (! is_dir($directoryPath)) {
            return $size;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directoryPath, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }

        return $size;
    }

    /**
     * Formats a byte value into a human-readable string (e.g., KB, MB, GB).
     *
     * @param  int  $bytes  The number of bytes.
     * @param  int  $precision  The number of decimal places to round to.
     * @return string The formatted string.
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision).' '.$units[$pow];
    }
}
