import "../styles/Home.css"

const Home = () => {
  return (
    <div>
    <div className="header">
        <img src="/images/IMG_9161.jpeg" alt="Featured Artwork" width="200"/>
        <div className="header-text">
        <h2>The Uncanny Charm of Everyday Chaos</h2>
        <p>Hoffsveien 22, 0275 Oslo<br/>Viamilano Lab<br/>Open by appointment</p>
    </div>
</div>
    
    <input className="search-bar" type="text" placeholder="Search thousands of artworks..."/>
    
    <div className="collection">
        <p>Explore Our Collection</p>
        <p>Immerse yourself in a curated selection of sculptures, paintings, and more.</p>
        <div className="gallery">
            <div className="art-item">
                <img src="/images/Shop1.jpeg" alt="Abstract Sculpture" width="100%"/>
                <h4>Abstract Sculpture</h4>
                <p>An expressive sculpture with dynamic forms and contrasts.</p>
            </div>
            <div className="art-item">
                <img src="/images/IMG_4500.jpeg" alt="Sculpture" width="100%"/>
                <h4>The End</h4>
                <p>A vibrant abstract painting capturing bold energy.</p>
            </div>
            <div className="art-item">
                <img src="/images/IMG_9166.jpeg" alt="Abstract Sculpture" width="100%"/>
                <h4>Abstract Sculpture</h4>
                <p>An expressive abstract sculpture with fluid movement.</p>
            </div>
            <div className="art-item">
                <img src="/images/Skjermbilde 2023-11-07 kl. 18.10_edited.jpg" alt="Sculpture" width="100%"/>
                <h4>Sculpture I</h4>
                <p>A dynamic abstract sculpture with bold textures.</p>
            </div>
        </div>
    </div>
    
    <div className="subscribe">
        <h2>Sign up to our mailing list</h2>
        <input type="email" placeholder="Your Email"/>
        <button>Subscribe</button>
    </div>
    
    <div className="footer">
        <p>&copy; 2025 Galleri Edwin. All Rights Reserved.</p>
    </div>
</div>
  );
};

export default Home;
