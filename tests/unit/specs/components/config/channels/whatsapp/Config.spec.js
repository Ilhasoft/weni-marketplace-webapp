jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));
jest.mock('lodash.debounce', () => jest.fn((fn) => fn));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { singleApp } from '../../../../../../__mocks__/appMock.js';
import i18n from '@/utils/plugins/i18n';

import whatsappConfig from '@/components/config/channels/whatsapp/Config.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('WhatsAppConfig.vue', () => {
  let wrapper;

  let actions;
  let store;

  beforeEach(() => {
    actions = {
      getConversations: jest.fn(() => {
        return { data: singleApp };
      }),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(whatsappConfig, {
      localVue,
      i18n,
      store,
      propsData: {
        app: singleApp,
      },
      stubs: {
        DynamicForm: true,
        UnnnicTab: true,
        UnnnicIconSvg: true,
        UnnnicInput: true,
        UnnnicButton: true,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('updateContactInfoInput()', () => {
    it('should set contact info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateContactInfoInput(inputData);
      expect(wrapper.vm.contactInfoInputs[inputData.index].value).toEqual(inputData.value);
    });
  });
  describe('updateProfileInput()', () => {
    it('should set profile info input data correctly', async () => {
      const inputData = {
        index: 0,
        value: 'value',
      };
      expect(wrapper.vm.profileInputs[inputData.index].value).not.toEqual(inputData.value);
      wrapper.vm.updateProfileInput(inputData);
      expect(wrapper.vm.profileInputs[inputData.index].value).toEqual(inputData.value);
    });
  });
  describe('closeConfig()', () => {
    it('should emit closeModal', () => {
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closeConfig();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });

  describe('handleDateFilter()', () => {
    it('should call getConversations()', async () => {
      const event = {
        startDate: '03-12-22',
        endDate: '04-13-23',
      };
      expect(actions.getConversations).not.toHaveBeenCalled();
      await wrapper.vm.handleDateFilter(event);
      expect(actions.getConversations).toHaveBeenCalledTimes(1);
      expect(actions.getConversations).toBeCalledWith(expect.any(Object), {
        code: singleApp.code,
        appUuid: singleApp.uuid,
        params: {
          start: event.startDate,
          end: event.endDate,
        },
      });
    });
  });
});
