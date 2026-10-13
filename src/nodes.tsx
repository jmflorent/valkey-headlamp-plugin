import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { ReadyChip, RoleChip } from './components';
import { valkeyNodeClass, ValkeyNodeStatus } from './resources';

const ValkeyNode = valkeyNodeClass();

export function ValkeyNodes() {
  const { items: nodes } = ValkeyNode.useList() as any;

  return (
    <ResourceListView
      title="Valkey Nodes"
      headerProps={{ noNamespaceFilter: true }}
      data={nodes}
      columns={[
        {
          id: 'name',
          label: 'Name',
          getValue: (node: any) => node.metadata?.name,
        },
        {
          id: 'namespace',
          label: 'Namespace',
          getValue: (node: any) => node.metadata?.namespace,
        },
        {
          id: 'role',
          label: 'Role',
          getValue: (node: any) => (node.jsonData?.status as ValkeyNodeStatus)?.role,
          render: (node: any) => <RoleChip role={node.jsonData?.status?.role} />,
        },
        {
          id: 'ready',
          label: 'Ready',
          getValue: (node: any) =>
            (node.jsonData?.status as ValkeyNodeStatus)?.ready ? 'Ready' : 'Not Ready',
          render: (node: any) => <ReadyChip ready={node.jsonData?.status?.ready} />,
        },
        {
          id: 'pod',
          label: 'Pod',
          getValue: (node: any) => (node.jsonData?.status as ValkeyNodeStatus)?.podName,
        },
        {
          id: 'podip',
          label: 'Pod IP',
          getValue: (node: any) => (node.jsonData?.status as ValkeyNodeStatus)?.podIP,
        },
        'age',
      ]}
    />
  );
}

