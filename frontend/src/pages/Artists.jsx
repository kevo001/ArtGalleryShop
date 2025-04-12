import "../styles/Artists.css"

const Artists = () => {
    return (
        <div>
    
    <div className="search-filter-container">
        <input type="text" id="searchBar" placeholder="Search artists..." onkeyup="filterArtists()"/>
        <select id="categoryFilter" onchange="filterArtists()">
            <option value="all">All Categories</option>
            <option value="Paintings">Paintings</option>
            <option value="Sculptures">Sculptures</option>
            <option value="Photography">Photography</option>
            <option value="Digital Art">Digital Art</option>
        </select>
    </div>
    
    <main>
        <section className="artists-section">
            <h1>Meet Our Artists</h1>
            <div className="artists-grid" id="artistsGrid">
                <a href="/Artist1.html" class="artist-link">
                    <div className="artist-card" data-category="Paintings Sculptures">
                        <img src="/Images/Axel.jpg" alt="Axel Tostrup Evensen"/>
                        <div className="artist-info">
                            <h2>Axel Tostrup Evensen</h2>
                            <div className="categories">
                                <p>Paintings</p>
                                <p>Sculptures</p>
                            </div>
                        </div>
                    </div>
                </a>
                
                <a href="another-artist.html" className="artist-link"/>
                    <div className="artist-card" data-category="Photography Digital Art"/>
                        <img src="artist2.jpg" alt="Another Artist"/>
                        <div className="artist-info">
                            <h2>Another Artist</h2>
                            <div className="categories">
                                <p>Photography</p>
                            <p>Digital Art</p>
                        </div>
                    </div>
                </div>
        </section>
    </main>
    </div>
    );
};

export default Artists;