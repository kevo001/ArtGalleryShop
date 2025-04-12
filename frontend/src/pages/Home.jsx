import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* NAVIGATION */}
       <header className="flex flex-col items-center py-6 bg-black text-white border-b border-gray-700">
        <h1 className="text-4xl font-light">galleri edwin</h1>
        <p className="text-sm text-gray-400 mt-2">Discover the exceptional living with art</p>
        <nav className="flex space-x-6 mt-6">
          <a href="/" className="text-white border-b-2 border-white pb-1">Home</a>
          <a href="/shop" className="text-gray-400 hover:text-white">Shop</a>
          <a href="/artists" className="text-gray-400 hover:text-white">Artist</a>
          <a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a>
          <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
          <a href="/viamilano" className="text-gray-400 hover:text-white">Viamilano</a>
        </nav>

        {/* Sign In Button*/}
        <Link 
          to="/signin" // Link to Sign-In page
          className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400 ml-6"
          >
            Sign In 
          </Link>
      </header>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center text-center py-16 px-6 bg-[#1A1A1A]">
        <img src="/images/IMG_9161.jpeg" alt="Featured Artwork" className="w-64 rounded-lg shadow-md" />
        <div className="mt-8">
          <h2 className="text-3xl font-bold">The Uncanny Charm of Everyday Chaos</h2>
          <p className="text-gray-400 mt-4">Hoffsveien 22, 0275 Oslo<br />Viamilano Lab<br />Open by appointment</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mt-8 px-6">
        <input
          className="w-full max-w-lg px-6 py-3 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          type="text"
          placeholder="Søk tusenvis av kunstverk og kunstnerprofiler..."
        />
      </div>

      {/* COLLECTION */}
      <section className="mt-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Explore Our Collection</h2>
        <p className="text-gray-400 mt-4">
          Immerse yourself in a curated selection of sculptures, paintings, and other unique pieces.
        </p>

        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-gray-900 p-8 rounded-lg">
            {[{ src: "/images/Shop1.jpeg", title: "Abstract Sculpture", desc: "A unique expression of contemporary artistry." },
              { src: "/images/IMG_4500.jpeg", title: "Sculpture II", desc: "A modern interpretation of form and space." },
              { src: "/images/IMG_9166.jpeg", title: "Abstract Sculpture", desc: "A dynamic piece blending tradition and innovation." },
              { src: "/images/Skjermbilde 2023-11-07 kl. 18.10_edited.jpg", title: "Sculpture I", desc: "An intriguing sculpture with organic textures." }
            ].map((art, index) => (
              <div key={index} className="bg-black p-6 rounded-lg shadow-md">
                <img src={art.src} alt={art.title} className="w-full rounded-lg" />
                <h4 className="text-lg font-bold mt-4">{art.title}</h4>
                <p className="text-gray-400">{art.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <div className="mt-16 text-center bg-black py-8">
        <h2 className="text-3xl font-bold">Sign up to our mailing list</h2>
        <div className="mt-6 flex justify-center">
          <input
            type="email"
            placeholder="Your Email"
            className="w-80 px-6 py-3 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-r-lg hover:bg-yellow-400 transition">Subscribe</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto text-center py-8 text-gray-500 bg-black border-t border-gray-700">
        <p>&copy; 2025 Galleri Edwin. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;