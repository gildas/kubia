# Kubia learning....

## Docker stuff

Build the docker image:

```sh
cd docker-v1
docker build -t gildas/kubia:1.0.0 .
docker tag gildas/kubia:1.0.0 gildas/kubia:latest
docker push gildas/kubia
```

## Kubernetes fun...

### Deploying with a Replication Controller

Let's run the application 1.0.0 with a replication controller and a load balancer

```yaml
apiVersion: v1
kind: List
items:
  - apiVersion: v1
    kind: ReplicationController
    metadata:
      name: kubia-v1
    spec:
      replicas: 3
      template:
        metadata:
          name: kubia
          labels:
            app: kubia
        spec:
          containers:
            - image: gildas/kubia:1.0.0
              name:  nodejs
  - apiVersion: v1
    kind: Service
    metadata:
      name: kubia
    spec:
      type: LoadBalancer
      selector:
        app: kubia
      ports:
        - name:       http
          port:       80
          targetPort: 8080
          protocol:   TCP
```

Run:

```sh
kubectl apply -f app-rc.yaml
```

### Rolling out v2

Now let's buid the v2 of the app:

```sh
cd docker-v2
docker build -t gildas/kubia:2.0.0 .
docker tag gildas/kubia:2.0.0 gildas/kubia:latest
docker push gildas/kubia
```

Now, let's roll the new version:

```sh
kubectl rolling-update kubia-v1 kubia-v2 --image=gildas/kubia:2.0.0
```

### Deploying with a Deployment

Create a new manifest:

```yaml
apiVersion: v1
kind: Deployment
metadata:
  name: kubia
spec:
  replicas: 3
  template:
    metadata:
      name: kubia
      labels:
        app: kubia
    spec:
      container:
        - image: gildas/kubia:1.0.0
          name:  nodejs
```

Let's create the deployment:

```sh
kubectl create -f app-db-1.0.0.yaml --record
```

Check the evolution if the deployment:

```sh
kubectl rollout status deployment kubia
```

We just use the same service for now.

Now, we can change the deployment specs dynamically:

```sh
kubectl patch deployment kubia -p '{"spec": {"minReadySeconds": 10}}'
```

Now let's deploy a 2.0.0 version:

```sh
kubectl set image deployment kubia nodejs=gildas/kubia:2.0.0
```

Check the roll-out:

```sh
kubecrl rollout status deployment kubia
```

You should see the version being rolled out.

If we need to undo a rollout, use this:

```sh
kubectl rollout undo deployment kubia
```

To get the history of rollouts (that is the reason for `--record` when creating the deployment):

```sh
kubectl rollout history deployment kubia
```

You can also pause/resume a rollout:

```sh
kubectl rollout pause deployment kubia
kubectl rollout resume deployment kubia
```

