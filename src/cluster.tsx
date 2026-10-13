import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { StatusChip } from './components';
import { valkeyClusterClass, ValkeyClusterSpec, ValkeyClusterStatus } from './resources';

const ValkeyCluster = valkeyClusterClass();

export function ValkeyClusters() {
  const { items: clusters } = ValkeyCluster.useList() as any;

  return (
    <ResourceListView
      title="Valkey Clusters"
      headerProps={{ noNamespaceFilter: true }}
      data={clusters}
      columns={[
        {
          id: 'name',
          label: 'Name',
          getValue: (cluster: any) => cluster.metadata?.name,
        },
        {
          id: 'namespace',
          label: 'Namespace',
          getValue: (cluster: any) => cluster.metadata?.namespace,
        },
        {
          id: 'state',
          label: 'State',
          getValue: (cluster: any) => (cluster.jsonData?.status as ValkeyClusterStatus)?.state,
          render: (cluster: any) => <StatusChip status={cluster.jsonData?.status?.state} />,
        },
        {
          id: 'reason',
          label: 'Message',
          getValue: (cluster: any) => (cluster.jsonData?.status as ValkeyClusterStatus)?.message,
        },
        {
          id: 'ready-shards',
          label: 'Ready Shards',
          getValue: (cluster: any) => {
            const status = cluster.jsonData?.status as ValkeyClusterStatus;
            return `${status?.readyShards ?? 0}/${status?.shards ?? '-'}`;
          },
        },
        {
          id: 'replicas',
          label: 'Replicas',
          getValue: (cluster: any) => (cluster.jsonData?.spec as ValkeyClusterSpec)?.replicas,
        },
        {
          id: 'image',
          label: 'Image',
          getValue: (cluster: any) => (cluster.jsonData?.spec as ValkeyClusterSpec)?.image,
        },
        {
          id: 'persistence',
          label: 'Persistence',
          getValue: (cluster: any) => {
            const persistence = (cluster.jsonData?.spec as ValkeyClusterSpec)?.persistence;
            return persistence ? `${persistence.size} (${persistence.storageClassName})` : 'none';
          },
        },
        'age',
      ]}
    />
  );
}
