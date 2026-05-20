import { Library as LibIcon, Book, Download } from "lucide-react";

export default function Library() {
  const books = [
    { title: "You Don't Know JS Yet", author: "Kyle Simpson", type: "Intermediate" },
    { title: "Eloquent JavaScript", author: "Marijn Haverbeke", type: "Beginner" },
    { title: "Pro React 16", author: "Cássio de Sousa Antonio", type: "Advanced" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl font-black mb-2 relative z-10 flex items-center gap-3">
          <LibIcon className="w-8 h-8 text-teal-400" />
          Digital Career Library
        </h1>
        <p className="text-white/70 relative z-10 max-w-2xl">
          Search and download programming books, white papers, and articles.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6 font-black">Books & Manuals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-teal-500/30 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-4">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-primary dark:text-white mb-1">{b.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{b.author}</p>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-t border-gray-100 dark:border-white/5 pt-4">
                <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 text-[10px] uppercase font-bold">{b.type}</span>
                <button className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
