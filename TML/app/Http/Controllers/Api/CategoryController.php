<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // LIST ALL
    public function index()
    {
        return response()->json(Category::all());
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $category = Category::create([
            'name' => $request->name
        ]);

        return response()->json($category);
    }

    // SHOW ONE
    public function show(string $id)
    {
        return response()->json(Category::findOrFail($id));
    }

    // UPDATE
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return response()->json($category);
    }

    // DELETE
    public function destroy(string $id)
    {
        Category::destroy($id);

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}