import React from 'react'

export default class ResizableImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enlarged: false,
      imageSourceWidth: null,
      imageSourceHeight: null,
      imageHeight: null,
      imageWidth: null
    }
  }

  changeImageSize = (e) => {
    e.stopPropagation()
    if (this.state.enlarged) {
      this.setState({
        imageSourceWidth: null,
        imageSourceHeight: null,
        imageHeight: null,
        imageWidth: null
      })
    }
    this.setState({enlarged: !this.state.enlarged})
    return false
  }

  onImageLoad = (e) => {
    this.setState({
      imageSourceHeight: e.target.offsetHeight,
      imageSourceWidth: e.target.offsetWidth
    },
      this.updateImageDimensions
    )
  }

  componentDidMount = () => {
    this.updateImageDimensions()
    window.addEventListener('resize', this.updateImageDimensions)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateImageDimensions)
  }

  updateImageDimensions = () => {
    const yRatio = window.innerHeight / this.state.imageSourceHeight
    const xRatio = window.innerWidth / this.state.imageSourceWidth
    const ratio = Math.min(xRatio, yRatio, 1)

    this.setState({
      imageHeight: this.state.imageSourceHeight * ratio,
      imageWidth: this.state.imageSourceWidth * ratio
    })
  }

  render () {
    const image = <img
      alt={'content'}
      className={'flashcard-thumbnail'}
      src={this.props.image.url}
      onClick={this.changeImageSize}
    />
    if (this.state.enlarged) {
      return (
        <span>
          {image}
          <div className={'fullscreen-container'} onClick={this.changeImageSize}>
            <div className={'fullscreen-image-container'}>
              <img
                alt={'content'}
                className={'flashcard-thumbnail-enlarged'}
                src={this.props.image.url}
                style={{
                  height: this.state.imageHeight ? this.state.imageHeight : 'null',
                  width: this.state.imageWidth ? this.state.imageWidth : 'null'
                }}
                onLoad={this.onImageLoad}
              />
              <div className={'fullscreen-image-subtitle-container'}>
                <p>Click anywhere to hide image</p>
              </div>
            </div>
          </div>
        </span>
      )
    } else {
      return image
    }
  }
}
