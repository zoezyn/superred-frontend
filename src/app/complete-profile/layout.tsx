export default function CompleteProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <header className="bg-zinc-900 border-b border-zinc-800 py-4">
        <div className="container mx-auto px-6">
          <h1 className="text-xl font-bold text-brand">Super Red</h1>
        </div>
      </header> */}
      
      <main className="flex-1 py-12">
        {children}
      </main>
    </div>
  )
} 