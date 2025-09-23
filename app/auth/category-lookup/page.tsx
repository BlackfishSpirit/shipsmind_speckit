"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface CategoryResult {
  code: string;
  name: string;
}

export default function CategoryLookupPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Interface for google_categories table structure
  interface GoogleCategory {
    category_code: string;
    category_name: string;
  }

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      window.location.href = '/auth';
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError("");
    setShowResults(false);

    try {
      console.log('Searching for categories:', searchTerm);

      // Query the google_categories table from Supabase
      const { data, error } = await supabase
        .from('google_categories')
        .select('*')
        .ilike('category', `%${searchTerm}%`)
        .limit(50);

      if (error) {
        console.error('Error searching categories:', error);
        throw new Error(`Failed to search categories: ${error.message}`);
      }

      console.log('Search results:', data);
      console.log('First result structure:', data?.[0]);

      // Convert to our interface format - we'll determine the actual column names from the data
      const categoryResults: CategoryResult[] = (data || []).map((item: any) => {
        // Try different possible column name combinations
        const code = item.code || item.category_code || item.id || Object.values(item)[0];
        const name = item.category || item.name || item.category_name || Object.values(item)[1];

        return {
          code: String(code),
          name: String(name)
        };
      });

      setResults(categoryResults);
      setShowResults(true);
      setSelectedCategories(new Set());

      if (categoryResults.length === 0) {
        setError("No categories found. Try a different search term.");
      }
    } catch (error: any) {
      console.error('Error performing search:', error);
      setError(error.message || 'An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCategories.size === results.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(results.map(r => r.code)));
    }
  };

  const handleCategoryToggle = (code: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCategories(newSelected);
  };

  const handleSaveAndSearchAgain = () => {
    if (selectedCategories.size === 0) {
      setError("Please select at least one category");
      return;
    }

    setMessage(`Saved ${selectedCategories.size} category(ies): ${Array.from(selectedCategories).join(", ")}`);
    setSearchTerm("");
    setResults([]);
    setSelectedCategories(new Set());
    setShowResults(false);
  };

  const handleSaveAndReturn = () => {
    if (selectedCategories.size === 0) {
      setError("Please select at least one category");
      return;
    }

    // Get selected category codes and names for better UX
    const selectedCategoryData = results.filter(cat => selectedCategories.has(cat.code));
    const categoryCodes = selectedCategoryData.map(cat => cat.code).join(",");

    // Store in localStorage for the main page to pick up
    localStorage.setItem('selectedCategories', categoryCodes);

    // Redirect back to main auth page
    window.location.href = "/auth";
  };

  const handleClose = () => {
    window.location.href = "/auth";
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {authLoading ? "Loading..." : "Checking authentication..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Category Lookup</h2>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to Main Page
          </Link>
          <button
            onClick={handleClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {message}
        </div>
      )}

      {/* Search Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Categories</h3>
        <p className="text-sm text-gray-600">
          Search for category codes to add to your SERP settings. Select the categories you want and choose your save option.
        </p>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter category name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="rounded-lg bg-brand-600 px-6 py-3 text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {showResults && results.length > 0 && (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <button
            onClick={handleSaveAndSearchAgain}
            disabled={selectedCategories.size === 0}
            className="rounded-lg bg-brand-600 px-4 py-2 text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
          >
            Save & Search Again
          </button>
          <button
            onClick={handleSaveAndReturn}
            disabled={selectedCategories.size === 0}
            className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            Save & Return
          </button>
          <span className="text-sm text-gray-600">
            Select categories below, then choose a save option
          </span>
        </div>
      )}

      {/* Results Section */}
      <div>
        {isLoading && (
          <div className="text-center py-8 text-gray-600">
            Searching categories...
          </div>
        )}

        {showResults && results.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-600">
            No categories found. Try a different search term.
          </div>
        )}

        {showResults && results.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.size === results.length && results.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Category Code
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Category Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((category) => (
                  <tr
                    key={category.code}
                    className={`hover:bg-gray-50 ${
                      selectedCategories.has(category.code) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category.code)}
                        onChange={() => handleCategoryToggle(category.code)}
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">
                      {category.code}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {category.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}