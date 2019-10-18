import React, { Component } from 'react'
import './UpdateBookmark.css'
import BookmarksContext from '../BookmarksContext';
import config from '../config';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

export default class name extends Component {

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(resData => {
        this.setState({
          id: resData.id,
          title: resData.title,
          url: resData.url,
          description: resData.description,
          rating: resData.rating,
        })
      })
      .catch(error => this.setState({ error }))
  }

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }


  render() {
    const { title, url, description, rating, error } = this.state
    return (
      <section>
        <h2>Update Article</h2>
        <form
          className='UpdateBookmark__form'
          onSubmit={this.handleSubmit}
        >
        <div className='AddBookmark__error' role='alert'>
          {error && <p>{error.message}</p>}
        </div>
        <div>
          <label htmlFor='title'>
            Title
            {' '}
            <Required />
          </label>
          <input
            type='text'
            name='title'
            id='title'
            placeholder='Great website!'
            value={title}
            onChange={this.handleChangeTitle}
            required
          />
        </div>
        <div>
          <label htmlFor='url'>
            URL
            {' '}
            <Required />
          </label>
          <input
            type='url'
            name='url'
            id='url'
            placeholder='https://www.great-website.com/'
            value={url}
            onChange={this.handleChangeUrl}
            required
          />
        </div>
        <div>
          <label htmlFor='description'>
            Description
          </label>
          <textarea
            name='description'
            id='description'
            value={description}
            onChange={this.handleChangeDescription}
          />
        </div>
        <div>
          <label htmlFor='rating'>
            Rating
            {' '}
            <Required />
          </label>
          <input
            type='number'
            name='rating'
            id='rating'
            defaultValue='1'
            min='1'
            max='5'
            value={rating}
            onChange={this.handleChangeRating}
            required
          />
        </div>
        <div className='UpdateBookmark__buttons'>
          <button type='button' onClick={this.handleClickCancel}>
            Cancel
          </button>
          {' '}
          <button type='submit'>
            Save
          </button>
        </div>
        </form>
      </section>
    );
  }
}
