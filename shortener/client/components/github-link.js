// https://github.com/tholman/github-corners
import Vue from 'vue';
import './github-link.css';

Vue.component('github-link', {
  props: {
    hide: {
      type: Boolean
    }
  },

  render() {
    return (
      <div class="github-link-wrapper" style={this.hide && 'opacity:0;'}>
        <a class="github-button" href="https://github.com/vfeskov/link-too-big" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star vfeskov/link-too-big on GitHub">Star</a>
      </div>
    )
  }
})
