# valkey-headlamp-plugin

An unofficial [Headlamp](https://headlamp.dev) plugin for
[Valkey](https://valkey.io) clusters managed by the
[valkey-operator](https://github.com/valkey-io/valkey-operator) (`valkey.io`
CRDs). It adds a **Valkey** section to the Headlamp sidebar with the cluster
state, node roles/health, and instance pods.

There is no official Headlamp plugin for Valkey or Redis (verified October
2026), so this is a home-grown alternative following the same pattern as
[`cloudnative-pg/cnpg-headlamp-plugin`](https://github.com/cloudnative-pg/cnpg-headlamp-plugin).
It is not affiliated with or endorsed by the Valkey project.

## What it shows

- **Overview** — cluster state (with the operator's current status message),
  node readiness, primary/replica split, image, the full cluster spec
  (image, replicas, shards, persistence including storage class), operator
  conditions, and a node table with links to the instance pods.
- **Clusters** — the `ValkeyCluster` CRs: state, ready shards, replicas,
  image, persistence.
- **Nodes** — the `ValkeyNode` CRs: role (primary/replica), ready state,
  backing pod, pod IP.
- **Instances** — the valkey pods (identified by the operator's
  `valkey.io/cluster` label) with shard/node placement, phase and restart
  counts.

## Scope and limitations

- **Read-only.** The plugin is a dashboard; it creates and changes nothing.
  For Valkey introspection beyond the Kubernetes API (INFO, cluster slots,
  ACLs), use Headlamp's native pod exec/terminal into an instance.
- **valkey-operator only.** The plugin reads the `valkey.io/v1alpha1`
  `ValkeyCluster` and `ValkeyNode` CRDs. It does **not** support the
  hyperspike.io operator (`valkeys.hyperspike.io`) or plain (operator-less)
  Valkey StatefulSets — those have no CRDs to surface.
- Operator status quirk, surfaced on purpose: the operator's cluster-level
  status can read `Reconciling / readyShards=0` for a long time even while
  every `ValkeyNode` reports ready. The Overview shows both levels so the
  discrepancy is visible instead of hidden.
- Developed and tested against valkey-operator with Headlamp 0.45.0 on
  Kubernetes 1.35. Other versions probably work but are untested.

## Requirements

- A cluster with the valkey-operator installed (CRDs `valkeyclusters.valkey.io`
  and `valkeynodes.valkey.io`).
- RBAC permission to list ValkeyClusters, ValkeyNodes, and Pods.
- Headlamp 0.24+ (dynamic plugin APIs).

## Installing

### From a release

Download the tarball from
[releases](https://github.com/jmflorent/valkey-headlamp-plugin/releases) and
extract it into a Headlamp plugins directory:

```sh
tar -xzf valkey-headlamp-plugin-<version>.tar.gz \
  -C ~/.config/Headlamp/plugins/    # Headlamp desktop app (Linux)
# or run a server against the extracted dir:
headlamp-server -plugins-dir=/path/to/plugins
```

Restart Headlamp and look for the **Valkey** entry in the sidebar (it appears
once you are inside a cluster view).

### From source

```sh
npm ci
npm run build      # produces dist/main.js
npm run package    # produces valkey-headlamp-plugin-<version>.tar.gz
```

Then extract or copy the packaged plugin as above, or run `npm run start` for
a development setup (see the
[Headlamp plugin docs](https://headlamp.dev/docs/latest/development/plugins/)).

### In-cluster (GitOps)

For a server deployment, ship the tarball as a ConfigMap and extract it into
the plugins directory with an init container.
[`deploy/headlamp-plugin-valkey.yaml`](deploy/headlamp-plugin-valkey.yaml)
is a working example (a ConfigMap holding the base64 tarball); the
initContainer side is one line per plugin:

```yaml
initContainers:
- name: install-plugins
  image: ghcr.io/headlamp-k8s/headlamp:v0.45.0
  command: ["sh", "-c", "tar -xzf /plugins/valkey-headlamp-plugin.tar.gz -C /headlamp/plugins"]
  volumeMounts:
  - name: plugins-volume
    mountPath: /headlamp/plugins
  - name: plugin-archive
    mountPath: /plugins
```

## License

[MIT](LICENSE)
