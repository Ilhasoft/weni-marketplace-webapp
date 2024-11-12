import { defineStore } from 'pinia';
import { captureSentryException } from '@/utils/sentry';
import emailApi from '@/api/appType/email';

export const email_store = defineStore('email', {
  state() {
    return {
      code: null,
      tokens: null,
      loadingTokens: false,
      errorGetTokens: null,
    };
  },
  actions: {
    async getTokens({ code }) {
      this.loadingTokens = true;
      try {
        const data = await emailApi.getTokens(code);
        this.tokens = data;
      } catch (err) {
        captureSentryException(err);
        this.errorGetTokens = err.response?.data.error || err;
        this.loadingTokens = false;
      }
    },
    async login({ code }) {
      if (!code) return;
      console.log('set code:', code);
      this.code = code;
    },
  },
});