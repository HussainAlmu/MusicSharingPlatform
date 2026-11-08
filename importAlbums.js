require("dotenv").config();

const mongoose = require("mongoose");
const connectToDB = require("./db");

const Album = require("./models/Album.js");
const Artist = require("./models/Artist.js");
const Genre = require("./models/Genre.js");
const Song = require("./models/Song.js");

const artists = [
    // Indie / Alternative
    "Radiohead",
    "The Strokes",
    "Arctic Monkeys",
    "Tame Impala",
    "The 1975",
    "The Neighbourhood",
    "Cage the Elephant",
    "Vampire Weekend",
    "The Smiths",
    "The Cure",
    "Beach House",
    "Mac DeMarco",
    "MGMT",
    "Gorillaz",
    "Blur",
    "Oasis",
    "The Killers",
    "Franz Ferdinand",
    "Interpol",
    "Yeah Yeah Yeahs",
    "The xx",
    "Foals",
    "Glass Animals",
    "TV Girl",
    "The Last Shadow Puppets",

    // Rock / Classic Rock
    "Pink Floyd",
    "Nirvana",
    "David Bowie",
    "Queen",
    "The Beatles",
    "Led Zeppelin",
    "The Rolling Stones",
    "Fleetwood Mac",
    "The Doors",
    "AC/DC",
    "Metallica",
    "Red Hot Chili Peppers",
    "Foo Fighters",
    "Green Day",
    "The Smashing Pumpkins",
    "Paramore",
    "My Chemical Romance",
    "Linkin Park",
    "The White Stripes",
    "Arctic Monkeys",

    // Pop
    "Taylor Swift",
    "Billie Eilish",
    "Lana Del Rey",
    "Lorde",
    "Ariana Grande",
    "Dua Lipa",
    "Olivia Rodrigo",
    "Sabrina Carpenter",
    "Charli XCX",
    "Lady Gaga",
    "Katy Perry",
    "Rihanna",
    "Kesha",
    "Miley Cyrus",
    "Carly Rae Jepsen",
    "Madonna",
    "Michael Jackson",
    "The Weeknd",
    "Justin Bieber",
    "Harry Styles",

    // Hip-Hop / Rap
    "Kendrick Lamar",
    "Tyler, The Creator",
    "Kanye West",
    "Frank Ocean",
    "Travis Scott",
    "J. Cole",
    "Drake",
    "A$AP Rocky",
    "Mac Miller",
    "Kid Cudi",
    "Childish Gambino",
    "Eminem",
    "Jay-Z",
    "Nas",
    "Outkast",
    "MF DOOM",
    "Joey Bada$$",
    "Denzel Curry",
    "JID",
    "Little Simz",

    // R&B / Soul
    "SZA",
    "Steve Lacy",
    "Daniel Caesar",
    "Frank Ocean",
    "Brent Faiyaz",
    "The Internet",
    "Erykah Badu",
    "Alicia Keys",
    "Usher",
    "Beyoncé",
    "Solange",
    "H.E.R.",
    "Summer Walker",
    "Giveon",
    "Anderson .Paak",

    // Electronic
    "Daft Punk",
    "Aphex Twin",
    "Justice",
    "Calvin Harris",
    "The Chemical Brothers",
    "Disclosure",
    "Porter Robinson",
    "Madeon",
    "Flume",
    "Deadmau5",
    "Four Tet",
    "Skrillex",
    "Moby",
    "Avicii",
    "Jamie xx",

    // Other / International
    "Joji",
    "Rina Sawayama",
    "FKA twigs",
    "Mitski",
    "Japanese Breakfast",
    "Cigarettes After Sex",
    "Men I Trust",
    "Clairo",
    "beabadoobee",
    "Phoebe Bridgers",
    "Sufjan Stevens",
    "Bon Iver",
    "Hozier",
    "The National",
    "Father John Misty"
];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Convert milliseconds into mm:ss
function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Fetch data from iTunes
async function getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Wait between API requests
    await wait(3200);

    return data;
}

