import 'ember-source/types';
import 'ember-source/types/preview';

import '@glint/environment-ember-loose';

import EmberAsyncDataTemplateRegistry from 'ember-async-data/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export default interface Registry extends EmberAsyncDataTemplateRegistry {}
}
