<?php

namespace App\Orchid\Screens;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link; // Add this import for DropDown
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;
use Str;

class BackupScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Backups';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Manage application backups.';

    /**
     * Permission string.
     *
     * @var string
     */
    public $permission = 'platform.backups.list';

    /**
     * Query data.
     */
    public function query(): array
    {
        $backups = $this->getBackups();
        // dd($backups);
        // NEW: Pre-render name and actions HTML here
        $processedBackups = array_map(function ($backup) {
            // Render the Link for the name column
            $nameLink = Link::make($backup['name'])
                ->route('platform.backups.download', ['encodedPath' => base64_encode($backup['path'])])
                ->canSee(Auth::user()->hasAccess('platform.backups.download'))
                ->toHtml(); // Convert to HTML string

            // Render the DropDown for the actions column
            $actionsDropDown = DropDown::make()
                ->icon('bs.three-dots-vertical')
                ->list([
                    Link::make('Download')
                        ->icon('bs.cloud-arrow-down')
                        ->route('platform.backups.download', ['encodedPath' => base64_encode($backup['path'])])
                        ->canSee(Auth::user()->hasAccess('platform.backups.download')),

                    Button::make('Delete')
                        ->icon('bs.trash3')
                        ->confirm(__('Once the backup is deleted, it cannot be recovered. Are you sure you want to delete this backup?'))
                        ->method('delete', [
                            'path' => $backup['path'],
                        ])
                        ->canSee(Auth::user()->hasAccess('platform.backups.delete')),
                ])->toHtml(); // Convert to HTML string

            $backup['name_html'] = $nameLink;
            $backup['actions_html'] = $actionsDropDown;

            return $backup;
        }, $backups);

        // dd($processedBackups);
        return ['backups' => match (Request()->query('sort')) {
            'size' => collect($processedBackups)->sortBy('size_raw')->all(),
            '-size' => collect($processedBackups)->sortByDesc('size_raw')->all(),
            'date' => collect($processedBackups)->sortBy('date_timestamp')->all(),
            '-date' => collect($processedBackups)->sortByDesc('date_timestamp')->all(),
            null => $processedBackups
        }];
    }

    /**
     * Button commands.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): array
    {
        return [
            Link::make('Create New Backup (Database)')
                ->icon('cloud-upload')
                ->route('platform.backups.create-db')
                ->canSee(Auth::user()->hasAccess('platform.backups.create')),
        ];
    }

    /**
     * Views.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): array
    {
        return [
            Layout::table('backups', [
                TD::make('name_html', 'File Name')
                    ->render(fn (array $backup) => $backup['name_html']),
                TD::make('size', 'Size')->render(fn (array $backup) => $backup['size_formatted'])->sort(),
                TD::make('date', 'Date')->render(fn (array $backup) => $backup['date'])->sort(),
                TD::make('actions_html', 'Actions')
                    ->align(TD::ALIGN_CENTER)
                    ->width('100px')
                    ->render(fn (array $backup) => $backup['actions_html']),
            ]),
        ];
    }

    /**
     * Logic for getting backup files.
     */
    private function getBackups(): array
    {
        $backups = [];
        $diskName = config('backup.backup.destination.disks')[0] ?? 'local';
        $disk = Storage::disk($diskName);

        $files = $disk->allFiles(config('backup.backup.name'));

        $backups = collect($files)->filter(function ($file) {
            return Str::endsWith($file, '.zip');
        })->map(function ($file) use ($disk) { // Pass $disk into use clause
            $rawSize = $disk->size($file); // Get raw size in bytes
            $lastModifiedTimestamp = $disk->lastModified($file); // Get timestamp

            return [
                'name' => basename($file),
                'size_formatted' => $this->formatBytes($rawSize), // Formatted for display
                'size_raw' => $rawSize, // Raw for sorting
                'date' => Carbon::createFromTimestamp($lastModifiedTimestamp)->format('Y-m-d H:i:s'), // Formatted for display
                'date_timestamp' => $lastModifiedTimestamp, // Timestamp for sorting
                'path' => $file,
            ];
        })->all();

        return $backups;
    }

    /**
     * Formats bytes into a human-readable string.
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

    /**
     * Handles the deletion of a backup file.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete(Request $request)
    {
        if (! Auth::user()->hasAccess('platform.backups.delete')) {
            abort(403, 'Unauthorized action.');
        }

        $filePath = $request->input('path');
        $diskName = config('backup.backup.destination.disks')[0] ?? 'local';

        if (Storage::disk($diskName)->exists($filePath)) {
            try {
                Storage::disk($diskName)->delete($filePath);
                // dd(Storage::disk($diskName)->exists($filePath));
                Toast::success('Backup file deleted successfully!');
            } catch (\Exception $e) {
                Toast::error('Failed to delete backup file: '.$e->getMessage());
            }
        } else {
            Toast::error('Backup file not found.');
        }

        return redirect()->back();
    }

    /**
     * Handles the download of a backup file.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\RedirectResponse
     */
    public function download(Request $request)
    {
        if (! Auth::user()->hasAccess('platform.backups.download')) {
            abort(403, 'Unauthorized action.');
        }
        // dd($request);
        $encodedPath = $request->query('encodedPath');
        if ($encodedPath === null) {
            Toast::error('Backup is missing path!');

            return redirect()->back();
        }
        $filePath = base64_decode($encodedPath);
        $diskName = config('backup.backup.destination.disks')[0] ?? 'local';
        // dd($encodedPath === null, $filePath);
        if (Storage::disk($diskName)->exists($filePath)) {
            try {
                $stream = Storage::disk($diskName)->readStream($filePath);

                return response()->stream(function () use ($stream) {
                    fpassthru($stream);
                    if (is_resource($stream)) {
                        fclose($stream);
                    }
                }, 200, [
                    'Content-Type' => 'application/zip',
                    'Content-Disposition' => 'attachment; filename="'.basename($filePath).'"',
                    'Content-Length' => Storage::disk($diskName)->size($filePath),
                ]);
            } catch (\Exception $e) {
                Toast::error('Failed to download backup file: '.$e->getMessage());
            }
        } else {
            Toast::error('Backup file not found: '.basename($filePath));
        }

        return redirect()->back();
    }

    /**
     * Manually trigger a database backup.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createDbBackup()
    {
        if (! Auth::user()->hasAccess('platform.backups.create')) {
            abort(403, 'Unauthorized action.');
        }

        try {
            \Artisan::call('backup:run', ['--only-db' => true]);
            Toast::success('Database backup initiated successfully!');
        } catch (\Exception $e) {
            Toast::error('Failed to create database backup: '.$e->getMessage());
        }

        return redirect()->route('platform.backups.list');
    }
}
