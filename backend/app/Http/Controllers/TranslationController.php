<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use OpenApi\Attributes\AdditionalProperties;
use OpenApi\Attributes\Get;
use OpenApi\Attributes\JsonContent;
use OpenApi\Attributes\PathParameter;
use OpenApi\Attributes\Response;
use OpenApi\Attributes\Schema;

#[Schema(schema: 'LangObject', type: 'object', additionalProperties: new AdditionalProperties(oneOf: [
    new Schema(type: 'string'),
    new Schema(ref: '#/components/schemas/LangObject'),
]))]
class TranslationController extends Controller
{
    #[Get(path: '/api/translations/{locale}/{module}', tags: ['translation'])]
    #[PathParameter(name: 'locale', required: true, schema: new Schema(type: 'string'))]
    #[PathParameter(name: 'module', required: true, schema: new Schema(type: 'string'))]
    #[Response(response: 200, description: 'test', content: new JsonContent(ref: '#/components/schemas/LangObject'))]
    #[Response(response: 404, description: 'Language/Module not found', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    // #[Response(response: 404, description: 'Module not found', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    #[Response(response: 422, description: 'Validation error', content: new JsonContent(ref: '#/components/schemas/ErrorObject'))]
    public function index(string $locate, string $module)
    {
        $path = base_path("lang/{$locate}");

        if (File::exists($path)) {
            $modules = File::allFiles($path);

            foreach ($modules as $moduleFile) {
                if ($moduleFile->getFilename() !== "{$module}.php") {
                    continue;
                }
                $data = require $moduleFile->getPathname();

                return response()->json($data);
            }

            return response()->json(['message' => 'Module not found'], 404);
        } else {
            return response()->json(['message' => 'Language not found'], 404);
        }
    }

    // private function loadTranslations($locale)
    // {
    //     $translations = [];
    //     // Define the path to the language files
    //     $path = base_path("lang/{$locale}");
    //     // Check if the directory exists
    //     if (File::exists($path)) {
    //         // Get all PHP files in the directory
    //         $files = File::allFiles($path);
    //         foreach ($files as $file) {
    //             // Get the file name without extension
    //             $fileName = $file->getFilenameWithoutExtension();
    //             // Merge the translations from the file into the translations array
    //             $translations = array_merge($translations, require $file->getRealPath());
    //         }
    //     }
    //     return $translations;
    // }
}
