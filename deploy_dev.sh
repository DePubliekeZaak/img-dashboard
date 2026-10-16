npm run build:dev
# --delete: keep the deployed tree exactly in sync with the build output so
# stale source maps / old per-topic bundles are removed instead of accumulating
# (they previously leaked full source on the public server).
rsync -avz --delete public/ img:/var/www/html/dev/
