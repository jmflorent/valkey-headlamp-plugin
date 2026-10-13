import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';

export function valkeyClusterClass() {
  const group = 'valkey.io';
  const version = 'v1alpha1';

  const ValkeyCluster = makeCustomResourceClass({
    apiInfo: [{ group, version }],
    isNamespaced: true,
    singularName: 'ValkeyCluster',
    pluralName: 'valkeyclusters',
    kind: 'ValkeyCluster',
    customResourceDefinition: {
      getMainAPIGroup: () => [group, version],
    } as any,
  });

  return ValkeyCluster;
}

export function valkeyNodeClass() {
  const group = 'valkey.io';
  const version = 'v1alpha1';

  const ValkeyNode = makeCustomResourceClass({
    apiInfo: [{ group, version }],
    isNamespaced: true,
    singularName: 'ValkeyNode',
    pluralName: 'valkeynodes',
    kind: 'ValkeyNode',
    customResourceDefinition: {
      getMainAPIGroup: () => [group, version],
    } as any,
  });

  return ValkeyNode;
}

export interface ValkeyClusterSpec {
  image?: string;
  replicas?: number;
  shards?: number;
  workloadType?: string;
  persistence?: {
    size?: string;
    storageClassName?: string;
    reclaimPolicy?: string;
  };
}

export interface ValkeyClusterStatus {
  state?: string;
  reason?: string;
  message?: string;
  readyShards?: number;
  shards?: number;
}

export interface ValkeyNodeStatus {
  ready?: boolean;
  role?: string;
  podName?: string;
  podIP?: string;
}

export interface ValkeyPodLabels {
  'valkey.io/cluster'?: string;
  'valkey.io/shard-index'?: string;
  'valkey.io/node-index'?: string;
}

export type StatusSeverity = 'good' | 'warning' | 'error';

const GOOD_STATES = new Set(['ready', 'available', 'healthy', 'online', 'succeeded', 'running']);
const WARNING_STATES = new Set([
  'reconciling',
  'progressing',
  'pending',
  'missingreplica',
  'waiting',
  'unknown',
]);
const ERROR_STATES = new Set(['failed', 'error', 'crashed', 'offline', 'degraded']);

export function statusSeverity(status: string | undefined): StatusSeverity | null {
  if (!status) {
    return null;
  }
  const s = status.toLowerCase();
  if (GOOD_STATES.has(s)) {
    return 'good';
  }
  if (WARNING_STATES.has(s)) {
    return 'warning';
  }
  if (ERROR_STATES.has(s)) {
    return 'error';
  }
  return null;
}
