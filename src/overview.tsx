import { K8s } from '@kinvolk/headlamp-plugin/lib';
import { Link, ResourceListView, SectionBox, SimpleTable } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { ReadyChip, RoleChip,StatusChip } from './components';
import {
  valkeyClusterClass,
  ValkeyClusterSpec,
  ValkeyClusterStatus,
  valkeyNodeClass,
  ValkeyNodeStatus,
} from './resources';

const ValkeyCluster = valkeyClusterClass();
const ValkeyNode = valkeyNodeClass();

function SummaryCard(props: { title: string; children: React.ReactNode }) {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="h5" component="div">
        {props.children}
      </Typography>
    </Paper>
  );
}

export function ValkeyOverview() {
  const { items: clusters } = ValkeyCluster.useList() as any;
  const { items: nodes } = ValkeyNode.useList() as any;
  const { items: pods } = K8s.ResourceClasses.Pod.useList() as any;

  const cluster = clusters?.[0];
  const status = (cluster?.jsonData?.status ?? {}) as ValkeyClusterStatus;
  const spec = (cluster?.jsonData?.spec ?? {}) as ValkeyClusterSpec;

  const valkeyNodes = (nodes ?? []) as any[];
  const readyNodes = valkeyNodes.filter(n => (n.jsonData?.status as ValkeyNodeStatus)?.ready).length;
  const primaries = valkeyNodes.filter(
    n => (n.jsonData?.status as ValkeyNodeStatus)?.role?.toLowerCase() === 'primary'
  ).length;
  const replicas = valkeyNodes.length - primaries;

  const valkeyPods = (pods ?? []).filter(
    (p: any) => p.metadata?.labels?.['valkey.io/cluster']
  );

  const podByName: Record<string, any> = {};
  (valkeyPods as any[]).forEach(p => {
    podByName[p.metadata.name] = p;
  });

  const conditions = cluster?.jsonData?.status?.conditions ?? [];

  return (
    <SectionBox title="Valkey Overview" backLink={false}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Cluster State">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StatusChip status={status.state} />
            </Box>
            {status.message && (
              <Typography variant="caption" color="text.secondary">
                {status.message}
              </Typography>
            )}
          </SummaryCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Nodes Ready">
            {readyNodes} / {valkeyNodes.length}
          </SummaryCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Roles">
            {primaries} primary, {replicas} replica
          </SummaryCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Image">
            {spec.image ?? '-'}
            <Typography variant="caption" display="block" color="text.secondary">
              {spec.replicas ?? '-'} replicas, {spec.shards ?? '-'} shard(s)
            </Typography>
          </SummaryCard>
        </Grid>
      </Grid>

      <SectionBox title="Cluster Spec">
        <SimpleTable
          columns={[
            { label: 'Image', datum: 'image' },
            { label: 'Replicas', datum: 'replicas' },
            { label: 'Shards', datum: 'shards' },
            { label: 'Persistence', datum: 'persistence' },
            { label: 'Workload Type', datum: 'workloadType' },
          ]}
          data={
            cluster
              ? [
                  {
                    image: spec.image ?? '-',
                    replicas: String(spec.replicas ?? '-'),
                    shards: String(spec.shards ?? '-'),
                    persistence: spec.persistence
                      ? `${spec.persistence.size ?? '?'} on ${spec.persistence.storageClassName ?? '?'} (${spec.persistence.reclaimPolicy ?? '?'})`
                      : 'none',
                    workloadType: spec.workloadType ?? '-',
                  },
                ]
              : null
          }
          emptyMessage="No ValkeyCluster found"
        />
      </SectionBox>

      <SectionBox title="Conditions">
        <SimpleTable
          columns={[
            { label: 'Type', datum: 'type' },
            { label: 'Status', datum: 'status' },
            { label: 'Reason', datum: 'reason' },
            { label: 'Message', datum: 'message' },
            { label: 'Since', datum: 'age' },
          ]}
          data={conditions.map((c: any) => ({
            type: c.type,
            status: c.status,
            reason: c.reason ?? '-',
            message: c.message ?? '-',
            age: c.lastTransitionTime
              ? Math.round((Date.now() - new Date(c.lastTransitionTime).getTime()) / 86400000) + 'd'
              : '-',
          }))}
          emptyMessage="No conditions reported"
        />
      </SectionBox>

      <ResourceListView
        title="Nodes"
        headerProps={{ noNamespaceFilter: true }}
        data={nodes}
        columns={[
          {
            id: 'name',
            label: 'Name',
            getValue: (node: any) => node.metadata?.name,
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
            getValue: (node: any) => ((node.jsonData?.status as ValkeyNodeStatus)?.ready ? 'Ready' : 'Not Ready'),
            render: (node: any) => <ReadyChip ready={node.jsonData?.status?.ready} />,
          },
          {
            id: 'pod',
            label: 'Pod',
            getValue: (node: any) => (node.jsonData?.status as ValkeyNodeStatus)?.podName,
            render: (node: any) => {
              const podName = node.jsonData?.status?.podName;
              const pod = podByName[podName];
              return pod ? <Link kubeObject={pod} /> : (podName ?? '-');
            },
          },
          {
            id: 'podip',
            label: 'Pod IP',
            getValue: (node: any) => (node.jsonData?.status as ValkeyNodeStatus)?.podIP,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
