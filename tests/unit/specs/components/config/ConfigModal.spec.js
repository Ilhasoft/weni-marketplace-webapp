import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConfigModal from '@/components/config/ConfigModal.vue';
import { singleApp } from '../../../../__mocks__/appMock';
import i18n from '@/utils/plugins/i18n';

import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import telegramConfig from '@/components/config/channels/telegram/Config.vue';

const localVue = createLocalVue();

describe('ConfigModal.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ConfigModal, {
      localVue,
      i18n,
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('closeModal()', () => {
    it('should set showConfirmationModal if confirmation is needed', async () => {
      await wrapper.setData({ needConfirmation: true });
      expect(wrapper.vm.showConfirmationModal).toBeFalsy();
      wrapper.vm.closeModal();
      expect(wrapper.vm.showConfirmationModal).toBeTruthy();
    });

    it('should close modal if no confirmation is needed', async () => {
      await wrapper.setData({ show: true });
      await wrapper.setData({ needConfirmation: false });

      expect(wrapper.vm.show).toBeTruthy();
      wrapper.vm.closeModal();
      expect(wrapper.vm.show).toBeFalsy();
    });
  });

  describe('openModal', () => {
    it('should open configModal', async () => {
      expect(wrapper.vm.currentApp).toMatchObject({});

      wrapper.vm.openModal(singleApp);

      expect(wrapper.vm.show).toBeTruthy();
      expect(wrapper.vm.currentApp).toMatchObject(singleApp);
    });
  });

  describe('setConfirmation()', () => {
    it('should set needConfirmation', () => {
      expect(wrapper.vm.needConfirmation).toBeFalsy();
      wrapper.vm.setConfirmation(true);
      expect(wrapper.vm.needConfirmation).toBeTruthy();
    });
  });

  describe('toggleConfirmationModal()', () => {
    it('should toggle', () => {
      expect(wrapper.vm.showConfirmationModal).toBeFalsy();
      wrapper.vm.toggleConfirmationModal();
      expect(wrapper.vm.showConfirmationModal).toBeTruthy();
    });
  });

  describe('confirmClose()', () => {
    it('should set confirmations and show to false', async () => {
      await wrapper.setData({ needConfirmation: true });
      await wrapper.setData({ showConfirmationModal: true });
      await wrapper.setData({ show: true });

      wrapper.vm.confirmClose();

      expect(wrapper.vm.needConfirmation).toBeFalsy();
      expect(wrapper.vm.showConfirmationModal).toBeFalsy();
      expect(wrapper.vm.show).toBeFalsy();
    });
  });

  describe('currentComponent', () => {
    it('should set current component to WWC', async () => {
      await wrapper.setData({ type: 'wwc' });

      const currentComponent = wrapper.vm.currentComponent;

      expect(currentComponent).toMatchObject(wwcConfig);
    });

    it('should set current component to telegram', async () => {
      await wrapper.setData({ type: 'tg' });

      const currentComponent = wrapper.vm.currentComponent;

      expect(currentComponent).toMatchObject(telegramConfig);
    });

    it('should return default currentComponent', () => {
      const currentComponent = wrapper.vm.currentComponent;

      expect(currentComponent).toMatchObject(wwcConfig);
    });
  });
});
