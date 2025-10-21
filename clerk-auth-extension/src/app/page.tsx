import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Empathetic Insights
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Emotion-Adaptive Voice AI Interviewer
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The first market research tool that analyzes emotional context in real-time
            to uncover the truth behind consumer responses.
          </p>

          <div className="flex gap-4 justify-center mt-8">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors border-2 border-indigo-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Hackathon Project - Phase 2</p>
          </div>
        </div>
      </div>
    </main>
  );
}
