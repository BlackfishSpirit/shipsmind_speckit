import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to ShipsMind Dashboard
              </h2>
              <p className="text-gray-500">
                Your authentication is working! This is your protected dashboard.
              </p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>User ID:</strong> {userId}</p>
                <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
                <p><strong>Email Verified:</strong> {user?.emailAddresses[0]?.verification?.status === 'verified' ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}