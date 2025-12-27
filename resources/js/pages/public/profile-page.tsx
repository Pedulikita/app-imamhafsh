import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { MessageCircle, Printer, Twitter } from 'lucide-react';

interface ProfilePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  meta_description: string | null;
}

interface PageProps {
  page: ProfilePage;
}

export default function ProfilePageShow({ page }: PageProps) {
  return (
    <PublicLayout>
      <Head title={page.title}>
        {page.meta_description && (
          <meta name="description" content={page.meta_description} />
        )}
      </Head>

      {/* Banner Image */}
      {page.image && (
        <div className="w-full">
          <img 
            src={page.image} 
            alt={page.title}
            className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
          />
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Title Section with Social Buttons */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
            {page.title}
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()}
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              aria-label="Print"
            >
              <Printer className="size-5" />
            </button>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(page.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
              aria-label="Share on Twitter"
            >
              <Twitter className="size-5" />
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(page.title + ' ' + window.location.href)}`, '_blank')}
              className="rounded-full bg-green-100 p-2 text-green-600 transition hover:bg-green-200"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle className="size-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-slate max-w-none prose-headings:text-blue-600 prose-headings:font-bold prose-h2:text-xl prose-h2:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-xl prose-img:shadow-lg prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-6">
              {/* Quick Info Card */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-800">Informasi</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="leading-relaxed">
                    Halaman ini dikelola secara dinamis melalui dashboard admin.
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-4 text-lg font-bold text-slate-800">Hubungi Kami</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <div className="font-semibold text-slate-700">WhatsApp</div>
                    <div>+62 8xx-xxxx-xxxx</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">Email</div>
                    <div>info@imamhafsh.com</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-700">Alamat</div>
                    <div>Bandung, Jawa Barat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
