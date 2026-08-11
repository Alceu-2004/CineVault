import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/movie";
import { useAuth } from "./AuthContext";

interface WatchedMovie extends Movie {
    userRating: number;
}

interface MoviesContextType {
    watchedMovies: WatchedMovie[];
    wantToWatchMovies: Movie[];
    isLoading: boolean;

    addWatchedMovie: (movie: Movie, userRating: number) => Promise<void>;
    removeWatchedMovie: (movieId: string) => Promise<void>;
    addWantToWatchMovie: (movie: Movie) => Promise<void>;
    removeWantToWatchMovie: (movieId: string) => Promise<void>;
    isMovieWatched: (movieId: string) => boolean;
    isMovieWantToWatch: (movieId: string) => boolean;

    moveFromWantToWatchToWatched: (
        movieId: string,
        movie: Movie,
        userRating: number
    ) => Promise<void>;
}

const MoviesContext = createContext<MoviesContextType>({} as MoviesContextType);

export function MoviesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
    const [wantToWatchMovies, setWantToWatchMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Chaves de armazenamento específicas do usuário logado. Sem usuário
    // (ex: durante o carregamento inicial ou logout), não hidrata dados de
    // ninguém — evita misturar listas entre contas diferentes no mesmo aparelho.
    const watchedKey = user ? `watchedMovies:${user}` : null;
    const wantToWatchKey = user ? `wantToWatchMovies:${user}` : null;

    useEffect(() => {
        if (!user) {
            // Ninguém logado: limpa o estado em memória (ex: acabou de fazer logout)
            setWatchedMovies([]);
            setWantToWatchMovies([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        Promise.all([loadWatchedMovies(), loadWantToWatchMovies()]).finally(() => {
            setIsLoading(false);
        });
    }, [user]);

    async function loadWatchedMovies() {
        if (!watchedKey) return;
        try {
            const stored = await AsyncStorage.getItem(watchedKey);
            setWatchedMovies(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error("Erro ao carregar filmes assistidos:", error);
        }
    }

    async function loadWantToWatchMovies() {
        if (!wantToWatchKey) return;
        try {
            const stored = await AsyncStorage.getItem(wantToWatchKey);
            setWantToWatchMovies(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error("Erro ao carregar filmes que quero assistir:", error);
        }
    }

    async function addWatchedMovie(movie: Movie, userRating: number) {
        if (!watchedKey) return;
        try {
            const newWatchedMovie: WatchedMovie = {
                ...movie,
                userRating: userRating,
            };

            const updatedMovies = [...watchedMovies, newWatchedMovie];
            await AsyncStorage.setItem(watchedKey, JSON.stringify(updatedMovies));
            setWatchedMovies(updatedMovies);
        } catch (error) {
            console.error("Erro ao adicionar filme assistido:", error);
        }
    }

    async function removeWatchedMovie(movieId: string) {
        if (!watchedKey) return;
        try {
            const updatedMovies = watchedMovies.filter((movie) => movie.id !== movieId);
            await AsyncStorage.setItem(watchedKey, JSON.stringify(updatedMovies));
            setWatchedMovies(updatedMovies);
        } catch (error) {
            console.error("Erro ao remover filme assistido:", error);
        }
    }


    async function addWantToWatchMovie(movie: Movie) {
        if (!wantToWatchKey) return;
        try {
            const updatedMovies = [...wantToWatchMovies, movie];
            await AsyncStorage.setItem(wantToWatchKey, JSON.stringify(updatedMovies));
            setWantToWatchMovies(updatedMovies);
        } catch (error) {
            console.error("Erro ao adicionar filme que quero assistir:", error);
        }
    }

    async function removeWantToWatchMovie(movieId: string) {
        if (!wantToWatchKey) return;
        try {
            const updatedMovies = wantToWatchMovies.filter((movie) => movie.id !== movieId);
            await AsyncStorage.setItem(wantToWatchKey, JSON.stringify(updatedMovies));
            setWantToWatchMovies(updatedMovies);
        } catch (error) {
            console.error("Erro ao remover filme que quero assistir:", error);
        }
    }

    async function moveFromWantToWatchToWatched(
        movieId: string,
        movie: Movie,
        userRating: number
    ) {
        if (!wantToWatchKey) return;
        try {
            const updatedWantToWatch = wantToWatchMovies.filter((m) => m.id !== movieId);
            await AsyncStorage.setItem(wantToWatchKey, JSON.stringify(updatedWantToWatch));
            setWantToWatchMovies(updatedWantToWatch);

            await addWatchedMovie(movie, userRating);

        } catch (error) {
            console.error("Erro ao mover filme:", error);
        }
    }


    function isMovieWatched(movieId: string): boolean {
        return watchedMovies.some((movie) => movie.id === movieId);
    }

    function isMovieWantToWatch(movieId: string): boolean {
        return wantToWatchMovies.some((movie) => movie.id === movieId);
    }

    return (
        <MoviesContext.Provider
            value={{
                watchedMovies,
                wantToWatchMovies,
                isLoading,
                addWatchedMovie,
                removeWatchedMovie,
                addWantToWatchMovie,
                removeWantToWatchMovie,
                isMovieWatched,
                isMovieWantToWatch,
                moveFromWantToWatchToWatched,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
}

export function useMovies() {
    return useContext(MoviesContext);
}
