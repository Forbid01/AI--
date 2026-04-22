import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Сайт олдсонгүй</h1>
        <p className="text-white/60 mb-8">Хайж буй хуудас байхгүй эсвэл устгагдсан байж магадгүй.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors"
        >
          Нүүр рүү буцах
        </Link>
      </div>
    </main>
  );
}
