import Vue from 'vue';
import Clipboard from 'clipboard';
import './shortened.css';

Vue.component('shortened', {
  props: {
    text: {
      type: String,
      required: true
    },
    focus: {
      type: Boolean
    }
  },

  data () {
    return {
      status: '',
      timeout: null
    };
  },

  render () {
    return (
      <div class="shortened input-line">
        <input ref="input" on-click={this.select} value={this.text} readonly />
        <span class="copy">
          <button ref="button" data-clipboard-text={this.text}>COPY IT</button>
          {this.status && (
            <span class="tooltip">{this.status ? (
              'Copied!'
            ) : (
              'Error :('
            )}</span>
          )}
        </span>
      </div>
    )
  },

  mounted () {
    this.focus && this.select();
    const clipboard = new Clipboard(this.$refs.button);
    clipboard.on('success', () => this.setStatus('success'));
    clipboard.on('error', () => this.setStatus('error'));
  },

  methods: {
    select () {
      const { input } = this.$refs;
      input.select();
      input.focus();
    },

    setStatus (status) {
      this.timeout && clearTimeout(this.timeout);
      this.status = status;
      if (!status) { return; }
      this.timeout = setTimeout(
        () => this.status = '',
        1000
      );
    }
  }
})
