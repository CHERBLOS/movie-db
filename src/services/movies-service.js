class MoviesService {
  apiBaseUrl = 'https://api.themoviedb.org/3/'

  async getResourse(query) {
    try {
      const responce = await fetch(`${this.apiBaseUrl}${query}`)

      if (!responce.ok) {
        throw new Error(`Could not fetch ${query}, received ${responce.status}`)
      }

      const data = await responce.json()
      return data
    } catch {
      throw new Error('Could not fetch received')
    }
  }

  async getMovies(request, page) {
    const res = await this.getResourse(
      `search/movie?api_key=${process.env.REACT_APP_TOKEN}&language=en-US&query=${request}&page=${page}`
    )
    return res
  }

  async createGuestSession() {
    const res = await this.getResourse(`authentication/guest_session/new?api_key=${process.env.REACT_APP_TOKEN}`)
    return res
  }

  async getGenres() {
    const res = await this.getResourse(`genre/movie/list?api_key=${process.env.REACT_APP_TOKEN}&language=en-US`)
    return res
  }

  async getRatedMovies(guestId) {
    const res = await this.getResourse(
      `guest_session/${guestId}/rated/movies?api_key=${process.env.REACT_APP_TOKEN}&language=en-US&sort_by=created_at.asc`
    )
    return res
  }
}

export default new MoviesService()
