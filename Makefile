image-buildx:
	 docker buildx build --platform linux/amd64 -t landing-page --load .

# image-tag:
# 	docker tag landing-page quay.io/zkorum/agora-landing:<some_version>
#
# image-push:
# 	docker push landing-page quay.io/zkorum/agora-landing:<some_version>
