import { PercentageBar } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Chip } from '@mui/material';
import { statusSeverity } from './resources';

export function StatusChip({ status }: { status: string | undefined }) {
  if (!status) {
    return <>-</>;
  }
  const severity = statusSeverity(status);
  const color =
    severity === 'good'
      ? 'success'
      : severity === 'warning'
        ? 'warning'
        : severity === 'error'
          ? 'error'
          : 'default';

  return <Chip size="small" label={status} color={color as any} variant="outlined" />;
}

export function ReadyChip({ ready }: { ready: boolean | undefined }) {
  if (ready === undefined) {
    return <>-</>;
  }
  return (
    <Chip
      size="small"
      label={ready ? 'Ready' : 'Not Ready'}
      color={ready ? 'success' : 'error'}
      variant="outlined"
    />
  );
}

export function RoleChip({ role }: { role: string | undefined }) {
  if (!role) {
    return <>-</>;
  }
  return (
    <Chip
      size="small"
      label={role}
      color={role.toLowerCase() === 'primary' ? 'primary' : 'default'}
      variant={role.toLowerCase() === 'primary' ? 'filled' : 'outlined'}
    />
  );
}

export function CapacityBar({ used, total }: { used: number; total: number }) {
  if (!total) {
    return <>-</>;
  }
  const percent = Math.min(100, Math.round((used / total) * 100));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
      <Box sx={{ flexGrow: 1, mr: 1 }}>
        <PercentageBar data={[{ name: 'Used', value: percent }]} total={100} />
      </Box>
      <Box>{percent}%</Box>
    </Box>
  );
}
