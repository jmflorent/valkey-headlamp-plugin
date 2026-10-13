import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import { ValkeyClusters } from './cluster';
import { ValkeyInstances } from './instances';
import { ValkeyNodes } from './nodes';
import { ValkeyOverview } from './overview';

registerSidebarEntry({
  parent: null,
  name: 'valkey',
  label: 'Valkey',
  icon: 'mdi:memory',
  url: '/valkey/overview',
});

registerSidebarEntry({
  parent: 'valkey',
  name: 'valkey-overview',
  label: 'Overview',
  url: '/valkey/overview',
});

registerRoute({
  path: '/valkey/overview',
  sidebar: 'valkey-overview',
  component: ValkeyOverview,
  name: 'valkey-overview',
});

registerSidebarEntry({
  parent: 'valkey',
  name: 'valkey-cluster',
  label: 'Clusters',
  url: '/valkey/clusters',
});

registerRoute({
  path: '/valkey/clusters',
  sidebar: 'valkey-cluster',
  component: ValkeyClusters,
  name: 'valkey-cluster',
});

registerSidebarEntry({
  parent: 'valkey',
  name: 'valkey-nodes',
  label: 'Nodes',
  url: '/valkey/nodes',
});

registerRoute({
  path: '/valkey/nodes',
  sidebar: 'valkey-nodes',
  component: ValkeyNodes,
  name: 'valkey-nodes',
});

registerSidebarEntry({
  parent: 'valkey',
  name: 'valkey-instances',
  label: 'Instances',
  url: '/valkey/instances',
});

registerRoute({
  path: '/valkey/instances',
  sidebar: 'valkey-instances',
  component: ValkeyInstances,
  name: 'valkey-instances',
});
