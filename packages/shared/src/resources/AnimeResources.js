import useRequest from '../hooks/useRequest';

export function useAnimeResources() {
    const { spinner, error, request, resetError } = useRequest();

    const apiUrl = 'https://api.jikan.moe/v4/';

    const getAllCharacters = async (page) => {
        try {
            const res = await request(`${apiUrl}characters?page=${page}`);
            return res.data.map(transformCharacter);
        } catch (error) { }
    }

    const getCharacter = async (id) => {
        try {
            const res = await request(`${apiUrl}characters/${id}/full`);

            if (!res) {
                throw new Error(`Could not data`);
            }

            return transformCharacter(res.data);
        } catch (error) { }
    }

    const getAllManga = async (page) => {
        try {
            const res = await request(`${apiUrl}manga?page=${page}`);
            return res.data.map(transformManga);
        } catch (error) {}
    }

    const getManga = async (id) => {
        const res = await request(`${apiUrl}manga/${id}`);
        return transformManga(res.data);
    }

    const transformCharDescription = descr => {
        const index = descr.indexOf('\n\n');
        if (descr.includes('\n\n') && descr.length - index > 30) {
            return descr.slice(descr.indexOf('\n\n') + 2, -1);
        } else if (descr.includes('\n\n') && descr.length - index < 30) {
            return descr.slice(0, descr.indexOf('\n\n'));
        }

        return descr;
    }

    const transformMangaDescription = descr => {
        if (descr.includes('[Written by MAL Rewrite]')) {
            return descr.slice(0, descr.indexOf('[Written by MAL Rewrite]'));
        } else if (descr.includes('(Source:')) {
            return descr.slice(0, descr.indexOf('(Source:'));
        } else if (descr.includes('Included one-shot')) {
            return descr.slice(0, descr.indexOf('Included one-shot'));
        }
    }

    const transformCharacter = (char) => {
        const description = !char.about ? 'No description' : transformCharDescription(char.about);

        return {
            id: char.mal_id,
            name: char.name,
            description: description.length > 210 ? description.slice(0, 210) + '...' : description,
            thumbnail: char.images.jpg.image_url,
            homepage: char.url,
            wiki: char.url,
            comics: char.anime && char.anime.length > 10 ? char.anime.slice(0, 10) : char.anime
        }
    }

    const transformManga = (manga) => {
        const description = !manga.synopsis ? 'No description' : transformMangaDescription(manga.synopsis);

        return {
            id: manga.mal_id,
            thumbnail: manga.images.jpg.image_url,
            title: !manga.title_english ? manga.title : manga.title_english,
            author: manga.authors,
            description: description,
            chapters: manga.chapters ? manga.chapters : 'Unknown',
            volumes: manga.volumes ? manga.volumes : 'Unknown',
            genres: manga.genres
        }
    }

    return { getAllCharacters, getCharacter, getAllManga, getManga, spinner, error, resetError };
}