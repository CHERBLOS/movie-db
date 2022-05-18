import React from 'react'
import { Spin, Pagination, Alert } from 'antd'

import ItemList from '../item-list'
import SearchLine from '../searchLine'
import MoviesService from '../../services/movies-service'
import Navigation from '../navigation'
import { ServiceProvider } from '../../services/service-context'

import './app.css'
import 'antd/dist/antd.min.css'

class App extends React.Component {
  static MoviesReq = new MoviesService()

  static createCardFilm = (data) => ({
    id: data.id,
    title: data.title,
    date: data.release_date,
    genres: data.genre_ids,
    overview: data.overview,
    img: data.poster_path,
    rate: data.vote_average,
    rating: data.rating || 0,
  })

  constructor() {
    super()
    this.state = {
      searchString: null,
      films: [],
      isLoading: false,
      current: 1,
      totalItems: null,
      error: false,
      tab: 'Search',
    }
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.init()
  }

  componentDidCatch() {
    this.setState({ error: true })
  }

  async getMoviesItems(page = 1) {
    try {
      const { searchString, tab, guestSessionId } = this.state
      if (searchString && tab === 'Search') {
        this.setState(() => ({ isLoading: true }))
        const movieList = await App.MoviesReq.getMovies(searchString, page).then((data) => data)
        this.setTotalItems(movieList.total_results)
        this.setMovies(movieList)
      } else if (tab === 'Rated') {
        const movieList = await App.MoviesReq.getRatedMovies(guestSessionId).then((data) => data)
        this.setTotalItems(movieList.total_results)
        this.setMovies(movieList)
      }
    } catch (err) {
      this.setError(err)
    }
  }

  async setMovies(data) {
    const arr = data.results.map((item) => App.createCardFilm(item))
    if (arr.length) {
      this.setState(() => ({ films: arr, isLoading: false }))
    } else {
      this.setState({ isLoading: false })
    }
  }

  setTotalItems(totalItems) {
    this.setState({ totalItems })
  }

  onChange = (page) => {
    this.setState({
      current: page,
    })
    this.getMoviesItems(page)
  }

  setError() {
    this.setState({
      error: true,
      isLoading: false,
    })
  }

  setSearchString = (searchString) => {
    this.setState({ searchString, films: [], current: 1, error: false })
    this.getMoviesItems()
  }

  setTab = (tab) => {
    this.setState(
      {
        tab,
        searchString: null,
        films: [],
        isLoading: tab === 'Rated',
      },
      this.getMoviesItems
    )
  }

  init = () => {
    App.MoviesReq.createGuestSession().then((data) => {
      this.setState({ guestSessionId: data.guest_session_id })
    })
    App.MoviesReq.getGenres().then((data) => {
      this.setState({ genres: data.genres })
    })
    this.inputRef.current.focus()
  }

  render() {
    const { searchString, films, isLoading, current, totalItems, error, tab, guestSessionId, genres } = this.state
    const spinner = isLoading ? (
      <div className="app__spinner">
        <Spin size="large" />
      </div>
    ) : null
    const content =
      !isLoading && !error && (searchString || tab === 'Rated') ? (
        <ServiceProvider value={genres}>
          <ItemList className="app_list" films={films} guestSessionId={guestSessionId} searchString={searchString} />
        </ServiceProvider>
      ) : null
    const errorMessage = error ? (
      <Alert message="Sorry, we didn't have info for this film" type="error" showIcon />
    ) : null
    const pagination =
      !isLoading && !error && searchString && films.length ? (
        <Pagination
          className="app__pagination"
          current={current}
          onChange={this.onChange}
          total={totalItems}
          defaultPageSize={20}
          showSizeChanger={false}
        />
      ) : null
    const searchLine =
      tab === 'Search' ? <SearchLine inputRef={this.inputRef} setSearchString={this.setSearchString} /> : null
    return (
      <div className="app">
        <Navigation setTab={this.setTab} />
        {searchLine}
        {spinner}
        {content}
        {errorMessage}
        {pagination}
      </div>
    )
  }
}

export default App
