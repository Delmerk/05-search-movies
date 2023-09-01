import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies.js'

//Hacer todo el fetching de la peli, el estado.
export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  // el error no se usa pero puedes implementarlo
  // si quieres:
  const [, setError] = useState(null)
  const previousSearch = useRef(search)

  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return
    // search es ''

    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      // tanto en el try como despues catch
      setLoading(false)
    }
  }, [])

  //ordenar por title
  //useMemo para mejorar rendimiento y evitar calculos.
  const sortedMovies = useMemo(() => {
    return sort
    //sort compará entre a y b
    //comparar strings
      ? [...movies].sort((a, b) => a.year.localeCompare(b.year))
      : movies
  }, [sort, movies])//cuando cambie el sort o las movies, entonces vuelves a calcular el valor de sortedMovies. De lo contrario no.
 
  /*
  //ordenar por title
  const sortedMovies = useMemo(() => {
    return sort
    //sort compará entre a y b
    //comparar strings
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies])
  */

  //en movies la lista de peliculas y getMovies una forma de recuperar las peliculas.
  return { movies: sortedMovies, getMovies, loading }
}
