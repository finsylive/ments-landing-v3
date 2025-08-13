import SubstackEmbeds from '@/components/blog/SubstackEmbeds';

export default function BlogPage() {
  return (
    <div className='bg-white'>
    <div className="container mx-auto pt-40 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Blog</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Insights, stories, and updates from the Ments team. Explore our latest thinking on startups, product, and community.</p>
      </div>
      {/* Embed feed */}
      <SubstackEmbeds />
    </div>
    </div>
  );
}
