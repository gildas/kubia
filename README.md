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