async function importAlbums(artists) {
    let imported = 0;

    for (const artistName of artists) {
        try {
            console.log(`Searching for ${artistName}...`);

            // 1. Search for the artist
            const searchUrl =
                `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=10&country=us`;

            const searchData = await getData(searchUrl);

            if (!searchData.results.length) {
                console.log("Artist not found");
                continue;
            }

            const externalArtist = searchData.results.find(
                item => item.artistName.toLowerCase() === artistName.toLowerCase()
            ) || searchData.results[0];

            // 2. Find or create artist
            let artist = await Artist.findOne({
                name: externalArtist.artistName
            });

            if (!artist) {
                artist = await Artist.create({
                    name: externalArtist.artistName
                });
            }

            // 3. Get the artist's albums
            const albumsUrl =
                `https://itunes.apple.com/lookup?id=${externalArtist.artistId}&entity=album&limit=200&country=us`;

            const albumsData = await getData(albumsUrl);

            const externalAlbums = albumsData.results.filter(
                item => item.wrapperType === "collection"
            );

            // 4. Loop through every album
            for (const item of externalAlbums) {
                // Check if album already exists
                let album = await Album.findOne({
                    itunes_id: item.collectionId
                });

                if (album && album.songs.length > 0) {
                    continue;
                }

                if (
                    !item.collectionName ||
                    !item.artworkUrl100 ||
                    !item.releaseDate
                ) {
                    continue;
                }

                console.log(`Importing: ${item.collectionName}`);

                // 5. Get album tracks
                const tracksUrl =
                    `https://itunes.apple.com/lookup?id=${item.collectionId}&entity=song&country=us`;

                const tracksData = await getData(tracksUrl);

                const externalTracks = tracksData.results.filter(
                    track => track.wrapperType === "track"
                );

                const songIds = [];

                // 6. Create every track
                for (let i = 0; i < externalTracks.length; i++) {
                    const track = externalTracks[i];

                    if (!track.trackName) continue;

                    // Check if track already exists
                    let song = await Song.findOne({
                        itunes_track_id: track.trackId
                    });

                    if (!song) {
                        song = await Song.create({
                            itunes_track_id: track.trackId,
                            song_name: track.trackName,
                            duration: formatDuration(track.trackTimeMillis || 0),
                            track_number: track.trackNumber || i + 1,
                            audio_url: ""
                        });
                    }

                    songIds.push(song._id);
                }

                // 7. Find or create genre
                let genre = null;

                if (item.primaryGenreName) {
                    genre = await Genre.findOne({
                        name: item.primaryGenreName
                    });

                    if (!genre) {
                        genre = await Genre.create({
                            name: item.primaryGenreName
                        });
                    }
                }

                // 8. Create or update album
                const albumData = {
                    name: item.collectionName,
                    cover_img: item.artworkUrl100.replace(
                        "100x100bb",
                        "600x600bb"
                    ),
                    release_date: new Date(item.releaseDate),
                    genre: genre ? [genre._id] : [],
                    artist_id: artist._id,
                    description: "",
                    songs: songIds
                };

                if (!album) {
                    await Album.create({
                        ...albumData,
                        itunes_id: item.collectionId
                    });
                } else {
                    album.songs = songIds;
                    await album.save();
                }

                imported++;

                console.log(`${imported} albums imported`);
            }

        } catch (error) {
            console.log(`Error with ${artistName}:`, error.message);
        }
    }

    console.log(`Finished! Imported ${imported} albums.`);
}

async function main() {
    const requestedArtists = process.argv.slice(2).map(name => name.trim()).filter(Boolean);
    const artistsToImport = requestedArtists.length > 0 ? requestedArtists : artists;

    await connectToDB();

    try {
        await importAlbums(artistsToImport);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

main().catch(error => {
    console.error("Album import failed:", error);
    process.exitCode = 1;
});