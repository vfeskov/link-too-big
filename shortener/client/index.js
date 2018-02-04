import Vue from 'vue';
import 'whatwg-fetch';
import './components/shortened';
import './components/icons/down-icon';
import './components/icons/alert-icon';
import './components/github-link';
import { saveList, loadList } from './local-storage';
import './index.css';

// https://mathiasbynens.be/demo/url-regex @diegoperini's version
const VALID_LINK = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
const HAS_PROTOCOL = /^[a-z]+:\/\//;
const MAX_CHARS = 1000;

new Vue({
  el: '#app',

  data: {
    entered: '',
    assumed: '',
    errorMsg: '',
    error: 'missing',
    blocked: false,
    shortened: '',
    savedList: loadList()
  },

  render () {
    return (
      <div class="app">
        <h1><a href="/">Link Too Big</a></h1>
        <p class="promo"><down-icon /><span>Make Link Short</span><down-icon /></p>
        <form on-submit={this.submit} novalidate>
          <fieldset disabled={this.blocked}>
            <div class="input-line">
              <input type="text"
                     ref="input"
                     v-model={this.entered}
                     autocomplete="off"
                     on-blur={e => this.errorMsg = ''}
                     placeholder="Put your big ass link right here"
              />
              <button type="submit">GO</button>
            </div>
            <div class="error">
              {this.errorMsg && (
                <div class="error-msg"><alert-icon />&nbsp;{this.errorMsg}</div>
              )}
            </div>
          </fieldset>
        </form>
        <div class="done-wrapper">
          {this.shortened && (
            <div class="pulse">
              <p class="promo success">
                <down-icon /><span>BOOM IT&#39;S DONE</span><down-icon />
              </p>
              <shortened text={this.shortened} focus={true} />
            </div>
          )}
        </div>
        {this.savedList.filter(i => i[1] !== this.shortened).map(([big, short], index) => (
          <div key={short}>
            {index === 0 && (
              <p class="promo previously">
                Previously on&nbsp;<strong>Link Too Big</strong>
              </p>
            )}
            <div class="big">{big}</div>
            <shortened text={short}/>
          </div>
        ))}
        <github-link />
      </div>
    )
  },

  watch: {
    entered (link) {
      if (this.beingReset) {
        this.beingReset = false;
        return;
      }
      if (link && link.length > MAX_CHARS) {
        this.entered = link.slice(0, MAX_CHARS);
        return;
      }
      if (link) { this.shortened = '' }
      this.assumed = link && !HAS_PROTOCOL.test(link) ? `http://${link}` : link;
      this.error = this.revalidate();
      this.errorMsg = this.shout();
    }
  },

  methods: {
    submit (e) {
      e.preventDefault();
      if (this.error) {
        this.errorMsg = this.shout();
        this.$refs.input.focus();
        return;
      }
      this.shorten();
    },

    revalidate () {
      const { assumed } = this;
      if (!assumed) {
        return 'missing';
      }
      if (!VALID_LINK.test(assumed)) {
        return 'crazy';
      }
      return '';
    },

    shout () {
      switch (this.error) {
        case 'missing':
          return 'Need that link';
        case 'crazy':
          return 'I don\'t think that\'s a link my dude';
        case 'server4xx':
          return 'Definitely not a link';
        case 'server5xx':
          return 'Something\'s wrong on my side, sorry';
        default:
          return ''
      }
    },

    async shorten () {
      this.shortened = '';
      this.blocked = true;
      try {
        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: this.assumed
        });
        if (response.status !== 201) { throw response; }
        this.shortened = await response.text();
        this.save();
        this.resetForm();
        this.unblock();
      } catch ({ status = 500 }) {
        this.error = `server${Math.floor(status / 100)}xx`;
        this.errorMsg = this.shout();
        this.unblock('and select input');
      }
    },

    resetForm () {
      this.entered = '';
      this.error = 'missing';
      this.errorMsg = '';
      this.beingReset = true;
    },

    async unblock (selectInput) {
      this.blocked = false;
      if (!selectInput) { return; }
      await Vue.nextTick();
      this.$refs.input.select();
    },

    save () {
      const item = [this.assumed, this.shortened];
      this.savedList = [item, ...this.savedList];
      saveList(this.savedList);
    }
  }
});
