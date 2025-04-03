<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenApi\Attributes\{Get, Response, QueryParameter, Schema, JsonContent, Property, Items, AdditionalProperties};
use Illuminate\Support\Facades\File;

#[Schema(schema: 'LangObject', type: 'object', additionalProperties: new AdditionalProperties(oneOf: [
    new Schema(type: 'string'),
    new Schema(ref: '#/components/schemas/LangObject')
]))]
class TranslationController extends Controller
{
    #[Get(path: '/api/translations')]
    #[QueryParameter(name: 'locale', schema: new Schema(type: 'string'), description: 'Set website lang.', required: true)]
    #[Response(response: 200, description: 'test', content: new JsonContent(ref: '#/components/schemas/LangObject'))]
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'en'); // Default to English
        // Load all translation files for the specified locale
        $translations = $this->loadTranslations($locale);
        return response()->json($translations);
    }
    private function loadTranslations($locale)
    {
        $translations = [];
        // Define the path to the language files
        $path = base_path("lang/{$locale}");
        // Check if the directory exists
        if (File::exists($path)) {
            // Get all PHP files in the directory
            $files = File::allFiles($path);
            foreach ($files as $file) {
                // Get the file name without extension
                $fileName = $file->getFilenameWithoutExtension();
                // Merge the translations from the file into the translations array
                $translations = array_merge($translations, require $file->getRealPath());
            }
        }
        return $translations;
    }
}