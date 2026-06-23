<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    // LIST ALL REPORTS
    public function index()
    {
        return response()->json(Report::all());
    }

    // CREATE REPORT
    public function store(Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'post_id' => 'required|exists:posts,id'
        ]);

        $report = Report::create([
            'reason' => $request->reason,
            'post_id' => $request->post_id,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Report created successfully',
            'report' => $report
        ]);
    }

    // SHOW REPORT
    public function show(string $id)
    {
        return response()->json(
            Report::with([
                'user:id,name',
                'post:id,title'
            ])->findOrFail($id)
        );
    }

    // UPDATE REPORT
    public function update(Request $request, string $id)
    {
        $report = Report::findOrFail($id);

        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'reason' => 'required|string'
        ]);

        $report->update([
            'reason' => $request->reason
        ]);

        return response()->json([
            'message' => 'Report updated successfully',
            'report' => $report
        ]);
    }

    // DELETE REPORT
    public function destroy(Request $request, string $id)
    {
        $report = Report::findOrFail($id);

        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully'
        ]);
    }
}