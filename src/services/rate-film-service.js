class RateFilmService {
  apiBaseUrl = 'https://api.themoviedb.org/3/'

  apiKey = '8cdbcb69927731dd18111701af8de0a5'

  async rateFilm(rating, filmId, guestSessionID) {
    const url = `${this.apiBaseUrl}movie/${filmId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionID}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: rating,
      }),
    })
    if (!res.ok) {
      throw new Error(`Huoston,we have a problem: ${res.status} at ${url}`)
    }
    const body = await res.json()
    return body
  }
}

export default new RateFilmService()
