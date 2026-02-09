import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-5xl font-bold mb-4 text-green-700">Online Shopping System <br/> for Old Materials</h1>
      <p className="text-xl mb-8">Buy, Sell, and Recycle Reusable Materials</p>
      
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
          Register
        </Link>
        <Link href="/products" className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-100">
          Browse Products
        </Link>
      </div>
    </main>
  )
}
