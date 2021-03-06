import Vue from 'vue';
import applications from '~/clusters/components/applications.vue';
import { CLUSTER_TYPE } from '~/clusters/constants';
import eventHub from '~/clusters/event_hub';
import mountComponent from 'helpers/vue_mount_component_helper';
import { APPLICATIONS_MOCK_STATE } from '../services/mock_data';

describe('Applications', () => {
  let vm;
  let Applications;

  beforeEach(() => {
    Applications = Vue.extend(applications);
  });

  afterEach(() => {
    vm.$destroy();
  });

  describe('Project cluster applications', () => {
    beforeEach(() => {
      vm = mountComponent(Applications, {
        applications: APPLICATIONS_MOCK_STATE,
        type: CLUSTER_TYPE.PROJECT,
      });
    });

    it('renders a row for Helm Tiller', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-helm')).not.toBeNull();
    });

    it('renders a row for Ingress', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-ingress')).not.toBeNull();
    });

    it('renders a row for Cert-Manager', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-cert_manager')).not.toBeNull();
    });

    it('renders a row for Prometheus', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-prometheus')).not.toBeNull();
    });

    it('renders a row for GitLab Runner', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-runner')).not.toBeNull();
    });

    it('renders a row for Jupyter', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-jupyter')).not.toBeNull();
    });

    it('renders a row for Knative', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-knative')).not.toBeNull();
    });
  });

  describe('Group cluster applications', () => {
    beforeEach(() => {
      vm = mountComponent(Applications, {
        type: CLUSTER_TYPE.GROUP,
        applications: APPLICATIONS_MOCK_STATE,
      });
    });

    it('renders a row for Helm Tiller', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-helm')).not.toBeNull();
    });

    it('renders a row for Ingress', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-ingress')).not.toBeNull();
    });

    it('renders a row for Cert-Manager', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-cert_manager')).not.toBeNull();
    });

    it('renders a row for Prometheus', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-prometheus')).not.toBeNull();
    });

    it('renders a row for GitLab Runner', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-runner')).not.toBeNull();
    });

    it('renders a row for Jupyter', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-jupyter')).toBeNull();
    });

    it('renders a row for Knative', () => {
      expect(vm.$el.querySelector('.js-cluster-application-row-knative')).toBeNull();
    });
  });

  describe('Ingress application', () => {
    describe('when installed', () => {
      describe('with ip address', () => {
        it('renders ip address with a clipboard button', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              ingress: {
                title: 'Ingress',
                status: 'installed',
                externalIp: '0.0.0.0',
              },
            },
          });

          expect(vm.$el.querySelector('.js-endpoint').value).toEqual('0.0.0.0');

          expect(
            vm.$el.querySelector('.js-clipboard-btn').getAttribute('data-clipboard-text'),
          ).toEqual('0.0.0.0');
        });
      });

      describe('with hostname', () => {
        it('renders hostname with a clipboard button', () => {
          vm = mountComponent(Applications, {
            applications: {
              ingress: {
                title: 'Ingress',
                status: 'installed',
                externalHostname: 'localhost.localdomain',
              },
              helm: { title: 'Helm Tiller' },
              cert_manager: { title: 'Cert-Manager' },
              runner: { title: 'GitLab Runner' },
              prometheus: { title: 'Prometheus' },
              jupyter: { title: 'JupyterHub', hostname: '' },
              knative: { title: 'Knative', hostname: '' },
            },
          });

          expect(vm.$el.querySelector('.js-endpoint').value).toEqual('localhost.localdomain');

          expect(
            vm.$el.querySelector('.js-clipboard-btn').getAttribute('data-clipboard-text'),
          ).toEqual('localhost.localdomain');
        });
      });

      describe('without ip address', () => {
        it('renders an input text with a loading icon and an alert text', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              ingress: {
                title: 'Ingress',
                status: 'installed',
              },
            },
          });

          expect(vm.$el.querySelector('.js-ingress-ip-loading-icon')).not.toBe(null);
          expect(vm.$el.querySelector('.js-no-endpoint-message')).not.toBe(null);
        });
      });
    });

    describe('before installing', () => {
      it('does not render the IP address', () => {
        vm = mountComponent(Applications, {
          applications: APPLICATIONS_MOCK_STATE,
        });

        expect(vm.$el.textContent).not.toContain('Ingress IP Address');
        expect(vm.$el.querySelector('.js-endpoint')).toBe(null);
      });
    });

    describe('Cert-Manager application', () => {
      describe('when not installed', () => {
        it('renders email & allows editing', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              cert_manager: {
                title: 'Cert-Manager',
                email: 'before@example.com',
                status: 'installable',
              },
            },
          });

          expect(vm.$el.querySelector('.js-email').value).toEqual('before@example.com');
          expect(vm.$el.querySelector('.js-email').getAttribute('readonly')).toBe(null);
        });
      });

      describe('when installed', () => {
        it('renders email in readonly', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              cert_manager: {
                title: 'Cert-Manager',
                email: 'after@example.com',
                status: 'installed',
              },
            },
          });

          expect(vm.$el.querySelector('.js-email').value).toEqual('after@example.com');
          expect(vm.$el.querySelector('.js-email').getAttribute('readonly')).toEqual('readonly');
        });
      });
    });

    describe('Jupyter application', () => {
      describe('with ingress installed with ip & jupyter installable', () => {
        it('renders hostname active input', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              ingress: {
                title: 'Ingress',
                status: 'installed',
                externalIp: '1.1.1.1',
              },
            },
          });

          expect(vm.$el.querySelector('.js-hostname').getAttribute('readonly')).toEqual(null);
        });
      });

      describe('with ingress installed without external ip', () => {
        it('does not render hostname input', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              ingress: { title: 'Ingress', status: 'installed' },
            },
          });

          expect(vm.$el.querySelector('.js-hostname')).toBe(null);
        });
      });

      describe('with ingress & jupyter installed', () => {
        it('renders readonly input', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              ingress: { title: 'Ingress', status: 'installed', externalIp: '1.1.1.1' },
              jupyter: { title: 'JupyterHub', status: 'installed', hostname: '' },
            },
          });

          expect(vm.$el.querySelector('.js-hostname').getAttribute('readonly')).toEqual('readonly');
        });
      });

      describe('without ingress installed', () => {
        beforeEach(() => {
          vm = mountComponent(Applications, {
            applications: APPLICATIONS_MOCK_STATE,
          });
        });

        it('does not render input', () => {
          expect(vm.$el.querySelector('.js-hostname')).toBe(null);
        });

        it('renders disabled install button', () => {
          expect(
            vm.$el
              .querySelector(
                '.js-cluster-application-row-jupyter .js-cluster-application-install-button',
              )
              .getAttribute('disabled'),
          ).toEqual('disabled');
        });
      });
    });
  });

  describe('Knative application', () => {
    describe('when installed', () => {
      describe('with ip address', () => {
        const props = {
          applications: {
            ...APPLICATIONS_MOCK_STATE,
            knative: {
              title: 'Knative',
              hostname: 'example.com',
              status: 'installed',
              externalIp: '1.1.1.1',
            },
          },
        };
        it('renders ip address with a clipboard button', () => {
          vm = mountComponent(Applications, props);

          expect(vm.$el.querySelector('.js-knative-endpoint').value).toEqual('1.1.1.1');

          expect(
            vm.$el
              .querySelector('.js-knative-endpoint-clipboard-btn')
              .getAttribute('data-clipboard-text'),
          ).toEqual('1.1.1.1');
        });

        it('renders domain & allows editing', () => {
          expect(vm.$el.querySelector('.js-knative-domainname').value).toEqual('example.com');
          expect(vm.$el.querySelector('.js-knative-domainname').getAttribute('readonly')).toBe(
            null,
          );
        });

        it('renders an update/save Knative domain button', () => {
          expect(vm.$el.querySelector('.js-knative-save-domain-button')).not.toBe(null);
        });

        it('emits event when clicking Save changes button', () => {
          jest.spyOn(eventHub, '$emit');
          vm = mountComponent(Applications, props);

          const saveButton = vm.$el.querySelector('.js-knative-save-domain-button');

          saveButton.click();

          expect(eventHub.$emit).toHaveBeenCalledWith('saveKnativeDomain', {
            id: 'knative',
            params: { hostname: 'example.com' },
          });
        });
      });

      describe('without ip address', () => {
        it('renders an input text with a loading icon and an alert text', () => {
          vm = mountComponent(Applications, {
            applications: {
              ...APPLICATIONS_MOCK_STATE,
              knative: {
                title: 'Knative',
                hostname: 'example.com',
                status: 'installed',
              },
            },
          });

          expect(vm.$el.querySelector('.js-knative-ip-loading-icon')).not.toBe(null);
          expect(vm.$el.querySelector('.js-no-knative-endpoint-message')).not.toBe(null);
        });
      });
    });
  });
});
