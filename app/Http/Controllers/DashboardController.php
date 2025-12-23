<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Pastikan return ke file yang benar
        return Inertia::render('Dashboard/Index');
    }
}