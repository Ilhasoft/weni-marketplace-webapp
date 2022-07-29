import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import OtherApps from '@/views/OtherApps.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('OtherApps.vue', () => {
  let wrapper;
  let store;
  let getters;

  beforeEach(() => {
    process.env.VUE_APP_FLOWS_IFRAME_URL = 'flows_url';

    getters = {
      getSelectedFlowOrg: jest.fn(() => {
        return '123';
      }),
    };

    store = new Vuex.Store({
      getters,
    });

    wrapper = shallowMount(OtherApps, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        iframe: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return iframeSrc based on flowOrg', () => {
    expect(wrapper.vm.iframeSrc).toEqual(
      `${
        process.env.VUE_APP_FLOWS_IFRAME_URL
      }/weni/${getters.getSelectedFlowOrg()}/authenticate?next=/org/home/?flows_config_hide=configs`,
    );
  });

  describe('onLoad()', () => {
    it('should set loading to false', () => {
      expect(wrapper.vm.loading).toEqual(true);
      wrapper.vm.onLoad();
      expect(wrapper.vm.loading).toEqual(false);
    });
  });
});
