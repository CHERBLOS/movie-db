import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Rate } from 'antd'
import { format } from 'date-fns'

import RateFilmService from '../../services/rate-film-service'
import { ServiceConsumer } from '../../services/service-context'
import './item.css'
import noImage from '../../assets/img/no-image.png'

class Item extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    date: PropTypes.string,
    overview: PropTypes.string,
    img: PropTypes.string,
    guestSessionId: PropTypes.string,
    id: PropTypes.number,
    averageRate: PropTypes.number,
    genresArr: PropTypes.arrayOf(PropTypes.shape),
  }

  static defaultProps = {
    title: '',
    date: '',
    overview: '',
    img: '',
    guestSessionId: '',
    id: null,
    averageRate: 0,
    genresArr: {},
  }

  static stringSizeControl = (cardDescription, title, genres) => {
    let expectedStringLength = 200
    if (title.length >= 20 && title.length < 38) {
      expectedStringLength -= 65
    } else if (title.length >= 38 && title.length < 63) {
      expectedStringLength -= 110
    } else if (title.length >= 63) {
      expectedStringLength -= 150
    }

    if (genres.length > 3 || (genres.length > 2 && genres.includes(878))) {
      expectedStringLength -= 25
    }

    const string = !cardDescription ? 'Sorry, we have no overview for this film in database' : cardDescription
    if (string.length >= expectedStringLength) {
      let resultString = string.substr(0, expectedStringLength)
      const whitespaceIndex = resultString.lastIndexOf(' ')
      resultString = `${resultString.substr(0, whitespaceIndex)} ...`
      return resultString
    }
    return string
  }

  static getVoteColor(averageRate) {
    if (averageRate < 3) {
      return '1'
    }
    if (averageRate > 7) {
      return '4'
    }
    if (averageRate <= 5 && averageRate >= 3) {
      return '2'
    }
    return '3'
  }

  constructor() {
    super()
    this.state = {
      rate: this.rating,
    }
  }

  componentDidMount() {
    const { rating } = this.props
    if (rating) this.setState({ rate: rating })
  }

  async handleChange(ev, id, guestSessionId) {
    await RateFilmService.rateFilm(ev, id, guestSessionId)
    this.setState({ rate: ev })
  }

  render() {
    const { Title, Text } = Typography
    const { title, date, overview, img, id, guestSessionId, averageRate, genresArr } = this.props
    const { rate } = this.state
    const genres = (
      <div key={id} className="card__textarea-genre">
        <ServiceConsumer>
          {(value) =>
            value.map((genre) =>
              genresArr.includes(genre.id) ? (
                <Text key={id + genre.name} className="card__textarea-genre-item" code>
                  {genre.name}
                </Text>
              ) : null
            )
          }
        </ServiceConsumer>
      </div>
    )
    return (
      <div className="card">
        <img className="card__image" src={img ? `https://image.tmdb.org/t/p/w500${img}` : noImage} alt="film-art" />
        <div className="card__textarea">
          <div className="card__textarea-items">
            <Title className="card__textarea-title" level={4}>
              {title}
            </Title>
            <p className="card__textarea-date">{date ? format(new Date(date), 'PP') : 'no information'}</p>
            {genres}
            <p className="card__textarea-description">{Item.stringSizeControl(overview, title, genresArr)}</p>
          </div>
          <Rate
            allowHalf
            count="10"
            defaultValue={0}
            value={rate}
            onChange={(ev) => this.handleChange(ev, id, guestSessionId)}
          />
        </div>
        <div className="card__rate-block" data-color={Item.getVoteColor(averageRate)}>
          {averageRate}
        </div>
      </div>
    )
  }
}

export default Item
