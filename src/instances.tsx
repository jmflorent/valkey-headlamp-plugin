import { K8s } from '@kinvolk/headlamp-plugin/lib';
import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { StatusChip } from './components';
import { ValkeyPodLabels } from './resources';

/**
 * Valkey instance pods, identified by the valkey-operator label
 * valkey.io/cluster. Shard/node placement comes from the operator's labels.
 */
export function ValkeyInstances() {
  const { items: pods } = K8s.ResourceClasses.Pod.useList() as any;

  const valkeyPods = (pods ?? []).filter((p: any) => p.metadata?.labels?.['valkey.io/cluster']);

  return (
    <ResourceListView
      title="Valkey Instances"
      data={valkeyPods}
      columns={[
        'name',
        'namespace',
        {
          id: 'cluster',
          label: 'Cluster',
          getValue: (pod: any) => (pod.metadata?.labels as ValkeyPodLabels)?.['valkey.io/cluster'],
        },
        {
          id: 'shard',
          label: 'Shard',
          getValue: (pod: any) => (pod.metadata?.labels as ValkeyPodLabels)?.['valkey.io/shard-index'],
        },
        {
          id: 'node-index',
          label: 'Node Index',
          getValue: (pod: any) => (pod.metadata?.labels as ValkeyPodLabels)?.['valkey.io/node-index'],
        },
        {
          id: 'phase',
          label: 'Phase',
          getValue: (pod: any) => pod.jsonData?.status?.phase,
          render: (pod: any) => <StatusChip status={pod.jsonData?.status?.phase} />,
        },
        {
          id: 'restarts',
          label: 'Restarts',
          getValue: (pod: any) => {
            const statuses = pod.jsonData?.status?.containerStatuses ?? [];
            return statuses.reduce((acc: number, c: any) => acc + (c.restartCount ?? 0), 0);
          },
        },
        'age',
      ]}
    />
  );
}
